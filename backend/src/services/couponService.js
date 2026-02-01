import prisma from '../config/database.js';

class CouponService {
  async createCoupon(data) {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: data.code },
    });
    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }
    return await prisma.coupon.create({
      data,
    });
  }

  async getAllCoupons() {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCouponById(id) {
    return await prisma.coupon.findUnique({
      where: { id },
    });
  }

  async updateCoupon(id, data) {
    return await prisma.coupon.update({
      where: { id },
      data,
    });
  }

  async deleteCoupon(id) {
    return await prisma.coupon.delete({
      where: { id },
    });
  }

  /**
   * Validate a coupon and calculate discount
   */
  async validateCoupon(code, userId, orderTotal) {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new Error('Coupon is inactive');
    }

    const now = new Date();
    if (coupon.startDate > now) {
      throw new Error('Coupon is not yet active');
    }

    if (coupon.endDate && coupon.endDate < now) {
      throw new Error('Coupon has expired');
    }

    if (orderTotal < coupon.minOrderValue) {
      throw new Error(`Minimum order value of ${coupon.minOrderValue} required`);
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    if (coupon.perUserLimit !== null) {
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId: userId,
        },
      });

      if (userUsageCount >= coupon.perUserLimit) {
        throw new Error('You have reached the usage limit for this coupon');
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount !== null) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'SHIPPING') {
        // Assuming shipping validation is handled elsewhere or passed in? 
        // For now, let's say it covers up to a standard shipping fee or is handled as fixed amount logic
        // But usually shipping coupons make shipping 0. 
        // We'll return the discountValue which might be set to the shipping fee.
        discountAmount = coupon.discountValue; 
    }
    
    // Discount cannot exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return {
      isValid: true,
      coupon,
      discountAmount,
      finalTotal: orderTotal - discountAmount
    };
  }

  async recordUsage(couponId, userId, orderId) {
      await prisma.$transaction([
          prisma.couponUsage.create({
              data: {
                  couponId,
                  userId,
                  orderId
              }
          }),
          prisma.coupon.update({
              where: { id: couponId },
              data: { usageCount: { increment: 1 } }
          })
      ]);
  }
}

export default new CouponService();
