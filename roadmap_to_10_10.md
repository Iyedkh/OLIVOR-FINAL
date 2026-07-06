# ROADMAP TO A 10/10 PRODUCTION E-COMMERCE SUITE

This roadmap outlines a step-by-step engineering plan to resolve the security vulnerabilities, architectural bottlenecks, and UX issues identified in the project audit.

---

## PHASE 1: SECURITY & DATA INTEGRITY (CRITICAL)
*Objective: Eliminate all financial manipulation vectors and data leaks on the backend.*

### Step 1.1: Implement Server-Side Price Verification
*   **Location**: `backend/controllers/orderController.js` (inside `addOrderItems`)
*   **Action**: Instead of saving price parameters directly from the request payload, query the database using the product IDs provided in the cart. Recalculate the `itemsPrice`, `taxPrice`, and `totalPrice` on the server before database persistence.
*   **Implementation Example**:
    ```javascript
    let computedItemsPrice = 0;
    const dbOrderItems = [];

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      computedItemsPrice += dbProduct.price * item.qty;
      dbOrderItems.push({
        title: dbProduct.title,
        qty: item.qty,
        image: dbProduct.images[0] || dbProduct.image,
        price: dbProduct.price,
        product: dbProduct._id,
        volume: dbProduct.volume
      });
    }
    // Now calculate taxes and total, compare with client request, and write to database
    ```

### Step 1.2: Eliminate Hashed Password Exposure
*   **Location**: `backend/controllers/userController.js` (inside `getUsers`)
*   **Action**: Exclude the password field when returning all users to the admin interface.
*   **Fix**:
    ```diff
  - const users = await User.find({});
  + const users = await User.find({}).select('-password');
    ```

### Step 1.3: Secure Inventory Transactions & Check Stocks
*   **Location**: `backend/controllers/orderController.js`
*   **Action**:
    1.  Ensure that order requests fail with a `400 Bad Request` if `product.countInStock < item.qty`. Do not silently cap at 0 using `Math.max`.
    2.  Use MongoDB Sessions and Transactions (`conn.startSession()`) so that if order creation fails, inventory reductions are fully rolled back.

---

## PHASE 2: CORE ARCHITECTURE & PERFORMANCE
*Objective: Scale database interactions and transition sorting/filtering to the database layer.*

### Step 2.1: Implement Backend Pagination, Searching, Filtering, and Sorting
*   **Location**: `backend/controllers/productController.js` (`getProducts`)
*   **Action**: Update the endpoint to parse query strings (`?page=1&limit=10&search=basil&category=Premium&sort=price_asc`) and use MongoDB's `.skip()`, `.limit()`, and `.sort()` functions.
*   **Fix**:
    ```javascript
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = 6;
    const keyword = req.query.keyword ? {
      title: { $regex: req.query.keyword, $options: 'i' }
    } : {};
    
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate('category')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(req.query.sortOrder);
      
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
    ```
*   **Action**: Remove client-side pagination, searching, and sorting from `Shop.jsx` and have it trigger API requests to fetch paginated datasets on filter selection or sorting changes.

### Step 2.2: Fix N+1 Queries in Cart Management
*   **Location**: `backend/controllers/userController.js` (`updateCart`)
*   **Action**: Fetch existing products with a single database round-trip rather than executing `Product.exists` inside a loop.
*   **Fix**:
    ```javascript
    const productIds = cartItems.map(item => item.product);
    const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
    const existingProductIds = existingProducts.map(p => p._id.toString());
    const validCartItems = cartItems.filter(item => existingProductIds.includes(item.product));
    user.cart = validCartItems;
    await user.save();
    ```

### Step 2.3: Add Database Optimization Indexes
*   **Location**: `backend/models/Order.js` & `backend/models/Product.js`
*   **Action**: Apply compound or single-field indexes on referenced properties to ensure high-performance querying.
*   ```javascript
    orderSchema.index({ user: 1 });
    productSchema.index({ category: 1 });
    productSchema.index({ title: 'text', description: 'text' }); // enabling fast full-text searching
    ```

---

## PHASE 3: SECURITY & SESSION HARDENING
*Objective: Build robust session management and access controls.*

### Step 3.1: Move JWT to Secure HttpOnly Cookies
*   **Location**: `backend/utils/generateToken.js` & `backend/server.js`
*   **Action**: Stop returning the raw JWT to the client response. Instead, set it as an `httpOnly`, `secure`, `sameSite: 'strict'` cookie.
*   **Fix (Backend)**:
    ```javascript
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    ```
*   **Fix (Frontend)**: Configure Axios to set `withCredentials: true` globally so cookie tokens are automatically passed with requests.

### Step 3.2: Implement Client-Side Route Guards (Route Protection)
*   **Location**: `src/components/ProtectedRoute.jsx`
*   **Action**: Add a route guard component that checks the status of `user` inside `AppContext` and redirects unauthorized guests back to `/login`.
*   **Fix**:
    ```jsx
    import { Navigate, Outlet } from 'react-router-dom';
    import { useApp } from '../context/AppContext';

    export const ProtectedRoute = ({ adminOnly = false }) => {
      const { user, loadingUser } = useApp();
      if (loadingUser) return <Spinner />;
      if (!user) return <Navigate to="/login" replace />;
      if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
      return <Outlet />;
    };
    ```
*   **Action**: Wrap all `/admin` sub-routes and user dashboard routes inside this guard in `App.jsx`.

### Step 3.3: Introduce Rate Limiting and Security Headers
*   **Location**: `backend/server.js`
*   **Action**: Add `express-rate-limit` to prevent brute force attacks and lock down API routes, and apply `helmet` to set secure HTTP headers.
*   ```javascript
    import helmet from 'helmet';
    import rateLimit from 'express-rate-limit';

    app.use(helmet());
    const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
    app.use('/api/', limiter);
    ```

---

## PHASE 4: UX & FRONTEND REFACTORING
*Objective: Smooth the conversion funnel and eliminate layout redundancies.*

### Step 4.1: Fix Checkout Funnel Drop-off (State Retention)
*   **Location**: `src/pages/Checkout.jsx` & `src/pages/Login.jsx`
*   **Action**:
    1.  Store shipping and payment forms inside a persistent local storage key `checkout_form_draft` before redirecting the user to login.
    2.  Include a redirect query parameter (e.g. `/login?redirect=checkout`) when forcing authentication.
    3.  Configure `Login.jsx` to check if a redirect query is present. If it is, route the user back to `/checkout` instead of `/dashboard` upon authentication, loading the form fields directly from `checkout_form_draft`.

### Step 4.2: DRY Refactoring of Client Sidebars
*   **Location**: `src/components/DashboardLayout.jsx`
*   **Action**: Create a single shared wrapper component that exposes a consistent navigation bar, active tab selectors, and sidebar styles.
*   **Action**: Remove the manually duplicated sidebar HTML structures from `Dashboard.jsx`, `OrderHistory.jsx`, and `Wishlist.jsx` and wrap their contents in `<DashboardLayout>`.

### Step 4.3: Resolve Frontend Bugs & Mock Leaks
*   **Wishlist Images**: Replace `src={item.images}` with `src={item.images && item.images.length > 0 ? item.images[0] : item.image}` in `Wishlist.jsx`.
*   **Remove Hardcoded Names**: Replace all `'iyed khouildi'` variables in `AdminOrders.jsx` with dynamic fallbacks like `order.user?.name || 'Guest'`.
*   **Recent Orders**: Connect `Dashboard.jsx` to fetch real order logs from the backend endpoint via `fetchMyOrders` rather than displaying a static mock card.
*   **Volatile Bookmarks**: Save bookmarked recipes to a `wishlist_recipes` array in local storage or persist them in the user document database.

---

## PHASE 5: PRODUCTION-GRADE FEATURES
*Objective: Shift from stubs and mock operations to standard production-ready features.*

### Step 5.1: Integrate Stripe Payment Gateway
*   **Location**: `backend/routes/orderRoutes.js` & `src/pages/Checkout.jsx`
*   **Action**: Replace the simulated payment timeout script with a real Stripe element integration.
*   **Backend**: Install `stripe` package, configure `api/payment/stripe` to generate a `paymentIntent` based on server-verified totals, and verify fulfillment updates using Stripe Webhook signatures.
*   **Frontend**: Mount the `@stripe/react-stripe-js` elements wrapper on the checkout form.

### Step 5.2: Complete Coupon Code Validation
*   **Location**: `backend/models/Coupon.js` & `backend/controllers/orderController.js`
*   **Action**: Transition coupon code verification away from the frontend client. Save discount rates, expiration parameters, and code limits in a new database collection. Ensure the backend order validation module processes coupon logic dynamically during order placement.

### Step 5.3: Add dynamic reviews & rating averages
*   **Location**: Create a `Review` model referencing `Product` and `User`.
*   **Action**: Provide write API endpoints (`/api/products/:id/reviews`) and trigger update methods on the parent `Product` schema to recalculate product rating averages whenever a new review is saved.

---

## PHASE 6: TESTING & DEPLOYMENT
*Objective: Build continuous verification loops and package the application.*

### Step 6.1: Build an Automated Test Suite
*   **Frontend Testing**: Configure `Vitest` and `React Testing Library` to run component unit tests on vital user flows (e.g. adding items to the cart, coupon applications).
*   **Backend Testing**: Configure `Supertest` and `Jest` to perform integration tests on authentication endpoints, route protections, and price parameters.

### Step 6.2: Build Docker Configurations
*   **Action**: Write clean Dockerfiles for both frontend and backend configurations, linking services using `docker-compose.yml` for unified development orchestration.
