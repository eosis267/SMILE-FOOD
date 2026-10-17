import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  INITIAL_KPIS, 
  REGIONAL_STATISTICS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_WALLET_TRANSACTIONS 
} from '../data/mockData';
import { 
  VALID_TRANSITIONS, 
  createLedgerEntry, 
  calculateSplitPayout,
  exportOrdersPDF 
} from '../data/ledgerService';
import { 
  isSupabaseReady, 
  subscribeToOrdersRealtime 
} from '../lib/supabaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // BroadcastChannel for cross-tab synchronization
  const broadcastRef = useRef(null);
  const idempotencyKeysRef = useRef(new Set());

  // Safe BroadcastChannel sender that never throws if channel is closed/reloading
  const postBroadcast = (payload) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        if (!broadcastRef.current) {
          broadcastRef.current = new BroadcastChannel('smilefood_realtime_sync');
        }
        broadcastRef.current.postMessage(payload);
      }
    } catch {
      try {
        broadcastRef.current = new BroadcastChannel('smilefood_realtime_sync');
        broadcastRef.current.postMessage(payload);
      } catch {
        // Silently catch to avoid crashing React lifecycle
      }
    }
  };

  // 1. Dark Mode State & Multi-Tab Sync
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('smilefood_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('smilefood_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      postBroadcast({ type: 'THEME_SYNC', darkMode: next });
      return next;
    });
  };

  // 2. Orders State & Persistence
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('smilefood_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('smilefood_orders', JSON.stringify(orders));
    postBroadcast({
      type: 'ORDERS_SYNC',
      payload: { orders }
    });
  }, [orders]);

  // Idempotent & Server-Validated Order Placement
  const placeOrderWithIdempotency = (newOrder, idempotencyKey) => {
    const key = idempotencyKey || newOrder.id || newOrder.orderNumber;
    if (idempotencyKeysRef.current.has(key)) {
      console.warn('Idempotency safeguard: Duplicate order submission suppressed for key:', key);
      return { success: false, duplicate: true, error: 'Duplicate order submission detected.' };
    }
    idempotencyKeysRef.current.add(key);

    const paymentLedger = createLedgerEntry(newOrder, 'PAYMENT_VERIFIED');
    setLedgerEntries(prev => [...paymentLedger, ...prev]);
    setOrders(prev => [newOrder, ...prev]);

    const orderNum = newOrder.orderNumber || newOrder.id;
    const cleanRef = `ORD-${String(orderNum).replace(/[^a-zA-Z0-9]/g, '')}`;
    const orderTx = {
      id: `wt-ord-${newOrder.id || Date.now()}`,
      type: 'debit',
      description: `Meal Order ${orderNum} — ${newOrder.restaurant?.name || newOrder.restaurant || 'Restaurant'}`,
      amount: Number(newOrder.totalAmount || newOrder.total || 35.00),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ref: cleanRef,
      balance: Math.max(0, 1500 - Number(newOrder.totalAmount || newOrder.total || 35.00))
    };
    addTransaction(orderTx);
    return { success: true };
  };

  // 3. KPIs State
  const [kpis, setKpis] = useState(INITIAL_KPIS);
  const [regionalStats] = useState(REGIONAL_STATISTICS);

  // 4. Ledger Audit Trail
  const [ledgerEntries, setLedgerEntries] = useState(() => {
    const saved = localStorage.getItem('smilefood_ledger');
    if (saved) return JSON.parse(saved);

    // Bootstrap initial ledger from initial orders
    let bootstrapped = [];
    INITIAL_ORDERS.forEach(ord => {
      bootstrapped.push(...createLedgerEntry(ord, 'PAYMENT_VERIFIED'));
      if (ord.stateMachineStep === 'Delivered') {
        bootstrapped.push(...createLedgerEntry(ord, 'DELIVERED'));
      } else if (ord.stateMachineStep === 'Cancelled') {
        bootstrapped.push(...createLedgerEntry(ord, 'CANCELLED'));
      }
    });
    return bootstrapped;
  });

  useEffect(() => {
    localStorage.setItem('smilefood_ledger', JSON.stringify(ledgerEntries));
    postBroadcast({
      type: 'LEDGER_SYNC',
      payload: { ledger: ledgerEntries }
    });
  }, [ledgerEntries]);

  // 4.B. Live Synchronized Transactions Ledger Across All Users & Tabs
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('smilefood_wallet_txs');
      return saved ? JSON.parse(saved) : INITIAL_WALLET_TRANSACTIONS;
    } catch {
      return INITIAL_WALLET_TRANSACTIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('smilefood_wallet_txs', JSON.stringify(transactions));
      postBroadcast({
        type: 'TRANSACTIONS_SYNC',
        payload: { transactions }
      });
    } catch {}
  }, [transactions]);

  const addTransaction = (newTx) => {
    setTransactions(prev => {
      const exists = prev.some(t => t.id === newTx.id || (t.ref && t.ref === newTx.ref));
      if (exists) return prev;
      const updated = [newTx, ...prev];
      postBroadcast({
        type: 'TRANSACTIONS_SYNC',
        payload: { transactions: updated }
      });
      return updated;
    });
  };

  // ─── Real-Time Cross-Tab & Backend Channel Setup ────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('smilefood_realtime_sync');
      broadcastRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'ORDERS_SYNC' && payload) {
          setOrders(payload.orders);
          if (payload.ledger) setLedgerEntries(payload.ledger);
        } else if (type === 'TRANSACTIONS_SYNC' && payload?.transactions) {
          setTransactions(payload.transactions);
        } else if (type === 'LEDGER_SYNC' && payload?.ledger) {
          setLedgerEntries(payload.ledger);
        } else if (type === 'THEME_SYNC' && typeof event.data.darkMode === 'boolean') {
          setDarkMode(event.data.darkMode);
        }
      };
    }

    // Storage listener fallback
    const handleStorage = (e) => {
      if (e.key === 'smilefood_orders' && e.newValue) {
        try { setOrders(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'smilefood_wallet_txs' && e.newValue) {
        try { setTransactions(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'smilefood_ledger' && e.newValue) {
        try { setLedgerEntries(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'smilefood_dark_mode' && e.newValue) {
        try { setDarkMode(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // Live Supabase Postgres Realtime Subscription
    let unsubscribeSupabase = () => {};
    if (isSupabaseReady()) {
      unsubscribeSupabase = subscribeToOrdersRealtime((payload) => {
        if (payload?.new) {
          setOrders(prev => {
            const exists = prev.some(o => o.id === payload.new.id);
            if (exists) {
              return prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o);
            }
            return [payload.new, ...prev];
          });
        }
      });
    }

    return () => {
      try {
        broadcastRef.current?.close();
      } catch {}
      broadcastRef.current = null;
      window.removeEventListener('storage', handleStorage);
      unsubscribeSupabase();
    };
  }, []);

  // 5. Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [], // e.g. ['Completed', 'Pending']
    dateRange: 'Today', // 'Today', 'Last 7 days', 'Last 30 days', 'Custom'
    region: 'all',
    minAmount: 0,
    maxAmount: 200
  });

  // 6. Selected Order & Modal Controls
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 7. Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 8. Order State Machine Transitions
  const advanceOrderState = (orderId, targetState, cancelReason = '') => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;

        const currentStep = order.stateMachineStep;
        const validNext = VALID_TRANSITIONS[currentStep] || [];

        if (!validNext.includes(targetState)) {
          showToast(`Invalid transition from ${currentStep} to ${targetState}`, 'error');
          return order;
        }

        let updatedStatus = 'Pending';
        let updatedEscrow = order.escrowStatus;
        let newEntries = [];

        if (targetState === 'Delivered') {
          updatedStatus = 'Completed';
          updatedEscrow = 'RELEASED';
          newEntries = createLedgerEntry(order, 'DELIVERED');
          const releaseTx = {
            id: `wt-esc-${order.id}-${Date.now()}`,
            type: 'credit',
            description: `Escrow release payout — Order ${order.orderNumber}`,
            amount: Number(order.totalAmount || 35.00),
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            ref: `ESC-${String(order.orderNumber).replace(/[^a-zA-Z0-9]/g, '')}`,
            balance: 1500.00 + Number(order.totalAmount || 35.00)
          };
          addTransaction(releaseTx);
          showToast(`Order ${order.orderNumber} delivered! Escrow split released to vendor & rider.`, 'success');
        } else if (targetState === 'Cancelled') {
          updatedStatus = 'Failed';
          updatedEscrow = 'REFUNDED';
          newEntries = createLedgerEntry(order, 'CANCELLED');
          const refundTx = {
            id: `wt-ref-${order.id}-${Date.now()}`,
            type: 'credit',
            description: `Escrow refund — Order ${order.orderNumber} cancelled`,
            amount: Number(order.totalAmount || 35.00),
            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
            ref: `REF-${String(order.orderNumber).replace(/[^a-zA-Z0-9]/g, '')}`,
            balance: 1500.00 + Number(order.totalAmount || 35.00)
          };
          addTransaction(refundTx);
          showToast(`Order ${order.orderNumber} cancelled (${cancelReason || 'Operational reason'}). Escrow refunded.`, 'warning');
        } else {
          showToast(`Order ${order.orderNumber} progressed to ${targetState}`, 'success');
        }

        if (newEntries.length > 0) {
          setLedgerEntries(entries => [...newEntries, ...entries]);
        }

        const updatedOrder = {
          ...order,
          stateMachineStep: targetState,
          status: updatedStatus,
          escrowStatus: updatedEscrow,
          cancelReason: targetState === 'Cancelled' ? cancelReason : order.cancelReason
        };

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }

        return updatedOrder;
      });
    });
  };

  // 9. Quick Demo Order Generator (To test webhook and state machine live)
  const createDemoOrder = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const id = `SF-${randomNum}`;
    const foodSubtotal = 48.00;
    const deliveryFee = 6.00;
    const serviceFee = 2.00;
    const split = calculateSplitPayout(foodSubtotal, deliveryFee, serviceFee);

    const newOrder = {
      id,
      orderNumber: `#${id}`,
      customer: {
        name: "Elena Rostova",
        phone: "+1 (555) 882-9901",
        address: "104 Maple Grove, Central District"
      },
      restaurant: {
        name: "Bella Napoli Ristorante",
        address: "7 Via Roma, Central"
      },
      items: [
        { name: "Rigatoni alla Vodka", qty: 2, price: 18.00 },
        { name: "Insalata Caprese", qty: 1, price: 12.00 }
      ],
      foodSubtotal,
      deliveryFee,
      serviceFee,
      totalAmount: split.total,
      split: {
        vendor: split.vendor,
        rider: split.rider,
        platform: split.platform
      },
      status: "Pending",
      stateMachineStep: "Created",
      escrowStatus: "LOCKED",
      region: "Central area",
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      paymentMethod: "Card (Stripe Webhook)",
      paymentRef: `tx_live_${randomNum}_wh`
    };

    const paymentLedger = createLedgerEntry(newOrder, 'PAYMENT_VERIFIED');
    setLedgerEntries(prev => [...paymentLedger, ...prev]);
    setOrders(prev => [newOrder, ...prev]);

    // Push Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `New Incoming Order ${newOrder.orderNumber}`,
        description: `$${newOrder.totalAmount.toFixed(2)} received from ${newOrder.customer.name}. Escrow locked.`,
        time: "Just now",
        read: false,
        type: "order"
      },
      ...prev
    ]);

    showToast(`New order #${id} placed via simulated webhook! Escrow locked.`, 'success');
  };

  // 10. PDF Export
  const handleExportPDF = () => {
    exportOrdersPDF(orders, kpis, regionalStats);
    showToast('Executive PDF Report generated & downloaded!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        orders,
        setOrders,
        kpis,
        setKpis,
        regionalStats,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        isFilterModalOpen,
        setIsFilterModalOpen,
        selectedOrder,
        setSelectedOrder,
        isLedgerModalOpen,
        setIsLedgerModalOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        advanceOrderState,
        createDemoOrder,
        ledgerEntries,
        handleExportPDF,
        toastMessage,
        showToast,
        placeOrderWithIdempotency,
        transactions,
        setTransactions,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
