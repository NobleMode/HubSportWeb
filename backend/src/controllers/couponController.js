import couponService from "../services/couponService.js";

class CouponController {
  // Get all coupons (Admin)
  async getAllCoupons(req, res, next) {
    try {
      const coupons = await couponService.getAllCoupons();
      res.status(200).json({ success: true, data: coupons });
    } catch (error) {
      next(error);
    }
  }

  // Get single coupon (Admin)
  async getCouponById(req, res, next) {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      res.status(200).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  }

  // Create new coupon (Admin)
  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  }

  // Update coupon (Admin)
  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.status(200).json({ success: true, data: coupon });
    } catch (error) {
      next(error);
    }
  }

  // Delete coupon (Admin)
  async deleteCoupon(req, res, next) {
    try {
      await couponService.deleteCoupon(req.params.id);
      res.status(200).json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // Validate coupon (Customer)
  async validateCoupon(req, res, next) {
    try {
      const { code, orderValue } = req.body;
      const result = await couponService.validateCoupon(code, orderValue);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();
