import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { 
  Trash2, Plus, Minus, ArrowLeft, Shield, Truck, Clock, AlertCircle,
  Package, FileDown, Share2, ChevronRight, Timer, ClipboardCopy, ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { validateCoupon } from '../constants/coupons';
import { EmptyCartAnimation } from '../components/EmptyCartAnimation';
import { PRODUCTS, FEATURED_PRODUCTS } from '../data/products'; // Change this line to import PRODUCTS array

// Add this font import at the top
const FONT = "helvetica";

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, addToCart } = useStore();
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.selectedSize?.price || item.sizes[0].price;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 149 ? 0 : 50;
  const discount = 0; // You can implement coupon logic here
  const total = subtotal + shipping - discount;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCoupon(couponCode, subtotal);
    
    if (result.isValid) {
      setAppliedCoupon({ 
        code: couponCode.toUpperCase(), 
        discount: result.discount 
      });
      setCouponError("");
      setCouponCode("");
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
        Total: ₹${(subtotal + shipping - (appliedCoupon?.discount || 0)).toFixed(2)}
        
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
        <h2 className="text-3xl font-bold text-amber-900">Shopping Cart</h2>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {["Cart", "Delivery", "Payment", "Confirmation"].map(
            (step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    index === 0
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 text-amber-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className="h-1 w-16 mx-2 bg-amber-100">
                    <div
                      className={`h-full ${
                        index === 0 ? "bg-amber-500" : ""
                      } transition-all duration-300`}
                    ></div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                    />
                    {item.inStock ? (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <h3 className="text-xl font-semibold text-amber-900">
                      {item.name}
                    </h3>
                    <p className="text-amber-700 text-sm">{item.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-amber-600 text-sm">
                        Size: {item.selectedSize?.size || item.sizes[0].size}
                      </span>
                      <span className="text-amber-900 font-bold">
                        ₹
                        {(
                          item.selectedSize?.price || item.sizes[0].price
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityUpdate(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityUpdate(
                            item.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-12 text-center bg-transparent"
                      />
                      <button
                        onClick={() =>
                          handleQuantityUpdate(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowConfirmDelete(item.id)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {showConfirmDelete === item.id && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-red-700 mb-2">
                      Are you sure you want to remove this item?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          setShowConfirmDelete(null);
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Yes, remove
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-amber-900 mb-6">
              Order Summary
            </h3>
            {renderOrderSummary()}

            <form onSubmit={handleCouponSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-grow p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {couponError}
                </p>
              )}
            </form>

            <button className="w-full bg-amber-500 text-white py-3 rounded-lg hover:bg-amber-600 transition-colors mb-4">
              Proceed to Checkout
            </button>

            <div className="space-y-3 text-sm text-amber-700">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over ₹150</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Delivery within 2-3 business days</span>
              </div>
            </div>
          </div>
          {renderQuickActions()}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Timer className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">
                Delivery Estimate
              </h4>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-amber-800 text-sm mb-2">
                Estimated delivery by:
              </p>
              <p className="text-lg font-semibold text-amber-900">
                {deliveryDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
  
          {renderRecommendedProducts()}
        </div>
      </div>

      {renderShareModal()}
    </div>
  );
};
