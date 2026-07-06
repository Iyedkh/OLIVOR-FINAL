import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
  } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    let calculatedItemsPrice = 0;
    const verifiedOrderItems = [];

    // Verify products exist, check stock, and calculate prices using server DB values
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.title}` });
      }

      calculatedItemsPrice += product.price * item.qty;

      verifiedOrderItems.push({
        title: product.title,
        qty: item.qty,
        image: product.images[0] || product.image,
        price: product.price,
        volume: product.volume || '500ml',
        product: product._id,
      });
    }

    const calculatedTaxPrice = Number((0.08 * calculatedItemsPrice).toFixed(2));
    
    // Validate shipping price matches accepted configurations (standard=0, express=15)
    let calculatedShippingPrice = Number(shippingPrice) || 0;
    if (calculatedShippingPrice !== 0 && calculatedShippingPrice !== 15) {
      return res.status(400).json({ message: 'Invalid shipping price configuration' });
    }

    const calculatedTotalPrice = Number((calculatedItemsPrice + calculatedTaxPrice + calculatedShippingPrice).toFixed(2));

    // Decrement stock atomically with manual rollback capability on failure (concurrency protection)
    const updatedProducts = [];
    try {
      for (const item of verifiedOrderItems) {
        const updateResult = await Product.updateOne(
          { _id: item.product, countInStock: { $gte: item.qty } },
          { $inc: { countInStock: -item.qty } }
        );
        if (updateResult.modifiedCount === 0) {
          throw new Error(`Insufficient stock or concurrent purchase for product: ${item.title}`);
        }
        updatedProducts.push({ product: item.product, qty: item.qty });
      }
    } catch (err) {
      // Rollback already decremented products
      for (const rolled of updatedProducts) {
        await Product.updateOne({ _id: rolled.product }, { $inc: { countInStock: rolled.qty } });
      }
      return res.status(400).json({ message: err.message });
    }

    // Create and save the order
    try {
      const order = new Order({
        user: req.user._id,
        orderItems: verifiedOrderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: Number(calculatedItemsPrice.toFixed(2)),
        taxPrice: calculatedTaxPrice,
        shippingPrice: calculatedShippingPrice,
        totalPrice: calculatedTotalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (orderSaveError) {
      // Rollback stock updates if order saving fails
      for (const rolled of updatedProducts) {
        await Product.updateOne({ _id: rolled.product }, { $inc: { countInStock: rolled.qty } });
      }
      throw orderSaveError;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is order owner or admin
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'Processing';
      order.paymentResult = {
        id: req.body.id || 'simulated_txn_id_' + Date.now(),
        status: req.body.status || 'COMPLETED',
        update_time: req.body.update_time || new Date().toISOString(),
        email_address: req.body.email_address || req.user.email,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = 'Delivered';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      const populatedOrder = await Order.findById(updatedOrder._id).populate('user', 'name email');
      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
