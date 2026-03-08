import prisma from "../config/database.js";

class CouponService {
  async getAllCoupons() {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCouponById(id) {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return coupon;
  }

  async createCoupon(data) {
    // Ensure code is unique and uppercase
    const code = data.code.toUpperCase();
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      throw new Error("Coupon code already exists");
    }

    return await prisma.coupon.create({
      data: {
        ...data,
        code
      }
    });
  }

  async updateCoupon(id, data) {
    const coupon = await this.getCouponById(id);
    
    if (data.code) {
      data.code = data.code.toUpperCase();
      const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
      if (existing && existing.id !== id) {
        throw new Error("Coupon code already exists");
      }
    }

    return await prisma.coupon.update({
      where: { id },
      data
    });
  }

  async deleteCoupon(id) {
    await this.getCouponById(id);
    return await prisma.coupon.delete({
      where: { id }
    });
  }

  async validateCoupon(code, orderValue) {
    const couponCode = code.toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode }
    });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (!coupon.isActive) {
      throw new Error("This coupon is no longer active");
    }

    const now = new Date();
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      throw new Error("This coupon is not valid yet");
    }

    if (coupon.endDate && new Date(coupon.endDate) < now) {
      throw new Error("This coupon has expired");
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error("This coupon has reached its usage limit");
    }

    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      throw new Error(`Minimum order value of ${coupon.minOrderValue} required for this coupon`);
    }

    // Calculate actual discount amount
    let discountAmount = 0;
    if (coupon.isPercentage) {
      discountAmount = orderValue * (coupon.discountValue / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure we don't discount more than the order value
    discountAmount = Math.min(discountAmount, orderValue);

    return {
      coupon,
      originalValue: orderValue,
      discountAmount,
      finalValue: orderValue - discountAmount
    };
  }

  async incrementUsage(code) {
    await prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: {
        usageCount: {
          increment: 1
        }
      }
    });
  }
}

export default new CouponService();
