import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppContext = createContext();

const API_URL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

  // Admin States
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch shop products (paginated/filtered/sorted)
  const fetchShopProducts = async (params = {}) => {
    try {
      const { data } = await axios.get(`${API_URL}/products`, { params });
      return data; // returns { products, page, pages, total }
    } catch (err) {
      console.error('Error fetching shop products:', err);
      return { products: [], page: 1, pages: 1, total: 0 };
    }
  };

  // Fetch Recipes
  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const { data } = await axios.get(`${API_URL}/recipes`);
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async (authToken) => {
    if (!authToken) return;
    try {
      setLoadingUser(true);
      const { data } = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });
      
      // Sync wishlist
      if (data.wishlist) {
        setWishlist(data.wishlist);
      }
      
      // Sync cart
      if (data.cart && data.cart.length > 0) {
        const formattedCart = data.cart.map(item => ({
          id: item.product?._id,
          title: item.product?.title,
          price: item.product?.price,
          quantity: item.qty,
          image: item.product?.images && item.product?.images.length > 0 ? item.product?.images[0] : item.product?.image,
          volume: item.product?.volume,
          region: item.product?.region
        }));
        setCart(formattedCart);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      // Token might be invalid/expired
      logout();
    } finally {
      setLoadingUser(false);
    }
  };

  // Initial loads
  useEffect(() => {
    fetchProducts();
    fetchRecipes();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setUser(null);
      // Load cart/wishlist from localStorage if guest
      const localCart = localStorage.getItem('cart');
      if (localCart) setCart(JSON.parse(localCart));
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) setWishlist(JSON.parse(localWishlist));
    }
  }, [token]);

  // Synchronize cart to localstorage if guest
  useEffect(() => {
    if (!token) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, token]);

  // Synchronize wishlist to localstorage if guest
  useEffect(() => {
    if (!token) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, token]);

  // Sync Cart to Backend
  const syncCartToBackend = async (newCart, authToken) => {
    const activeToken = authToken || token;
    if (!activeToken) return;
    try {
      const cartItems = newCart.map(item => ({
        product: item.id,
        qty: item.quantity
      }));
      await axios.put(`${API_URL}/users/cart`, { cartItems }, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/users/login`, { email, password });
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });

      // Handle backend wishlist
      if (data.wishlist) {
        setWishlist(data.wishlist);
      }

      // Sync backend cart with local cart if local cart has items
      if (cart.length > 0) {
        const mergedCart = [...cart];
        if (data.cart) {
          data.cart.forEach(item => {
            if (item.product) {
              const exists = mergedCart.find(x => x.id === item.product._id);
              if (!exists) {
                mergedCart.push({
                  id: item.product._id,
                  title: item.product.title,
                  price: item.product.price,
                  quantity: item.qty,
                  image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image,
                  volume: item.product.volume,
                  region: item.product.region
                });
              }
            }
          });
        }
        setCart(mergedCart);
        await syncCartToBackend(mergedCart, data.token);
      } else if (data.cart) {
        const formattedCart = data.cart.map(item => ({
          id: item.product?._id,
          title: item.product?.title,
          price: item.product?.price,
          quantity: item.qty,
          image: item.product?.images && item.product?.images.length > 0 ? item.product?.images[0] : item.product?.image,
          volume: item.product?.volume,
          region: item.product?.region
        }));
        setCart(formattedCart);
      }
      toast.success(`Welcome back, ${data.name}!`, { toastId: 'login-success' });
      return { success: true, isAdmin: data.isAdmin };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message, { toastId: 'login-error' });
      return { success: false, message };
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/users`, { name, email, password });

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      });
      setWishlist([]);
      
      // Sync local cart to new account if any
      if (cart.length > 0) {
        await syncCartToBackend(cart, data.token);
      }
      toast.success(`Welcome, ${data.name}! Your account has been created.`, { toastId: 'register-success' });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message, { toastId: 'register-error' });
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    const wasLoggedIn = !!token;
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setAdminOrders([]);
    setAdminUsers([]);
    if (wasLoggedIn) {
      toast.info('Logged out successfully.', { toastId: 'logout-success' });
    }
  };

  // Wishlist toggle
  const toggleWishlist = async (productId) => {
    const isAdded = !wishlist.some(item => (item._id || item.id || item) === productId);
    if (isAdded) {
      toast.success('Added to wishlist!', { toastId: `wishlist-toggle-${productId}` });
    } else {
      toast.info('Removed from wishlist', { toastId: `wishlist-toggle-${productId}` });
    }

    if (token) {
      try {
        const { data } = await axios.post(`${API_URL}/users/wishlist`, { productId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(data); // returns populated wishlist or product ids
      } catch (err) {
        console.error('Error toggling wishlist:', err);
      }
    } else {
      // Local wishlist toggle (for guests)
      setWishlist(prev => {
        const exists = prev.some(item => (item._id || item.id || item) === productId);
        if (exists) {
          return prev.filter(item => (item._id || item.id || item) !== productId);
        } else {
          // Find product detail to put full object in wishlist
          const prod = products.find(p => p._id === productId);
          return [...prev, prod || productId];
        }
      });
    }
  };

  // Cart Management
  const addToCart = (product, qty) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product._id);
      let updatedCart;
      if (exists) {
        updatedCart = prev.map(item =>
          item.id === product._id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        updatedCart = [
          ...prev,
          {
            id: product._id,
            title: product.title,
            price: product.price,
            quantity: qty,
            image: product.images && product.images.length > 0 ? product.images[0] : product.image,
            volume: product.volume,
            region: product.region
          }
        ];
      }
      return updatedCart;
    });

    if (token) {
      setTimeout(() => {
        setCart(currentCart => {
          syncCartToBackend(currentCart);
          return currentCart;
        });
      }, 0);
    }

    toast.success(`${product.title} added to bag!`, {
      toastId: `add-to-cart-${product._id}`
    });
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(prev => {
      const updatedCart = prev.filter(item => item.id !== productId);
      return updatedCart;
    });

    if (token) {
      setTimeout(() => {
        setCart(currentCart => {
          syncCartToBackend(currentCart);
          return currentCart;
        });
      }, 0);
    }

    toast.info(`${item ? item.title : 'Item'} removed from bag.`, {
      toastId: `remove-from-cart-${productId}`
    });
  };

  const updateCartQty = (productId, qty) => {
    setCart(prev => {
      const updatedCart = prev.map(item =>
        item.id === productId ? { ...item, quantity: qty } : item
      );
      if (token) syncCartToBackend(updatedCart);
      return updatedCart;
    });
  };

  // Order Placement
  const placeOrder = async (orderData) => {
    if (!token) return { success: false, message: 'Must be logged in to order' };
    try {
      const { data } = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear cart
      setCart([]);
      if (token) await syncCartToBackend([]);
      setOrders(prev => [data, ...prev]);
      toast.success('Order placed successfully! Thank you.');
      return { success: true, order: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get My Orders
  const fetchMyOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Pay Order Simulation
  const payOrder = async (orderId) => {
    if (!token) return { success: false };
    try {
      const { data } = await axios.put(`${API_URL}/orders/${orderId}/pay`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(prev => prev.map(o => o._id === orderId ? data : o));
      toast.success('Payment completed successfully!');
      return { success: true, order: data };
    } catch (err) {
      console.error('Error paying order:', err);
      toast.error('Payment processing failed.');
      return { success: false };
    }
  };

  // ADMIN METHODS
  const fetchAllOrders = async () => {
    if (!token || !user?.isAdmin) return;
    try {
      const { data } = await axios.get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  const fetchAllUsers = async () => {
    if (!token || !user?.isAdmin) return;
    try {
      const { data } = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminUsers(data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const { data } = await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminOrders(prev => prev.map(o => o._id === orderId ? data : o));
      toast.success(`Order status updated to: ${status}`);
      return { success: true, order: data };
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.response?.data?.message || 'Failed to update order status');
      return { success: false };
    }
  };

  const createProduct = async (productData) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const { data } = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(prev => [data, ...prev]);
      toast.success(`Product "${data.title}" created successfully!`);
      return { success: true, product: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const { data } = await axios.put(`${API_URL}/products/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(prev => prev.map(p => p._id === productId ? data : p));
      toast.success(`Product "${data.title}" updated successfully!`);
      return { success: true, product: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteProduct = async (productId) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      await axios.delete(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product removed from catalog');
      return { success: true };
    } catch (err) {
      console.error('Error deleting product:', err);
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const createCategory = async (categoryData) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const { data } = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success(`Category "${data.name}" created successfully!`);
      return { success: true, category: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const { data } = await axios.put(`${API_URL}/categories/${categoryId}`, categoryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(prev => prev.map(c => c._id === categoryId ? data : c).sort((a, b) => a.name.localeCompare(b.name)));
      setProducts(prev => prev.map(p => {
        if (p.category && (p.category._id === categoryId || p.category === categoryId)) {
          return { ...p, category: data };
        }
        return p;
      }));
      toast.success(`Category "${data.name}" updated successfully!`);
      return { success: true, category: data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      await axios.delete(`${API_URL}/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(prev => prev.filter(c => c._id !== categoryId));
      toast.success('Category removed successfully');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        products,
        recipes,
        categories,
        cart,
        wishlist,
        orders,
        loadingProducts,
        loadingRecipes,
        loadingCategories,
        loadingUser,
        adminOrders,
        adminUsers,
        login,
        register,
        logout,
        toggleWishlist,
        addToCart,
        removeFromCart,
        updateCartQty,
        placeOrder,
        fetchMyOrders,
        payOrder,
        fetchAllOrders,
        fetchAllUsers,
        updateOrderStatus,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchShopProducts,
        refreshProducts: fetchProducts,
        refreshCategories: fetchCategories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
