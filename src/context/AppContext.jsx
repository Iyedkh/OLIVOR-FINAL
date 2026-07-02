import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

  // Admin States
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Recipes
  const fetchRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const res = await fetch(`${API_URL}/recipes`);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async (authToken) => {
    if (!authToken) return;
    try {
      setLoadingUser(true);
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
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
            id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.qty,
            image: item.product.image,
            volume: item.product.volume,
            region: item.product.region
          }));
          setCart(formattedCart);
        }
      } else {
        // Token might be invalid/expired
        logout();
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  // Initial loads
  useEffect(() => {
    fetchProducts();
    fetchRecipes();
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
      await fetch(`${API_URL}/users/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ cartItems }),
      });
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  };

  // Login
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
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
        // Merge or replace. Let's merge
        const mergedCart = [...cart];
        if (data.cart) {
          data.cart.forEach(item => {
            const exists = mergedCart.find(x => x.id === item.product._id);
            if (!exists) {
              mergedCart.push({
                id: item.product._id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.qty,
                image: item.product.image,
                volume: item.product.volume,
                region: item.product.region
              });
            }
          });
        }
        setCart(mergedCart);
        await syncCartToBackend(mergedCart, data.token);
      } else if (data.cart) {
        const formattedCart = data.cart.map(item => ({
          id: item.product._id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.qty,
          image: item.product.image,
          volume: item.product.volume,
          region: item.product.region
        }));
        setCart(formattedCart);
      }
      return { success: true, isAdmin: data.isAdmin };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  };

  // Register
  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
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
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  };

  // Logout
  const logout = () => {
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
  };

  // Wishlist toggle
  const toggleWishlist = async (productId) => {
    if (token) {
      try {
        const res = await fetch(`${API_URL}/users/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(data); // returns populated wishlist or product ids
        }
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
            image: product.image,
            volume: product.volume,
            region: product.region
          }
        ];
      }
      if (token) syncCartToBackend(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const updatedCart = prev.filter(item => item.id !== productId);
      if (token) syncCartToBackend(updatedCart);
      return updatedCart;
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
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) {
        // Clear cart
        setCart([]);
        if (token) await syncCartToBackend([]);
        setOrders(prev => [data, ...prev]);
        return { success: true, order: data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Get My Orders
  const fetchMyOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Pay Order Simulation
  const payOrder = async (orderId) => {
    if (!token) return { success: false };
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === orderId ? data : o));
        return { success: true, order: data };
      }
      return { success: false };
    } catch (err) {
      console.error('Error paying order:', err);
      return { success: false };
    }
  };

  // ADMIN METHODS
  const fetchAllOrders = async () => {
    if (!token || !user?.isAdmin) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminOrders(data);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  const fetchAllUsers = async () => {
    if (!token || !user?.isAdmin) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdminOrders(prev => prev.map(o => o._id === orderId ? data : o));
        return { success: true, order: data };
      }
      return { success: false };
    } catch (err) {
      console.error('Error updating order status:', err);
      return { success: false };
    }
  };

  const createProduct = async (productData) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => [data, ...prev]);
        return { success: true, product: data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === productId ? data : p));
        return { success: true, product: data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const deleteProduct = async (productId) => {
    if (!token || !user?.isAdmin) return { success: false };
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error('Error deleting product:', err);
      return { success: false };
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        products,
        recipes,
        cart,
        wishlist,
        orders,
        loadingProducts,
        loadingRecipes,
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
        refreshProducts: fetchProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
