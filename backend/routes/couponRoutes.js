import express from 'express';
import { validateCoupon, createCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCoupon);

router.route('/validate')
  .post(validateCoupon);

export default router;
