import express from 'express';
import couponService from '../services/couponService.js';
import { authMiddleware as verifyToken } from '../middlewares/authMiddleware.js';
import { adminOnly as isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public/User Routes
router.post('/validate', verifyToken, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const userId = req.user.id;
    
    const result = await couponService.validateCoupon(code, userId, orderTotal);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin Routes
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
