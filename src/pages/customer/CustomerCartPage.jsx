import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { validateCartOrder } from '../../lib/apiSecurity';

export const CustomerCartPage = () => {
  const { showToast, placeOrderWithIdempotency } = useApp();
  const { walletBalance, user } = useAuth();
  const navigate = useNavigate();

  // Cart Items State
  const [cart, setCart] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('smilefood_cart') || '[]');
      if (stored.length > 0) return stored;
    } catch {}
    // Default starter items if empty
    return [
      { id: 'ng-1', name: 'Special Smokey Party Jollof Rice', restaurant: 'Mama Cass Restaurant', price: 14.50, quantity: 2, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&fit=crop&q=80' },
      { id: 'dr-1', name: 'Fresh Passionfruit Citrus Chapman', restaurant: 'Sweet Sensation Kitchen', price: 6.50, quantity: 1, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&fit=crop&q=80' },
    ];
  });

  // Persisted Delivery Address Baseline
  const [persistedAddress, setPersistedAddress] = useState('14 Adeola Odeku St, Victoria Island, Lagos');
  const [persistedInstructions, setPersistedInstructions] = useState('Call on arrival, leave with reception');

  // Address Edit Mode State (View-only by default)
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(persistedAddress);
  const [tempInstructions, setTempInstructions] = useState(persistedInstructions);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'card' | 'bank'
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Cart operations (remain fully operational)
  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
      localStorage.setItem('smilefood_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('smilefood_cart', JSON.stringify(updated));
      return updated;
    });
    showToast('Item removed from cart', 'info');
  };

  const clearAndCancelCart = () => {
    setCart([]);
    localStorage.removeItem('smilefood_cart');
    showToast('Order cancelled before payment authorization. No charges incurred.', 'warning');
    navigate('/customer');
  };

  // Explicit Address Editing Controls
  const handleStartEditAddress = () => {
    setTempAddress(persistedAddress);
    setTempInstructions(persistedInstructions);
    setIsEditingAddress(true);
  };

  const handleApplyAddress = (e) => {
    e.preventDefault();
    if (!tempAddress || tempAddress.trim().length < 5) {
      showToast('Please enter a valid street address (min 5 characters).', 'warning');
      return;
    }
    setPersistedAddress(tempAddress.trim());
    setPersistedInstructions(tempInstructions ? tempInstructions.trim() : '');
    setIsEditingAddress(false);
    showToast('Delivery destination updated successfully.', 'success');
  };

  const handleCancelEditAddress = () => {
    setTempAddress(persistedAddress);
    setTempInstructions(persistedInstructions);
    setIsEditingAddress(false);
  };

  // Canonical calculations
  const foodSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = foodSubtotal > 0 ? 4.50 : 0.00;
  const serviceFee = foodSubtotal > 0 ? 2.00 : 0.00;
  const grandTotal = foodSubtotal + deliveryFee + serviceFee;

  // Checkout with Server-side Cart & Order Validation
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.', 'warning');
      return;
    }

    setCheckoutError(null);

    // 1. Backend validation against catalogue, canonical prices, fees, and balance
    const validationResult = validateCartOrder({
      cartItems: cart,
      paymentMethod,
      walletBalance,
      deliveryAddress: persistedAddress,
      instructions: persistedInstructions,
      user,
    });

    if (!validationResult.valid) {
      setCheckoutError(validationResult.error);
      showToast(validationResult.error, 'error');
      return;
    }

    setIsCheckingOut(true);

    try {
      // Simulate gateway authorization latency
      await new Promise(r => setTimeout(r, 1000));

      const validatedOrder = validationResult.order;
      const idempotencyKey = `ord_idem_${validatedOrder.id}_${Date.now()}`;

      // Submit with idempotency
      const placementResult = placeOrderWithIdempotency(validatedOrder, idempotencyKey);

      if (!placementResult.success) {
        setCheckoutError(placementResult.error || 'Failed to authorize escrow payment.');
        showToast(placementResult.error || 'Order placement failed.', 'error');
        setIsCheckingOut(false);
        return;
      }

      // Order placed successfully
      localStorage.removeItem('smilefood_cart');
      setIsCheckingOut(false);
      showToast(`Order ${validatedOrder.orderNumber} placed! Escrow funds locked securely.`, 'success');
      navigate('/customer/track');
    } catch {
      setIsCheckingOut(false);
      setCheckoutError('Payment gateway timeout. Please retry authorization.');
      showToast('Checkout transaction failed.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BackButton fallbackTo="/customer" label="Explore Dishes" />
          </div>
          <h2 className="text-[26px] font-extrabold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
            Checkout & Cart Lifecycle
          </h2>
          <p className="text-[13px] text-[#777D79] dark:text-[#8E9A92]">
            Review your order breakdown, delivery address, and escrow authorization
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearAndCancelCart}
            className="px-4 py-2 rounded-2xl bg-[#FDECEC] hover:bg-[#FCD8D8] text-[#D95353] text-[13px] font-bold transition-all flex items-center gap-1.5"
          >
            <IconsaxIcon name="close" size={14} color="#D95353" />
            <span>Cancel Order</span>
          </button>
        )}
      </div>

      {/* Cancellation Assurance Notice */}
      <div className="p-4 rounded-2xl bg-[#EAF8D8] dark:bg-[#14301C] border border-[#D5F28A]/60 flex items-center gap-3 text-[13px] font-medium text-[#014C32] dark:text-[#D5F28A]">
        <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#202922] flex items-center justify-center shrink-0">
          <IconsaxIcon name="shield-check" size={18} color="#079B48" />
        </div>
        <div>
          <strong className="block text-[#079B48]">Customer Protection Policy:</strong>
          You can freely cancel your order at any moment before payment authorization with zero penalties.
        </div>
      </div>

      {/* Checkout Error Message */}
      {checkoutError && (
        <div className="p-4 rounded-2xl bg-[#FDECEC] dark:bg-[#331414] border border-[#D95353]/30 flex items-center gap-3 text-[13px] text-[#D95353] dark:text-[#E56262]">
          <IconsaxIcon name="failed" size={18} color="#D95353" />
          <span className="font-semibold">{checkoutError}</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="smile-card p-12 text-center bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EAF8D8] text-[#079B48] flex items-center justify-center mx-auto">
            <IconsaxIcon name="orders" size={28} />
          </div>
          <h3 className="text-[20px] font-bold text-[#171917] dark:text-[#F0F5F2]">Your cart is empty</h3>
          <p className="text-[13px] text-[#777D79] max-w-sm mx-auto">
            Browse our diverse menu from partner kitchens and pick your favorite cravings.
          </p>
          <Link
            to="/customer"
            className="inline-block px-6 py-3 rounded-full bg-[#079B48] text-white font-bold text-[13px] hover:bg-[#087F3C] transition-all"
          >
            Explore Menus Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart Items Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 space-y-4">
              <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
                Selected Items ({cart.length})
              </h3>

              <div className="divide-y divide-[#EEEEEE] dark:divide-[#27332A]">
                {cart.map(item => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover bg-gray-100" />
                      <div>
                        <h4 className="font-bold text-[14px] text-[#171917] dark:text-[#F0F5F2]">{item.name}</h4>
                        <p className="text-[12px] text-[#777D79]">{item.restaurant}</p>
                        <p className="text-[13px] font-extrabold text-[#079B48] font-['Outfit'] mt-0.5">
                          ₦{(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Operational Cart Quantity Controls */}
                      <div className="flex items-center border border-[#EEEEEE] dark:border-[#27332A] rounded-xl overflow-hidden bg-[#F5F6F5] dark:bg-[#202922]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="w-8 h-8 flex items-center justify-center font-bold text-[#171917] dark:text-white hover:bg-white dark:hover:bg-[#27332A] transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="w-8 h-8 flex items-center justify-center font-bold text-[#171917] dark:text-white hover:bg-white dark:hover:bg-[#27332A] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="p-2 text-[#D95353] hover:bg-[#FDECEC] rounded-xl transition-colors"
                      >
                        <IconsaxIcon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination Card (View-Only by default with explicit Edit/Save controls) */}
            <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
                <div>
                  <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                    Delivery Destination
                  </h3>
                  <p className="text-[11px] text-[#777D79] dark:text-[#8E9A92]">
                    Sensitive location details are protected and view-only by default
                  </p>
                </div>
                {!isEditingAddress ? (
                  <button
                    type="button"
                    id="btn-edit-cart-address"
                    onClick={handleStartEditAddress}
                    className="px-3.5 py-1.5 rounded-full border border-[#EEEEEE] dark:border-[#27332A] hover:border-[#079B48] text-[12px] font-bold text-[#079B48] transition-colors flex items-center gap-1.5"
                  >
                    <IconsaxIcon name="edit" size={13} color="#079B48" />
                    <span>Edit Address</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-[#F28C00]">Editing Active</span>
                )}
              </div>

              {!isEditingAddress ? (
                /* View-Only State: Clicking or focusing does NOT trigger edit mode */
                <div className="space-y-3">
                  <div
                    tabIndex={0}
                    className="p-3.5 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] flex items-start gap-3 cursor-default select-text focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#EAF8D8] text-[#079B48] flex items-center justify-center shrink-0 mt-0.5">
                      <IconsaxIcon name="location" size={16} color="#079B48" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
                        Drop-off Street Address
                      </p>
                      <p className="text-[13px] font-semibold text-[#171917] dark:text-[#F0F5F2] mt-0.5">
                        {persistedAddress}
                      </p>
                    </div>
                  </div>

                  <div
                    tabIndex={0}
                    className="p-3 rounded-2xl bg-[#F5F6F5]/70 dark:bg-[#202922]/50 border border-[#EEEEEE] dark:border-[#27332A] flex items-start gap-3 cursor-default select-text focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0 text-[#777D79] text-xs">
                      <IconsaxIcon name="info-circle" size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#777D79] dark:text-[#8E9A92]">
                        Courier Instructions
                      </p>
                      <p className="text-[12px] font-medium text-[#171917] dark:text-[#F0F5F2]">
                        {persistedInstructions || 'No special courier instructions provided'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Explicit Edit State: Form with Save & Cancel */
                <form onSubmit={handleApplyAddress} className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                      Drop-off Street Address
                    </label>
                    <input
                      type="text"
                      id="input-cart-address"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      placeholder="Enter delivery street address"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#079B48] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:ring-2 focus:ring-[#079B48]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">
                      Courier Instructions
                    </label>
                    <input
                      type="text"
                      id="input-cart-instructions"
                      value={tempInstructions}
                      onChange={(e) => setTempInstructions(e.target.value)}
                      placeholder="e.g. Call on arrival, leave with security"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      id="btn-cancel-cart-address"
                      onClick={handleCancelEditAddress}
                      className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#777D79] dark:text-[#8E9A92] hover:bg-[#F5F6F5] dark:hover:bg-[#202922] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="btn-save-cart-address"
                      className="px-5 py-2 rounded-xl bg-[#079B48] hover:bg-[#087F3C] text-white text-[12px] font-bold shadow-sm transition-all"
                    >
                      Apply Address
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Payment & Breakdown Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 space-y-5">
              <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit'] pb-2 border-b border-[#EEEEEE] dark:border-[#27332A]">
                Payment Method
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'wallet', label: `SMILE Wallet (₦${walletBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })})`, icon: 'wallet' },
                  { id: 'card', label: 'Debit / Credit Card (Stripe Tokenized)', icon: 'card' },
                  { id: 'bank', label: 'Instant Bank Transfer', icon: 'bank' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === m.id
                        ? 'border-[#079B48] bg-[#EAF8D8] dark:bg-[#14301C]'
                        : 'border-[#EEEEEE] dark:border-[#27332A] hover:border-[#D5F28A]'
                    }`}
                  >
                    <IconsaxIcon name={m.icon} size={18} color={paymentMethod === m.id ? '#079B48' : '#777D79'} />
                    <span className={`text-[13px] font-semibold ${paymentMethod === m.id ? 'text-[#014C32] dark:text-[#D5F28A]' : 'text-[#171917] dark:text-[#F0F5F2]'}`}>
                      {m.label}
                    </span>
                    {paymentMethod === m.id && (
                      <div className="ml-auto w-4 h-4 rounded-full bg-[#079B48] flex items-center justify-center">
                        <IconsaxIcon name="check" size={10} color="white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#EEEEEE] dark:border-[#27332A] text-[13px]">
                <div className="flex justify-between text-[#777D79] dark:text-[#8E9A92]">
                  <span>Food Subtotal:</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">₦{foodSubtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[#777D79] dark:text-[#8E9A92]">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">₦{deliveryFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[#777D79] dark:text-[#8E9A92]">
                  <span>Service & Escrow Fee:</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">₦{serviceFee.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[16px] font-extrabold text-[#171917] dark:text-[#F0F5F2] pt-2 border-t border-[#EEEEEE] dark:border-[#27332A]">
                  <span>Grand Total:</span>
                  <span className="text-[#079B48] font-['Outfit'] text-[20px]">₦{grandTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Authorize & Place Order CTA */}
              <button
                type="button"
                id="btn-place-order"
                onClick={handlePlaceOrder}
                disabled={isCheckingOut || cart.length === 0}
                className="w-full h-12 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[14px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying & Locking Escrow...</span>
                  </>
                ) : (
                  <span>Authorize & Place Order (₦{grandTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })})</span>
                )}
              </button>

              <button
                type="button"
                onClick={clearAndCancelCart}
                className="w-full text-center text-[12px] font-bold text-[#D95353] hover:underline"
              >
                Cancel order & return to explore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCartPage;
