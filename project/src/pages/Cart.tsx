import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { 
  Trash2, Plus, Minus, ArrowLeft, Shield, Truck, Clock, AlertCircle,
  Package, FileDown, Share2, ChevronRight, Timer, ClipboardCopy, ShoppingCart, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { validateCoupon } from '../constants/coupons';
import { EmptyCartAnimation } from '../components/EmptyCartAnimation';
import { PRODUCTS } from './Products'; // Change this line to import PRODUCTS array
import { z } from "zod"; // Add this import

// Add this font import at the top
const FONT = "helvetica";

// Add checkout form schema
const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name should only contain letters"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required")
    .regex(/^[a-zA-Z\s]*$/, "City should only contain letters"),
  pincode: z.string()
    .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// Add this type for step tracking
type Step = 'cart' | 'delivery' | 'payment' | 'confirmation';

// Add step-specific components
const CartStep = ({ onNext, cart, handleQuantityUpdate, removeFromCart }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4"
  >
    {cart.map((item: any) => (
      <motion.div
        key={item.id}
        layout
        className="bg-white p-6 rounded-lg shadow-md flex gap-4"
      >
        <img 
          src={item.image} 
          alt={item.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-medium text-lg text-amber-900">{item.name}</h3>
          <p className="text-amber-600">Size: {item.selectedSize?.size}</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-50 p-1 rounded">
              <button
                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                className="p-1 hover:bg-amber-100 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                className="p-1 hover:bg-amber-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-amber-900">
            ₹{((item.selectedSize?.price || 0) * item.quantity).toFixed(2)}
          </p>
          <p className="text-sm text-amber-600">
            ₹{(item.selectedSize?.price || 0).toFixed(2)} each
          </p>
        </div>
      </motion.div>
    ))}
    <div className="mt-6">
      <button
        onClick={onNext}
        className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
      >
        Continue to Delivery
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

const DeliveryStep = ({ onNext, onBack, formData, setFormData, errors }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <h3 className="text-xl font-semibold text-amber-900 mb-6">Delivery Details</h3>
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email Address', type: 'email' },
          { name: 'phone', label: 'Phone Number', type: 'tel' },
          { name: 'address', label: 'Delivery Address', type: 'text' },
          { name: 'city', label: 'City', type: 'text' },
          { name: 'pincode', label: 'PIN Code', type: 'text' }
        ].map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-amber-700 mb-1">
              {field.label}
              <span className="text-red-500">*</span>
            </label>
            <input
              type={field.type}
              value={formData[field.name]}
              onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
              className={`w-full p-2 border rounded-lg ${
                errors[field.name] ? 'border-red-500' : 'border-amber-200'
              } focus:ring-2 focus:ring-amber-500`}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-4 py-3 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100"
        >
          Back to Cart
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  </motion.div>
);

const PaymentStep = ({ onNext, onBack, total, onApplyCoupon, appliedCoupon, couponError }: any) => {
  const [selectedPayment, setSelectedPayment] = useState('cod');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-xl font-semibold text-amber-900 mb-6">Payment Method</h3>
      
      {/* Coupon Section with enhanced UI */}
      <div className="mb-8 bg-amber-50/50 p-6 rounded-lg border border-amber-100">
        <h4 className="text-amber-900 font-medium mb-3 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Apply Coupon
        </h4>
        <form onSubmit={onApplyCoupon} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              name="couponCode"
              placeholder="Got a promo code?"
              className="flex-1 p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all transform active:scale-95"
            >
              Apply
            </button>
          </div>
          {couponError && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm flex items-center gap-1"
            >
              <AlertCircle className="h-4 w-4" />
              {couponError}
            </motion.p>
          )}
          {appliedCoupon && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 p-3 rounded-lg border border-green-100"
            >
              <p className="text-green-600 text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Coupon {appliedCoupon.code} applied!</span>
              </p>
              <p className="text-green-700 text-xs ml-6">
                You saved ₹{appliedCoupon.discount}
              </p>
            </motion.div>
          )}
        </form>
      </div>

      {/* Payment Methods with enhanced UI */}
      <div className="space-y-4 mb-8">
        <h4 className="text-amber-900 font-medium flex items-center gap-2">
          <Package className="h-5 w-5" />
          Select Payment Method
        </h4>
        
        <label className="block p-4 border-2 border-amber-200 rounded-lg hover:bg-amber-50 cursor-pointer transition-all">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === 'cod'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="text-amber-500 focus:ring-amber-500"
            />
            <div>
              <p className="font-medium text-amber-900">Cash on Delivery</p>
              <p className="text-sm text-amber-600">Pay when you receive your order</p>
            </div>
          </div>
        </label>

        {/* Disabled payment methods */}
        {[
          { id: 'upi', label: 'UPI Payment', description: 'Coming soon' },
          { id: 'card', label: 'Credit/Debit Card', description: 'Coming soon' }
        ].map(method => (
          <div
            key={method.id}
            className="block p-4 border-2 border-gray-100 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                disabled
                className="text-gray-400"
              />
              <div>
                <p className="font-medium text-gray-400">{method.label}</p>
                <p className="text-sm text-gray-400">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-all transform active:scale-98"
        >
          Back
        </button>
        <button
          onClick={() => selectedPayment === 'cod' && onNext()}
          className={`flex-1 px-4 py-3 rounded-lg transition-all transform active:scale-98 flex items-center justify-center gap-2
            ${selectedPayment === 'cod' 
              ? 'bg-amber-500 text-white hover:bg-amber-600' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          Place Order
          <Package className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// Update the main Cart component
export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, addToCart, clearCart, addOrder, lastOrder } = useStore();
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('cart');

  const subtotal = cart.reduce((sum, item) => {
    const price = item.selectedSize?.price || item.sizes[0].price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 149 ? 0 : 50;
  const discount = appliedCoupon?.discount || 0; // Change this line
  const total = subtotal + shipping - discount; // This will now properly include the coupon discount

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('couponCode') as string;
    
    const result = validateCoupon(code, subtotal);
    
    if (result.isValid) {
      setAppliedCoupon({ 
        code: code.toUpperCase(), 
        discount: result.discount 
      });
      setCouponError("");
    } else {
      setCouponError(result.message);
      setAppliedCoupon(null);
    }
  };

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setShowConfirmDelete(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleShareCart = () => {
    const cartItems = cart.map(item => `${item.quantity}x ${item.name}`).join('\n');
    const shareText = `Check out my cart at Paramparik Swad:\n${cartItems}\nTotal: ₹${total.toFixed(2)}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Paramparik Swad Cart',
        text: shareText,
        url: window.location.href
      });
    } else {
      setShowShareModal(true);
    }
  };

  const handleDownloadSummary = () => {
    setIsDownloading(true);
    
    try {
      // Create a simple text summary
      const summary = `
        Paramparik Swad - Cart Summary
        Date: ${new Date().toLocaleDateString()}
        
        Items:
        ${cart.map(item => `
        - ${item.name} (${item.selectedSize?.size})
          Quantity: ${item.quantity}
          Price: ₹${(item.selectedSize?.price || 0).toFixed(2)}
          Total: ₹${((item.selectedSize?.price || 0) * item.quantity).toFixed(2)}
        `).join('\n')}
        
        Subtotal: ₹${subtotal.toFixed(2)}
        ${appliedCoupon ? `Discount (${appliedCoupon.code}): -₹${appliedCoupon.discount.toFixed(2)}` : ''}
        Shipping: ${shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
        Total: ₹{(subtotal + shipping - (appliedCoupon?.discount || 0)).toFixed(2)}
        
        Thank you for shopping with Paramparik Swad!
      `.trim();

      // Create blob and download
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cart-summary.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (method: 'copy' | 'whatsapp') => {
    const cartItems = cart.map(item => 
      `${item.quantity}x ${item.name} (${item.selectedSize?.size})`
    ).join('\n');
    
    const shareText = 
      `🛒 My Cart at Paramparik Swad:\n\n${cartItems}\n\n💰 Total: ₹${total.toFixed(2)}`;
    
    if (method === 'copy') {
      await navigator.clipboard.writeText(shareText);
      alert('Cart details copied to clipboard!');
    } else if (method === 'whatsapp') {
      const encodedText = encodeURIComponent(shareText);
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }
    setShowShareModal(false);
  };

  // Add loading indicator
  const LoadingButton = ({ text }: { text: string }) => (
    <button 
      disabled 
      className="flex items-center justify-center gap-2 p-3 bg-amber-100 text-amber-800 rounded-lg w-full"
    >
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {text}
    </button>
  );

  // Add new state for checkout
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<CheckoutForm>>({});
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Add this helper function for step status
  const getStepStatus = (step: Step) => {
    const steps: Step[] = ['cart', 'delivery', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  // Replace the existing stepper UI with this enhanced version
  const renderStepper = () => (
    <div className="mb-8 relative">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {[
          { id: 'cart', icon: ShoppingCart, label: 'Cart' },
          { id: 'delivery', icon: Truck, label: 'Delivery' },
          { id: 'payment', icon: Package, label: 'Payment' },
          { id: 'confirmation', icon: CheckCircle, label: 'Confirmation' }
        ].map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: getStepStatus(step.id as Step) === 'completed' 
                    ? '#F59E0B' 
                    : getStepStatus(step.id as Step) === 'current'
                    ? '#FCD34D'
                    : '#FEF3C7',
                  scale: getStepStatus(step.id as Step) === 'current' ? 1.1 : 1
                }}
                className={`rounded-full h-12 w-12 flex items-center justify-center
                  ${getStepStatus(step.id as Step) === 'completed' ? 'text-white' : 'text-amber-800'}
                  shadow-lg transition-all duration-300`}
              >
                {getStepStatus(step.id as Step) === 'completed' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </motion.div>
              <span className={`mt-2 text-sm font-medium
                ${getStepStatus(step.id as Step) === 'current' ? 'text-amber-800' : 'text-amber-600'}`}>
                {step.label}
              </span>
            </div>
            {index < 3 && (
              <div className="flex-1 h-0.5 mx-4">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: getStepStatus(step.id as Step) === 'completed' 
                      ? '#F59E0B' 
                      : '#FEF3C7'
                  }}
                  className="h-full transition-colors duration-300"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Update handleCheckout function
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setFormErrors({});

    try {
      // Additional validation
      if (cart.length === 0) {
        setCheckoutError("Your cart is empty");
        return;
      }

      if (total < 0) {
        setCheckoutError("Invalid order total");
        return;
      }

      // Validate form
      const validatedData = checkoutSchema.parse(checkoutForm);
      setIsProcessingCheckout(true);

      // Create order payload
      const orderPayload = {
        orderItems: cart,
        customerInfo: validatedData,
        orderSummary: {
          subtotal,
          shipping,
          discount: appliedCoupon?.discount || 0,
          total: total
        }
      };

      // Update step progression
      if (currentStep === 'cart') {
        setCurrentStep('delivery');
      } else if (currentStep === 'delivery') {
        setCurrentStep('payment');
      } else if (currentStep === 'payment') {
        setCurrentStep('confirmation');
        // Existing order completion logic
        addOrder(orderPayload);
        setOrderPlaced(true);
        setIsCheckoutOpen(false);
      }

    } catch (error) {
      console.error("Checkout error:", error);

      if (error instanceof z.ZodError) {
        const errors: Partial<CheckoutForm> = {};
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0] as keyof CheckoutForm] = err.message;
          }
        });
        setFormErrors(errors);
        setCheckoutError("Please fix the highlighted fields");
      } else {
        setCheckoutError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  // Add order success view
  const renderOrderSuccess = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-16 text-center space-y-6"
    >
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-amber-900 mb-4">
          Order Placed Successfully!
        </h2>

        <div className="text-left space-y-4">
          <div className="border-b pb-4">
            <p className="text-amber-600">Order ID: #{lastOrder?.id}</p>
            <p className="text-amber-600">Expected Delivery: {
              new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
                .toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })
            }</p>
          </div>

          <div className="space-y-2">
            {lastOrder?.orderItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-amber-900">{item.name}</h3>
                  <p className="text-sm text-amber-600">
                    Quantity: {item.quantity} × ₹{item.selectedSize?.price || item.sizes[0].price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-amber-900">
              <span>Total</span>
              <span className="font-bold">₹{lastOrder?.orderSummary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/products"
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="bg-amber-100 text-amber-800 px-6 py-2 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Update the renderCheckoutForm function to add better validation feedback
  const renderCheckoutForm = () => (
    <AnimatePresence>
      {isCheckoutOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => !isProcessingCheckout && setIsCheckoutOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-amber-900 mb-4">Checkout</h3>
            
            {checkoutError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{checkoutError}</p>
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              {Object.entries(checkoutForm).map(([field, value]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-amber-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={value}
                    onChange={e => {
                      setCheckoutForm(prev => ({
                        ...prev,
                        [field]: e.target.value
                      }));
                      // Clear error when user starts typing
                      if (formErrors[field as keyof CheckoutForm]) {
                        setFormErrors(prev => ({
                          ...prev,
                          [field]: undefined
                        }));
                      }
                    }}
                    disabled={isProcessingCheckout}
                    placeholder={`Enter your ${field.toLowerCase()}`}
                    className={`w-full p-2 border rounded-lg ${
                      formErrors[field as keyof CheckoutForm]
                        ? 'border-red-500 bg-red-50'
                        : 'border-amber-200'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  />
                  {formErrors[field as keyof CheckoutForm] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors[field as keyof CheckoutForm]}
                    </p>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-amber-100">
                {isProcessingCheckout ? (
                  <LoadingButton text="Processing your order..." />
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Pay ₹{total.toFixed(2)}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (orderPlaced && lastOrder) {
    return renderOrderSuccess();
  }

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <EmptyCartAnimation />
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  const renderOrderSummary = () => (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between text-amber-800">
        <span>Subtotal ({cart.length} items)</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      {appliedCoupon && (
        <div className="flex justify-between text-green-600">
          <span>Discount ({appliedCoupon.code})</span>
          <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between text-amber-800">
        <span>Shipping</span>
        <span className={shipping === 0 ? "text-green-500" : ""}>
          {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
        </span>
      </div>
      <div className="flex justify-between font-bold text-lg pt-4 border-t border-amber-100">
        <span>Total</span>
        <span>₹{(subtotal + shipping - (appliedCoupon?.discount || 0)).toFixed(2)}</span>
      </div>
    </div>
  );

  const renderShareModal = () => (
    <AnimatePresence>
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white p-6 rounded-lg max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Share Cart</h3>
            <div className="space-y-4">
              <button 
                onClick={() => handleShare('copy')}
                className="w-full p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-sm text-amber-800 flex items-center justify-center gap-2"
              >
                <ClipboardCopy className="h-4 w-4" />
                Copy to Clipboard
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-sm text-green-800 flex items-center justify-center gap-2"
              >
                Share via WhatsApp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Update the download button in the Quick Actions section
  const renderQuickActions = () => (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h4 className="font-semibold text-amber-900">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleShareCart}
          className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <Share2 className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-800">Share Cart</span>
        </button>
        {isDownloading ? (
          <LoadingButton text="Generating PDF..." />
        ) : (
          <button
            onClick={handleDownloadSummary}
            className="flex items-center justify-center gap-2 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <FileDown className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">Download Summary</span>
          </button>
        )}
      </div>
    </div>
  );

  // Update the getRelatedProducts function
  const getRelatedProducts = () => {
    if (cart.length === 0) return [];

    const cartCategories = cart.map(item => item.category);
    const cartProductIds = new Set(cart.map(item => item.id));
    
    const relatedProducts = FEATURED_PRODUCTS.filter(product => 
      !cartProductIds.has(product.id) && // Not in cart
      cartCategories.includes(product.category) // Matches category
    );

    // Shuffle array and take first 3
    return relatedProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  // Update the renderRecommendedProducts function
  const renderRecommendedProducts = () => {
    // Get unique categories from cart items
    const cartCategories = [...new Set(cart.map(item => item.category))];
    const cartProductIds = new Set(cart.map(item => item.id));
    
    // Get related products from PRODUCTS array
    const relatedProducts = PRODUCTS
      .filter(product => 
        !cartProductIds.has(product.id) && // Not already in cart
        cartCategories.includes(product.category) // Matches cart items' categories
      )
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, 5); // Show max 5 recommendations

    if (relatedProducts.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-amber-900 mb-4">
          You might also like
        </h3>
        <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 hide-scrollbar snap-x">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                transition: { delay: index * 0.1 }
              }}
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 w-36 snap-start rounded-lg hover:bg-amber-50 transition-colors border border-amber-100 relative"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-24 object-cover transform hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute top-1 right-1 bg-amber-500/90 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                  {product.category}
                </span>
              </div>
              <div className="p-2">
                <h4 className="text-xs font-medium text-amber-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-amber-900">
                    From ₹{Math.min(...product.sizes.map(s => s.price))}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart({ ...product, selectedSize: product.sizes[0] })}
                    className="p-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Add this to handle step rendering
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'cart':
        return (
          <CartStep
            cart={cart}
            handleQuantityUpdate={handleQuantityUpdate}
            removeFromCart={removeFromCart}
            onNext={() => setCurrentStep('delivery')}
          />
        );
      case 'delivery':
        return (
          <DeliveryStep
            formData={checkoutForm}
            setFormData={setCheckoutForm}
            errors={formErrors}
            onNext={() => setCurrentStep('payment')}
            onBack={() => setCurrentStep('cart')}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            total={total}
            onNext={() => {
              setCurrentStep('confirmation');
              handlePlaceOrder();
            }}
            onBack={() => setCurrentStep('delivery')}
            onApplyCoupon={handleCouponSubmit}
            appliedCoupon={appliedCoupon}
            couponError={couponError}
          />
        );
      case 'confirmation':
        return renderOrderSuccess();
      default:
        return null;
    }
  };

  // Add this function to handle order placement
  const handlePlaceOrder = () => {
    try {
      const orderPayload = {
        orderItems: cart,
        customerInfo: checkoutForm,
        orderSummary: {
          subtotal,
          shipping,
          discount: appliedCoupon?.discount || 0,
          total: subtotal + shipping - (appliedCoupon?.discount || 0) // Update this line
        }
      };
      
      addOrder(orderPayload);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      setCheckoutError('Failed to place order. Please try again.');
    }
  };

  // Update the return statement
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/products"
          className="text-amber-600 hover:text-amber-700 flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Continue Shopping
        </Link>
        <h2 className="text-3xl font-bold text-amber-900">Checkout</h2>
      </div>

      {renderStepper()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {renderCurrentStep()}
        </div>

        {/* Order Summary Sidebar - Only show in cart and payment steps */}
        {(currentStep === 'cart' || currentStep === 'payment') && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h3 className="text-lg font-semibold text-amber-900 mb-4">
                Order Summary
              </h3>
              {renderOrderSummary()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
