import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';

// Lazy/Stub imports for other pages
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import Heritage from './pages/Heritage';
import Recipes from './pages/Recipes';
import ProductDetail from './pages/ProductDetail';
import RecipeDetail from './pages/RecipeDetail';
import Blog from './pages/Blog';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCategories from './pages/admin/AdminCategories';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/bag" element={<Cart />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
    </Router>
  );
}

export default App;
