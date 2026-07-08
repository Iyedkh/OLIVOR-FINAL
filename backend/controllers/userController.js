import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/User.js';
import Product from '../models/Product.js';
import generateToken from '../utils/generateToken.js';

import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        wishlist: user.wishlist,
        cart: user.cart,
        token: generateToken(res, user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpire,
      isVerified: false,
    });

    if (user) {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your OLIV\'OR Account',
        text: `Welcome to OLIV'OR! Please verify your account by visiting the following link:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.`,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        wishlist: user.wishlist,
        cart: user.cart,
        token: generateToken(res, user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist').populate('cart.product');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
        wishlist: user.wishlist,
        cart: user.cart,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isVerified: updatedUser.isVerified,
        wishlist: updatedUser.wishlist,
        cart: updatedUser.cart,
        token: generateToken(res, updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      const alreadyInWishlist = user.wishlist.includes(productId);

      if (alreadyInWishlist) {
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      } else {
        user.wishlist.push(productId);
      }

      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('wishlist');
      res.json(updatedUser.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = async (req, res) => {
  const { cartItems } = req.body; // Array of { product: id, qty: number }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Filter out invalid product IDs and avoid N+1 queries using a single $in query
      const productIds = cartItems
        .map(item => item.product)
        .filter(id => id && mongoose.Types.ObjectId.isValid(id));

      const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
      const existingProductIds = existingProducts.map(p => p._id.toString());

      const validCartItems = cartItems.filter(
        item => item.product && existingProductIds.includes(item.product.toString())
      );

      user.cart = validCartItems;
      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('cart.product');
      res.json(updatedUser.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/users/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('<h1>Verification failed</h1><p>The link is invalid or has expired.</p>');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?verified=true`);
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
  }
};

// @desc    Resend verification email
// @route   POST /api/users/resend-verification
// @access  Private
const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpire = verificationTokenExpire;
    await user.save();

    const verifyUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your OLIV\'OR Account',
      text: `Please verify your OLIV'OR account by visiting this link:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.`,
    });

    res.json({ message: 'Verification link has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
    }

    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetPasswordToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset Your OLIV\'OR Password',
      text: `You requested to reset your password. Please visit this link to set a new password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email. This link will expire in 1 hour.`,
    });

    res.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset password link is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully. Please log in with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  updateCart,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};
