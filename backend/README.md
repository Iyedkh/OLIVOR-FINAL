# OLIVOR Luxury E-Commerce Backend

This is the Node.js, Express, and MongoDB backend for the OLIVOR Luxury E-Commerce application. It exposes RESTful APIs for user authentication, product management, order handling, cart/wishlist synchronization, and recipes.

## Technology Stack

- **Node.js & Express**: Application server & routing framework
- **MongoDB & Mongoose**: Database & Object Data Modeling (ODM)
- **JSON Web Tokens (JWT)**: Secure user session authorization
- **Bcrypt.js**: Secure password hashing

---

## Folder Structure

```
backend/
├── config/
│   └── db.js            # Database connection
├── controllers/
│   ├── orderController.js
│   ├── productController.js
│   ├── recipeController.js
│   └── userController.js
├── data/                # Seeding datasets
│   ├── products.js
│   ├── recipes.js
│   └── users.js
├── middleware/
│   └── auth.js          # Authentication protection middleware
├── models/              # Mongoose data schemas
│   ├── Order.js
│   ├── Product.js
│   ├── Recipe.js
│   └── User.js
├── routes/              # Express API route handlers
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   ├── recipeRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── seeder.js        # DB seeding script
├── utils/
│   └── generateToken.js # JWT generator helper
├── .env                 # Environment variables
├── package.json
└── server.js            # Entry point
```

---

## Setup & Run Instructions

### Prerequisites

Make sure you have [MongoDB](https://www.mongodb.com/) installed and running locally on port `27017` (default).

### Installation

From the project root directory, navigate to `backend/` and install dependencies:

```bash
cd backend
npm install
```

### Seeding the Database

To clear your database tables and seed them with premium products, recipes, admin and customer accounts, run:

```bash
npm run data:import
```

> **Default Seed Accounts:**
> - **Admin User**: `admin@olivor.com` / `admin123`
> - **Customer User**: `customer@olivor.com` / `customer123`

To purge all data without importing, run:

```bash
npm run data:destroy
```

### Run the Dev Server

To run the backend development server using `nodemon`:

```bash
npm run dev
```

The API will be live at: [http://localhost:5000](http://localhost:5000)

---

## API Endpoints Reference

### User & Authentication Routes (`/api/users`)

- `POST /api/users/login` - Login user, set token & load profile.
- `POST /api/users` - Register a new customer.
- `GET /api/users/profile` - Get logged-in user profile (Requires Token).
- `PUT /api/users/profile` - Update logged-in user profile (Requires Token).
- `POST /api/users/wishlist` - Toggle item in wishlist (Requires Token).
- `PUT /api/users/cart` - Sync cart items list with database (Requires Token).
- `GET /api/users` - Get all users list (Requires Admin).
- `DELETE /api/users/:id` - Delete a user (Requires Admin).

### Product Routes (`/api/products`)

- `GET /api/products` - Get all products.
- `GET /api/products/:id` - Get product by ID.
- `POST /api/products` - Create product (Requires Admin).
- `PUT /api/products/:id` - Update product details (Requires Admin).
- `DELETE /api/products/:id` - Delete product (Requires Admin).

### Order Routes (`/api/orders`)

- `POST /api/orders` - Place a new order (Requires Token).
- `GET /api/orders/myorders` - Get current user's order history (Requires Token).
- `GET /api/orders/:id` - Get order details by ID (Requires Token).
- `PUT /api/orders/:id/pay` - Simulate payment check (Requires Token).
- `PUT /api/orders/:id/deliver` - Mark order as delivered (Requires Admin).
- `PUT /api/orders/:id/status` - Update order tracking status (Requires Admin).

### Recipe Routes (`/api/recipes`)

- `GET /api/recipes` - Get all recipes.
- `GET /api/recipes/:id` - Get recipe by ID.
- `POST /api/recipes` - Create a recipe (Requires Admin).
- `PUT /api/recipes/:id` - Update a recipe (Requires Admin).
- `DELETE /api/recipes/:id` - Delete a recipe (Requires Admin).
