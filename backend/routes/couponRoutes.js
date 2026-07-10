import express from 'express';
import { validateCoupon, createCoupon, getCoupons, deleteCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route('/validate')
  .post(validateCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

export default router;
