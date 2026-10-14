/**
 * SMILE FOOD - System Mock Data
 * Realistic production-ready data for orders, regional stats, users, and messages.
 */

export const INITIAL_KPIS = {
  monthlyDelivery: {
    value: "857 orders",
    rawCount: 857,
    trend: "-4.2%",
    isPositive: false,
    subtitle: "vs last month"
  },
  monthlyWorkHours: {
    value: "158 hours",
    rawHours: 158,
    trend: "+12.5%",
    isPositive: true,
    subtitle: "vs last month"
  },
  earnedFunds: {
    value: "$1.5k",
    rawAmount: 1542.80,
    trend: "+18.3%",
    isPositive: true,
    subtitle: "net platform profit"
  }
};

export const REGIONAL_STATISTICS = [
  { name: "Central area", value: 52, orders: 445, color: "#079B48" },
  { name: "South-Western area", value: 15, orders: 129, color: "#D5F28A" },
  { name: "Eastern area", value: 33, orders: 283, color: "#F28C00" }
];

export const INITIAL_ORDERS = [
  {
    id: "SF-89241",
    orderNumber: "#SF-89241",
    customer: {
      name: "Sophia Martinez",
      phone: "+1 (555) 234-8901",
      address: "742 Evergreen Terrace, Central District"
    },
    restaurant: {
      name: "Golden Wok Delights",
      address: "12 King St, Central"
    },
    items: [
      { name: "Szechuan Crispy Beef", qty: 2, price: 18.50 },
      { name: "Steamed Jasmine Rice", qty: 2, price: 4.00 },
      { name: "Spring Rolls (4pcs)", qty: 1, price: 7.50 }
    ],
    foodSubtotal: 52.50,
    deliveryFee: 6.50,
    serviceFee: 2.50,
    totalAmount: 61.50,
    split: {
      vendor: 44.62,
      rider: 5.52,
      platform: 11.36
    },
    status: "Completed",
    stateMachineStep: "Delivered",
    escrowStatus: "RELEASED",
    region: "Central area",
    timestamp: "2026-10-12 21:45",
    paymentMethod: "Apple Pay (Stripe)",
    paymentRef: "tx_live_89241_sec"
  },
  {
    id: "SF-89240",
    orderNumber: "#SF-89240",
    customer: {
      name: "Marcus Vance",
      phone: "+1 (555) 345-6712",
      address: "18 Pine Ridge Blvd, South-Western"
    },
    restaurant: {
      name: "Luigi's Woodfire Pizza",
      address: "88 Olive Way, South-Western"
    },
    items: [
      { name: "Truffle Prosciutto Pizza", qty: 1, price: 24.00 },
      { name: "Garlic Butter Focaccia", qty: 1, price: 8.50 },
      { name: "San Pellegrino Limonata", qty: 2, price: 4.50 }
    ],
    foodSubtotal: 41.50,
    deliveryFee: 7.00,
    serviceFee: 2.00,
    totalAmount: 50.50,
    split: {
      vendor: 35.27,
      rider: 5.95,
      platform: 9.28
    },
    status: "Pending",
    stateMachineStep: "Dispatched",
    escrowStatus: "LOCKED",
    region: "South-Western area",
    timestamp: "2026-10-12 22:15",
    paymentMethod: "Visa Card (Paystack)",
    paymentRef: "tx_live_89240_pst"
  },
  {
    id: "SF-89239",
    orderNumber: "#SF-89239",
    customer: {
      name: "Liam O'Connor",
      phone: "+1 (555) 789-1234",
      address: "402 Marina Bay Quay, Eastern"
    },
    restaurant: {
      name: "Burger & Brioche Co.",
      address: "201 Waterfront Rd, Eastern"
    },
    items: [
      { name: "Double Wagyu Smash", qty: 2, price: 16.00 },
      { name: "Loaded Truffle Fries", qty: 1, price: 9.00 }
    ],
    foodSubtotal: 41.00,
    deliveryFee: 5.50,
    serviceFee: 2.00,
    totalAmount: 48.50,
    split: {
      vendor: 34.85,
      rider: 4.67,
      platform: 8.98
    },
    status: "Pending",
    stateMachineStep: "Preparing",
    escrowStatus: "LOCKED",
    region: "Eastern area",
    timestamp: "2026-10-12 22:40",
    paymentMethod: "Mastercard",
    paymentRef: "tx_live_89239_mst"
  },
  {
    id: "SF-89238",
    orderNumber: "#SF-89238",
    customer: {
      name: "Amara Chen",
      phone: "+1 (555) 901-4455",
      address: "128 University Ave, Central"
    },
    restaurant: {
      name: "Tokyo Ramen House",
      address: "5 Sakura Lane, Central"
    },
    items: [
      { name: "Spicy Tonkotsu Ramen", qty: 1, price: 17.50 },
      { name: "Pan-Fried Gyoza (6pcs)", qty: 1, price: 8.00 }
    ],
    foodSubtotal: 25.50,
    deliveryFee: 4.50,
    serviceFee: 1.50,
    totalAmount: 31.50,
    split: {
      vendor: 21.67,
      rider: 3.82,
      platform: 6.01
    },
    status: "Completed",
    stateMachineStep: "Delivered",
    escrowStatus: "RELEASED",
    region: "Central area",
    timestamp: "2026-10-12 20:30",
    paymentMethod: "Google Pay",
    paymentRef: "tx_live_89238_gpy"
  },
  {
    id: "SF-89237",
    orderNumber: "#SF-89237",
    customer: {
      name: "Ethan Wright",
      phone: "+1 (555) 123-9988",
      address: "9 Ocean Vista Heights, Eastern"
    },
    restaurant: {
      name: "Coastal Crab Shack",
      address: "1 Harbor View, Eastern"
    },
    items: [
      { name: "Maine Lobster Roll", qty: 2, price: 28.00 },
      { name: "New England Clam Chowder", qty: 1, price: 11.00 }
    ],
    foodSubtotal: 67.00,
    deliveryFee: 8.00,
    serviceFee: 3.00,
    totalAmount: 78.00,
    split: {
      vendor: 56.95,
      rider: 6.80,
      platform: 14.25
    },
    status: "Failed",
    stateMachineStep: "Cancelled",
    escrowStatus: "REFUNDED",
    region: "Eastern area",
    timestamp: "2026-10-12 19:15",
    paymentMethod: "Credit Card (Failed 3D Secure)",
    paymentRef: "tx_live_89237_fail"
  },
  {
    id: "SF-89236",
    orderNumber: "#SF-89236",
    customer: {
      name: "Zara Patel",
      phone: "+1 (555) 678-3321",
      address: "33 Botanical Garden Road, Central"
    },
    restaurant: {
      name: "Spice Symphony Indian",
      address: "44 Curry Row, Central"
    },
    items: [
      { name: "Butter Chicken & Naan", qty: 2, price: 19.00 },
      { name: "Vegetable Biryani", qty: 1, price: 15.00 },
      { name: "Mango Lassi", qty: 2, price: 4.50 }
    ],
    foodSubtotal: 62.00,
    deliveryFee: 6.00,
    serviceFee: 2.50,
    totalAmount: 70.50,
    split: {
      vendor: 52.70,
      rider: 5.10,
      platform: 12.70
    },
    status: "Completed",
    stateMachineStep: "Delivered",
    escrowStatus: "RELEASED",
    region: "Central area",
    timestamp: "2026-10-12 18:50",
    paymentMethod: "Apple Pay",
    paymentRef: "tx_live_89236_apl"
  },
  {
    id: "SF-89235",
    orderNumber: "#SF-89235",
    customer: {
      name: "David Kim",
      phone: "+1 (555) 456-2211",
      address: "51 Highland Terrace, South-Western"
    },
    restaurant: {
      name: "Seoul Garden BBQ",
      address: "10 K-Town Mall, South-Western"
    },
    items: [
      { name: "Bulgogi Beef Bento", qty: 2, price: 21.00 },
      { name: "Crispy Kimchi Pancakes", qty: 1, price: 12.00 }
    ],
    foodSubtotal: 54.00,
    deliveryFee: 7.50,
    serviceFee: 2.50,
    totalAmount: 64.00,
    split: {
      vendor: 45.90,
      rider: 6.37,
      platform: 11.73
    },
    status: "Pending",
    stateMachineStep: "Accepted",
    escrowStatus: "LOCKED",
    region: "South-Western area",
    timestamp: "2026-10-12 22:50",
    paymentMethod: "Visa Card",
    paymentRef: "tx_live_89235_vsa"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Order #SF-89241 Placed",
    description: "Golden Wok Delights received order for $61.50. Escrow locked.",
    time: "5m ago",
    read: false,
    type: "order"
  },
  {
    id: "notif-2",
    title: "Escrow Split Released",
    description: "Order #SF-89238 marked delivered. $21.67 sent to vendor, $3.82 to rider.",
    time: "45m ago",
    read: false,
    type: "payment"
  },
  {
    id: "notif-3",
    title: "Payment Gateway Health Check",
    description: "Paystack & Stripe webhooks responding at 99.98% SLA.",
    time: "2h ago",
    read: true,
    type: "system"
  }
];

export const CONTACT_CHATS = [
  {
    id: "chat-1",
    name: "Rider Tunde (Honda CB125)",
    role: "Active Rider",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    online: true,
    lastMessage: "I've picked up #SF-89240 from Luigi's. Arriving in 8 mins.",
    lastTime: "22:20",
    unread: 2,
    orderId: "#SF-89240",
    messages: [
      { id: "m1", sender: "rider", text: "Hello Mike! I'm outside Luigi's Pizza waiting for the box.", time: "22:16" },
      { id: "m2", sender: "mike", text: "Got it Tunde, keep us posted once confirmed.", time: "22:17" },
      { id: "m3", sender: "rider", text: "I've picked up #SF-89240 from Luigi's. Arriving in 8 mins.", time: "22:20" }
    ]
  },
  {
    id: "chat-2",
    name: "Luigi's Woodfire Pizza",
    role: "Vendor Partner",
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop",
    online: true,
    lastMessage: "Order #SF-89240 is packed and handed over to driver.",
    lastTime: "22:19",
    unread: 0,
    orderId: "#SF-89240",
    messages: [
      { id: "m4", sender: "vendor", text: "Good evening Mike! Pizza is in the wood oven.", time: "22:12" },
      { id: "m5", sender: "vendor", text: "Order #SF-89240 is packed and handed over to driver.", time: "22:19" }
    ]
  },
  {
    id: "chat-3",
    name: "Sophia Martinez",
    role: "Customer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    online: false,
    lastMessage: "Thank you so much! Food was steaming hot and delicious.",
    lastTime: "21:55",
    unread: 0,
    orderId: "#SF-89241",
    messages: [
      { id: "m6", sender: "customer", text: "Driver arrived right on time. Thank you so much! Food was steaming hot and delicious.", time: "21:55" },
      { id: "m7", sender: "mike", text: "Delighted to hear that, Sophia! Have a wonderful dinner.", time: "21:56" }
    ]
  }
];

export const HOURLY_ORDER_TREND = [
  { time: "12 PM", orders: 42, revenue: 1420 },
  { time: "2 PM", orders: 28, revenue: 980 },
  { time: "4 PM", orders: 35, revenue: 1190 },
  { time: "6 PM", orders: 94, revenue: 3290 },
  { time: "7 PM", orders: 142, revenue: 4970 },
  { time: "8 PM", orders: 178, revenue: 6230 },
  { time: "9 PM", orders: 135, revenue: 4725 },
  { time: "10 PM", orders: 86, revenue: 3010 }
];

export const FAQS = [
  {
    q: "How does the SMILE FOOD split-payout escrow work?",
    a: "When a customer initiates an order, payment is secured in an ACID-compliant ESCROW_HOLDING ledger account. Upon successful delivery confirmed by the rider and customer, the funds are automatically split: Vendor receives 85% of food total, Rider receives 85% of delivery fee + tips, and the remaining balances settle into SMILE FOOD Platform Revenue."
  },
  {
    q: "What is the complete Order State Machine cycle?",
    a: "Orders transition sequentially through: Created → Pending_Confirmation → Accepted → Preparing → Ready_For_Pickup → Dispatched → Delivered. If an issue occurs, the order is cancelled and funds are immediately reversed through the escrow ledger."
  },
  {
    q: "How do I trigger an emergency refund or cancel an order?",
    a: "From the Orders tab or Overview table, click 'View Details' on any order and select 'Cancel & Refund Escrow'. You must specify an operational reason (e.g. kitchen outage, rider puncture). The double-entry ledger will post balanced debit/credit reversals."
  },
  {
    q: "Can I export real-time accounting and delivery reports?",
    a: "Yes! Use the 'Export PDF' button on the dashboard toolbar. It generates a high-definition PDF summary incorporating current period KPIs, regional distribution, and the complete transaction ledger."
  }
];
