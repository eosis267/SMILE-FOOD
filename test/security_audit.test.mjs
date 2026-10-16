/**
 * SMILE FOOD — Full-Stack Security Audit & Verification Test Suite
 * Tests:
 * 1. Mass-Assignment & Privilege Escalation Prevention
 * 2. Sensitive Data Masking (Bank accounts, cards, phones)
 * 3. Cart Validation & Price Tampering Defense
 * 4. API Response Minimization (Customer, Vendor, Rider DTOs)
 * 5. Error Sanitization & Information Disclosure Defense
 */

import assert from 'node:assert';
import { 
  validateProfileUpdate, 
  maskAccountNumber, 
  maskCardNumber, 
  maskPhoneNumber, 
  maskEmail,
  validateCartOrder,
  sanitizeUserProfile,
  sanitizeOrderResponse,
  sanitizeErrorResponse
} from '../src/lib/apiSecurity.js';

let passed = 0;
let failed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n--- 1. Profile Mass-Assignment & Privilege Escalation Tests ---');

test('Blocks unauthorized role elevation (role: "admin")', () => {
  const result = validateProfileUpdate({ role: 'admin', fullName: 'Attacker' });
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("Modifying system-controlled field 'role' is strictly forbidden"));
});

test('Blocks wallet balance tampering (wallet_balance: 999999)', () => {
  const result = validateProfileUpdate({ wallet_balance: 999999 });
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("wallet_balance"));
});

test('Blocks profile ID alteration (id: "spoofed_id")', () => {
  const result = validateProfileUpdate({ id: 'spoofed_id' });
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("id"));
});

test('Rejects empty or too-short full name', () => {
  const result = validateProfileUpdate({ fullName: 'A' });
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes('at least 2 characters'));
});

test('Rejects invalid phone number format', () => {
  const result = validateProfileUpdate({ phone: 'bad-phone-number-abc' });
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes('valid phone number'));
});

test('Accepts valid allowed profile update fields', () => {
  const result = validateProfileUpdate({ 
    fullName: 'Adeola Williams', 
    phone: '+234 803 123 4567',
    businessName: 'Lagos Island Station Hub' 
  });
  assert.strictEqual(result.valid, true);
});

console.log('\n--- 2. Sensitive Data Masking Tests ---');

test('Masks bank account number, preserving only last 4 digits', () => {
  const masked = maskAccountNumber('928144028912');
  assert.strictEqual(masked, '•••• •••• •••• 8912');
});

test('Masks credit card number, preserving only last 4 digits', () => {
  const masked = maskCardNumber('4242424242424242');
  assert.strictEqual(masked, '•••• •••• •••• 4242');
});

test('Masks phone number, protecting middle digits', () => {
  const masked = maskPhoneNumber('+234 803 123 4567');
  assert.ok(masked.includes('••••') || masked.includes('•••'));
  assert.ok(!masked.includes('123'));
});

test('Masks email address username', () => {
  const masked = maskEmail('mike.ops@smilefood.com');
  assert.ok(masked.includes('@smilefood.com'));
  assert.ok(masked.includes('*'));
  assert.ok(!masked.includes('mike.ops'));
});

console.log('\n--- 3. Cart & Order Validation (Price Tampering Defense) ---');

test('Prevents client-side price tampering by enforcing canonical catalogue price', () => {
  // Client attempts to pay $0.01 for a $14.50 meal
  const tamperedCart = [
    {
      id: 'ng-1', // Special Smokey Party Jollof (canonical $14.50)
      name: 'Special Smokey Party Jollof Rice',
      price: 0.01, // TAMPERED!
      quantity: 2,
    }
  ];

  const validation = validateCartOrder({
    cartItems: tamperedCart,
    paymentMethod: 'card',
    deliveryAddress: '14 Adeola Odeku St, Victoria Island',
  });

  assert.strictEqual(validation.valid, true);
  // Canonical price of 14.50 must be enforced: 14.50 * 2 = 29.00
  assert.strictEqual(validation.order.foodSubtotal, 29.00);
  assert.strictEqual(validation.order.totalAmount, 35.50); // 29.00 + 4.50 delivery + 2.00 service
});

test('Rejects order with invalid or non-positive quantity', () => {
  const badCart = [
    { id: 'ng-1', name: 'Jollof', price: 14.50, quantity: -5 }
  ];
  const validation = validateCartOrder({
    cartItems: badCart,
    deliveryAddress: '14 Adeola Odeku St, Victoria Island',
  });
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.error.includes('Invalid quantity'));
});

test('Rejects order when wallet balance is insufficient', () => {
  const cart = [
    { id: 'ng-1', name: 'Jollof', price: 14.50, quantity: 2 }
  ];
  const validation = validateCartOrder({
    cartItems: cart,
    paymentMethod: 'wallet',
    walletBalance: 10.00, // Grand total is $35.50
    deliveryAddress: '14 Adeola Odeku St, Victoria Island',
  });
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.error.includes('Insufficient wallet balance'));
});

test('Rejects order with missing or blank delivery address', () => {
  const cart = [{ id: 'ng-1', name: 'Jollof', price: 14.50, quantity: 1 }];
  const validation = validateCartOrder({
    cartItems: cart,
    deliveryAddress: '   ',
  });
  assert.strictEqual(validation.valid, false);
  assert.ok(validation.error.includes('delivery destination address is required'));
});

console.log('\n--- 4. Backend API Response Minimization Tests ---');

test('Customer Order DTO minimizes response and excludes vendor/courier profit splits', () => {
  const fullOrder = {
    id: 'SF-88201',
    orderNumber: '#SF-88201',
    status: 'Pending',
    stateMachineStep: 'Preparing',
    foodSubtotal: 40.00,
    deliveryFee: 4.50,
    serviceFee: 2.00,
    totalAmount: 46.50,
    items: [{ name: 'Jollof', qty: 2, price: 20.00 }],
    split: { vendor: 34.00, rider: 3.82, platform: 8.68 },
    customer: { name: 'Adeola Williams', address: '14 Adeola Odeku St', phone: '+234 803 123 4567' },
    paymentMethod: 'Stripe Card',
    internalSecretKey: 'sec_live_priv_key_9999',
  };

  const customerDTO = sanitizeOrderResponse(fullOrder, 'customer');
  assert.strictEqual(customerDTO.id, 'SF-88201');
  assert.strictEqual(customerDTO.totalAmount, 46.50);
  assert.strictEqual(customerDTO.split, undefined); // Wholesale splits excluded
  assert.strictEqual(customerDTO.internalSecretKey, undefined); // Secrets excluded
});

test('Vendor Order DTO minimizes response and excludes customer home address & courier cuts', () => {
  const fullOrder = {
    id: 'SF-88201',
    orderNumber: '#SF-88201',
    status: 'Pending',
    stateMachineStep: 'Preparing',
    foodSubtotal: 40.00,
    deliveryFee: 4.50,
    totalAmount: 46.50,
    items: [{ name: 'Jollof', qty: 2 }],
    split: { vendor: 34.00, rider: 3.82, platform: 8.68 },
    customer: { name: 'Adeola Williams', address: 'Private House 12, Floor 4, Suite 10', phone: '+234 803 123 4567' },
  };

  const vendorDTO = sanitizeOrderResponse(fullOrder, 'vendor');
  assert.strictEqual(vendorDTO.customerFirstName, 'Adeola');
  assert.strictEqual(vendorDTO.address, undefined); // Home address excluded
  assert.strictEqual(vendorDTO.split, undefined);
  assert.strictEqual(vendorDTO.vendorPayout, 34.00); // Vendor only sees their payout
});

test('Rider Order DTO masks customer phone and excludes wholesale margins', () => {
  const fullOrder = {
    id: 'SF-88201',
    orderNumber: '#SF-88201',
    status: 'Dispatched',
    stateMachineStep: 'Dispatched',
    items: [{ name: 'Jollof', qty: 2, wholesaleCost: 10.00 }],
    split: { vendor: 34.00, rider: 3.82, platform: 8.68 },
    customer: { name: 'Adeola Williams', address: '14 Adeola Odeku St', phone: '+234 803 123 4567' },
    restaurant: { name: 'Mama Cass', address: 'VI Center' },
  };

  const riderDTO = sanitizeOrderResponse(fullOrder, 'rider');
  assert.strictEqual(riderDTO.deliveryAddress, '14 Adeola Odeku St');
  assert.ok(riderDTO.customerPhoneMasked.includes('•••'));
  assert.strictEqual(riderDTO.split, undefined);
  assert.strictEqual(riderDTO.riderPayout, 3.82);
});

console.log('\n--- 5. Error Sanitization & Information Disclosure Tests ---');

test('Sanitizes PostgreSQL relation/table disclosure error', () => {
  const rawError = new Error('relation "public.profiles" does not exist in schema at character 15');
  const sanitized = sanitizeErrorResponse(rawError);
  assert.ok(!sanitized.includes('relation'));
  assert.ok(!sanitized.includes('profiles'));
  assert.ok(!sanitized.includes('schema'));
});

test('Sanitizes database duplicate key error', () => {
  const rawError = new Error('duplicate key value violates unique constraint "profiles_pkey"');
  const sanitized = sanitizeErrorResponse(rawError);
  assert.strictEqual(sanitized, 'A record with this identifier already exists in the system.');
});

test('Sanitizes internal server stack trace disclosures', () => {
  const rawError = new Error('Internal error at server/routes/orders.js:142:15');
  const sanitized = sanitizeErrorResponse(rawError);
  assert.ok(!sanitized.includes('routes/orders.js'));
  assert.ok(sanitized.includes('internal service error'));
});

console.log(`\n========================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
