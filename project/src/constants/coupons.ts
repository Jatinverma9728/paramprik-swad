export const VALID_COUPONS = [
  {
    code: "FIRST50",
    discount: 50,
    minAmount: 500,
    description: "₹50 off on orders above ₹500"
  },
  {
    code: "WELCOME20",
    discount: 0.2, // 20% discount
    minAmount: 1000,
    description: "20% off on orders above ₹1000",
    isPercentage: true,
    maxDiscount: 200
  }
] as const;

export const validateCoupon = (code: string, cartTotal: number) => {
  const coupon = VALID_COUPONS.find(c => c.code === code.toUpperCase());
  
  if (!coupon) {
    return { isValid: false, message: "Invalid coupon code" };
  }
  
  if (cartTotal < coupon.minAmount) {
    return { 
      isValid: false, 
      message: `Minimum order amount of ₹${coupon.minAmount} required`
    };
  }

  const discountAmount = coupon.isPercentage 
    ? Math.min(cartTotal * coupon.discount, coupon.maxDiscount || Infinity)
    : coupon.discount;

  return {
    isValid: true,
    discount: discountAmount,
    message: `Coupon applied successfully! Saved ₹${discountAmount}`
  };
};
