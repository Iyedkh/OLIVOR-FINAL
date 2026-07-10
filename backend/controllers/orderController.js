import Order from '../models/Order.js';
import Product from '../models/Product.js';
import sendEmail from '../utils/sendEmail.js';

// Send Order Confirmation Email Helper
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eae8e2; text-align: left; font-size: 13px; color: #45483c;">
          <strong>${item.title}</strong><br>
          <span style="font-size: 11px; color: #75796b;">Qty: ${item.qty} &bull; ${item.volume || '500ml'}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eae8e2; text-align: right; font-size: 13px; color: #1b1c19; font-weight: bold;">
          $${(item.price * item.qty).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - OLIV'OR</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@300;400;500;600&display=swap');
      body {
        background-color: #fbf9f3;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      .wrapper {
        background-color: #fbf9f3;
        padding: 40px 20px;
      }
      .container {
        max-width: 580px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #eae8e2;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(62, 82, 25, 0.05);
      }
      .header {
        background-color: #1e3d2f;
        padding: 40px 20px;
        text-align: center;
      }
      .header-logo {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 26px;
        font-weight: 500;
        color: #d4af37;
        letter-spacing: 0.1em;
        margin: 0;
        text-transform: uppercase;
      }
      .header-sub {
        font-size: 9px;
        font-weight: 600;
        color: #ffffff;
        opacity: 0.6;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        margin-top: 6px;
      }
      .content {
        padding: 40px 30px;
      }
      .title {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 20px;
        font-weight: 600;
        color: #1e3d2f;
        margin-top: 0;
        margin-bottom: 10px;
        text-align: center;
      }
      .subtitle {
        font-size: 11px;
        font-weight: 600;
        color: #75796b;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        text-align: center;
        margin-bottom: 30px;
      }
      .greeting {
        font-size: 14px;
        line-height: 1.6;
        color: #1b1c19;
        margin-bottom: 25px;
      }
      .order-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
      .summary-row td {
        padding: 8px 0;
        font-size: 13px;
        color: #45483c;
      }
      .total-row td {
        padding: 16px 0;
        border-top: 2px solid #1e3d2f;
        font-size: 16px;
        font-weight: bold;
        color: #1e3d2f;
      }
      .meta-box {
        background-color: #f7f5ef;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 30px;
        border: 1px solid #eae8e2;
      }
      .meta-title {
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #1e3d2f;
        margin-top: 0;
        margin-bottom: 8px;
      }
      .meta-text {
        font-size: 13px;
        line-height: 1.5;
        color: #45483c;
        margin: 0 0 15px 0;
      }
      .meta-text:last-child {
        margin-bottom: 0;
      }
      .footer {
        background-color: #f7f5ef;
        border-top: 1px solid #eae8e2;
        padding: 30px 20px;
        text-align: center;
      }
      .footer-text {
        font-size: 10px;
        color: #75796b;
        line-height: 1.5;
        margin: 4px 0;
      }
      .footer-divider {
        width: 40px;
        height: 1px;
        background-color: #d4af37;
        margin: 15px auto;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <h1 class="header-logo">OLIV'OR</h1>
          <div class="header-sub">Tunisian Reserve</div>
        </div>
        <div class="content">
          <h2 class="title">Thank You For Your Order</h2>
          <div class="subtitle">Order ID: #${order._id}</div>
          
          <p class="greeting">Dear ${user.name || 'Valued Customer'},</p>
          <p class="greeting" style="margin-top: -15px; color: #45483c; font-size: 13.5px; font-weight: 300;">
            We are pleased to confirm that your order has been received and is currently being prepared for shipping by our estate keepers. Here is a summary of your luxury selection:
          </p>
          
          <table class="order-table">
            <thead>
              <tr>
                <th style="text-align: left; padding-bottom: 10px; border-bottom: 2px solid #1e3d2f; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #1e3d2f;">Item</th>
                <th style="text-align: right; padding-bottom: 10px; border-bottom: 2px solid #1e3d2f; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #1e3d2f;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="summary-row">
                <td style="padding-top: 15px;">Subtotal</td>
                <td style="text-align: right; padding-top: 15px;">$${order.itemsPrice.toFixed(2)}</td>
              </tr>
              ${order.discountPrice > 0 ? `
              <tr class="summary-row">
                <td style="color: #785a00;">Discount ${order.couponCode ? `(${order.couponCode})` : ''}</td>
                <td style="text-align: right; color: #785a00;">-$${order.discountPrice.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr class="summary-row">
                <td>Shipping</td>
                <td style="text-align: right;">$${order.shippingPrice.toFixed(2)}</td>
              </tr>
              <tr class="summary-row" style="padding-bottom: 15px;">
                <td>Tax</td>
                <td style="text-align: right;">$${order.taxPrice.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td>Grand Total</td>
                <td style="text-align: right;">$${order.totalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="meta-box">
            <div style="width: 48%; display: inline-block; vertical-align: top; text-align: left;">
              <h4 class="meta-title">Shipping Address</h4>
              <p class="meta-text">
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}
              </p>
            </div>
            <div style="width: 48%; display: inline-block; vertical-align: top; text-align: left; margin-left: 3%;">
              <h4 class="meta-title">Payment Method</h4>
              <p class="meta-text">${order.paymentMethod}</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text"><strong>OLIV'OR Reserve Collection</strong></p>
          <p class="footer-text">Pure Single-Estate Olive Oil &bull; Hand-Harvested in Sahel, Tunisia</p>
          <div class="footer-divider"></div>
          <p class="footer-text" style="font-size: 9px; opacity: 0.7;">For any inquiries regarding your shipment, contact us at keepers@olivor.com</p>
        </div>
      </div>
    </div>
  </body>
  </html>
    `;

    await sendEmail({
      to: user.email,
      subject: `Your OLIV'OR Order Confirmation [#${order._id}]`,
      text: `Thank you for your order, ${user.name || 'Valued Customer'}!\n\nOrder ID: #${order._id}\nTotal: $${order.totalPrice.toFixed(2)}\nWe are preparing your items for delivery.`,
      html: emailHtml
    });
  } catch (error) {
    console.error('❌ Failed to dispatch order confirmation email:', error.message);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    couponCode,
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

    // Process and validate coupon discount from backend
    let discountPrice = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const Coupon = (await import('../models/Coupon.js')).default;
      const couponObj = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (couponObj && couponObj.active && (!couponObj.expirationDate || new Date(couponObj.expirationDate) > new Date())) {
        appliedCoupon = couponObj.code;
        discountPrice = Number((calculatedItemsPrice * couponObj.discount).toFixed(2));
      } else {
        return res.status(400).json({ message: 'Invalid or expired coupon code applied' });
      }
    }

    const discountedSubtotal = calculatedItemsPrice - discountPrice;
    const calculatedTaxPrice = Number((0.08 * discountedSubtotal).toFixed(2));
    
    // Validate shipping price matches accepted configurations (standard=0, express=15)
    let calculatedShippingPrice = Number(shippingPrice) || 0;
    if (calculatedShippingPrice !== 0 && calculatedShippingPrice !== 15) {
      return res.status(400).json({ message: 'Invalid shipping price configuration' });
    }

    const calculatedTotalPrice = Number((discountedSubtotal + calculatedTaxPrice + calculatedShippingPrice).toFixed(2));

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
        discountPrice,
        couponCode: appliedCoupon,
        itemsPrice: Number(calculatedItemsPrice.toFixed(2)),
        taxPrice: calculatedTaxPrice,
        shippingPrice: calculatedShippingPrice,
        totalPrice: calculatedTotalPrice,
      });

      const createdOrder = await order.save();
      
      // Send order confirmation email asynchronously
      sendOrderConfirmationEmail(createdOrder, req.user).catch(err => {
        console.error('❌ Failed to send order confirmation email:', err.message);
      });

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

// @desc    Track order publicly
// @route   POST /api/orders/track
// @access  Public
const trackOrderPublic = async (req, res) => {
  const { orderId, email } = req.body;

  try {
    if (!orderId || !email) {
      return res.status(400).json({ message: 'Order ID and Email are required' });
    }

    const mongoose = (await import('mongoose')).default;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid Order ID format' });
    }

    const order = await Order.findById(orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderEmail = order.shippingAddress?.email || order.user?.email || '';
    if (orderEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(401).json({ message: 'Unauthorized. Email does not match this order' });
    }

    res.json(order);
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
  trackOrderPublic,
};
