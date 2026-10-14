import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconsaxIcon from '../../components/IconsaxIcon';
import BackButton from '../../components/BackButton';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const CustomerCartPage = () => {
  const { showToast, placeOrderWithIdempotency } = useApp();
  const { walletBalance, displayName } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('smilefood_cart') || '[]');
      if (stored.length > 0) return stored;
    } catch {}
    // Default starter item if empty
    return [
      { id: 'd-1', name: 'Special Smokey Party Jollof', restaurant: 'Mama Cass Restaurant', price: 14.50, quantity: 2, image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&fit=crop&q=80' },
      { id: 'd-6', name: 'Fresh Passionfruit Citrus Chapman', restaurant: 'Sweet Sensation Kitchen', price: 6.50, quantity: 1, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&fit=crop&q=80' },
    ];
  });

  const [address, setAddress] = useState('14 Adeola Odeku St, Victoria Island, Lagos');
  const [instructions, setInstructions] = useState('Call on arrival, leave with reception');
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'card' | 'bank'
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  // Calculations
  const foodSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = foodSubtotal > 0 ? 4.50 : 0.00;
  const serviceFee = foodSubtotal > 0 ? 2.00 : 0.00;
  const grandTotal = foodSubtotal + deliveryFee + serviceFee;

  // Split calculation preview
  const vendorShare = foodSubtotal * 0.85; // 85%
  const riderShare = deliveryFee * 0.10 + 3.00; // 10%
  const platformShare = grandTotal - vendorShare - riderShare; // 5%

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.', 'warning');
      return;
    }
    if (paymentMethod === 'wallet' && walletBalance < grandTotal) {
      showToast(`Insufficient wallet balance ($${walletBalance.toFixed(2)}). Please top up or choose card.`, 'error');
      return;
    }

    setIsCheckingOut(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsCheckingOut(false);

    const newOrderNumber = `#SF-${Math.floor(80000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderNumber.replace('#', ''),
      orderNumber: newOrderNumber,
      customer: { name: displayName, address, phone: '+234 803 123 4567' },
      restaurant: { name: cart[0]?.restaurant || 'Mama Cass Restaurant' },
      status: 'Pending',
      stateMachineStep: 'PaymentEscrowLocked',
      escrowStatus: 'LOCKED',
      totalAmount: grandTotal,
      foodSubtotal,
      deliveryFee,
      serviceFee,
      items: cart,
      date: 'Just now',
      splitPayout: {
        vendor: vendorShare,
        rider: riderShare,
        platform: platformShare
      }
    };

    const idempotencyKey = `ord_idem_${newOrder.id}_${Date.now()}`;
    placeOrderWithIdempotency(newOrder, idempotencyKey);
    localStorage.removeItem('smilefood_cart');
    showToast(`Order ${newOrderNumber} placed! Escrow funds locked securely.`, 'success');
    navigate('/customer/track');
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
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-2xl object-cover bg-gray-100" />
                      <div>
                        <h4 className="font-bold text-[14px] text-[#171917] dark:text-[#F0F5F2]">{item.name}</h4>
                        <p className="text-[12px] text-[#777D79]">{item.restaurant}</p>
                        <p className="text-[13px] font-extrabold text-[#079B48] font-['Outfit'] mt-0.5">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#EEEEEE] dark:border-[#27332A] rounded-xl overflow-hidden bg-[#F5F6F5] dark:bg-[#202922]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-[#171917] dark:text-white hover:bg-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-[#171917] dark:text-white hover:bg-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-[#D95353] hover:bg-[#FDECEC] rounded-xl transition-colors"
                      >
                        <IconsaxIcon name="trash" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="smile-card bg-white dark:bg-[#181F1A] border border-[#EEEEEE] dark:border-[#27332A] rounded-[32px] p-6 space-y-4">
              <h3 className="text-[16px] font-bold text-[#171917] dark:text-[#F0F5F2] font-['Outfit']">
                Delivery Destination
              </h3>
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Drop-off Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#171917] dark:text-[#F0F5F2] mb-1">Rider Instructions</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EEEEEE] dark:border-[#27332A] bg-[#F5F6F5] dark:bg-[#202922] text-[13px] font-medium text-[#171917] dark:text-[#F0F5F2] focus:outline-none focus:border-[#079B48]"
                />
              </div>
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
                  { id: 'wallet', label: `SMILE Wallet ($${walletBalance.toFixed(2)})`, icon: 'wallet' },
                  { id: 'card', label: 'Debit / Credit Card (Stripe)', icon: 'card' },
                  { id: 'bank', label: 'Instant Bank Transfer', icon: 'bank' },
                ].map(m => (
                  <button
                    key={m.id}
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
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">${foodSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#777D79] dark:text-[#8E9A92]">
                  <span>Delivery Fee:</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#777D79] dark:text-[#8E9A92]">
                  <span>Service & Escrow Fee:</span>
                  <span className="font-bold text-[#171917] dark:text-[#F0F5F2]">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[16px] font-extrabold text-[#171917] dark:text-[#F0F5F2] pt-2 border-t border-[#EEEEEE] dark:border-[#27332A]">
                  <span>Grand Total:</span>
                  <span className="text-[#079B48] font-['Outfit'] text-[20px]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Authorize & Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
                className="w-full h-12 rounded-full bg-[#079B48] hover:bg-[#087F3C] text-white text-[14px] font-bold transition-all shadow-md shadow-[#079B48]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <IconsaxIcon name="loading" size={16} color="white" />
                    <span>Locking Escrow Payment...</span>
                  </>
                ) : (
                  <span>Authorize & Place Order (${grandTotal.toFixed(2)})</span>
                )}
              </button>

              <button
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
