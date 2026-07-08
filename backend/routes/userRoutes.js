import express from 'express';
import {
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
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', protect, resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.route('/wishlist')
  .post(protect, toggleWishlist);

router.route('/cart')
  .put(protect, updateCart);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
