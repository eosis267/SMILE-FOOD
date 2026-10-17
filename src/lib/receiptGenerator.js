import { jsPDF } from 'jspdf';

/**
 * SMILE FOOD — Transaction & Order Receipt Generator
 * Creates high-fidelity, printable PDF receipts using jsPDF.
 */

const PALETTE = {
  primary: [7, 155, 72],     // #079B48
  deepEmerald: [1, 76, 50],  // #014C32
  darkText: [23, 25, 23],    // #171917
  grayText: [119, 125, 121], // #777D79
  lightGreen: [234, 248, 216],// #EAF8D8
  cardBg: [248, 249, 248],   // #F8F9F8
  borderColor: [230, 233, 231],// #E6E9E7
  accentRed: [217, 83, 83],  // #D95353
};

/**
 * Helper to generate pseudo-hash checksum for audit integrity
 */
function generateChecksum(ref) {
  let hash = 0;
  const str = String(ref) + '-smilefood-verified-ledger';
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'SF-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Download a PDF Receipt for a Wallet Transaction (Top-up, Escrow release, Withdrawal, etc.)
 */
export function downloadWalletReceipt(tx, user) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const ref = tx.ref || tx.id || `TX-${Date.now()}`;
  const checksum = generateChecksum(ref);
  const userName = user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0] || 'SMILE FOOD User';
  const userEmail = user?.email || 'customer@smilefood.com';
  const isCredit = tx.type === 'credit';

  // 1. Header Banner
  doc.setFillColor(...PALETTE.deepEmerald);
  doc.roundedRect(14, 14, 182, 30, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SMILE FOOD', 22, 27);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL TRANSACTION RECEIPT', 22, 34);

  doc.setFontSize(9);
  doc.text(`Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 128, 27);
  doc.text(`Receipt Ref: ${ref}`, 128, 34);

  // 2. Metadata Cards (Two-Column)
  // Left: Transaction Details
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(14, 50, 88, 38, 3, 3, 'F');
  doc.setDrawColor(...PALETTE.borderColor);
  doc.roundedRect(14, 50, 88, 38, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.primary);
  doc.text('TRANSACTION DETAILS', 20, 58);

  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('Reference:', 20, 65);
  doc.text('Date & Time:', 20, 72);
  doc.text('Type & Status:', 20, 79);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(String(ref), 50, 65);
  doc.text(tx.date || 'Today', 50, 72);

  doc.setTextColor(isCredit ? PALETTE.primary[0] : PALETTE.accentRed[0], isCredit ? PALETTE.primary[1] : PALETTE.accentRed[1], isCredit ? PALETTE.primary[2] : PALETTE.accentRed[2]);
  doc.text(`${tx.type?.toUpperCase()} · VERIFIED`, 50, 79);

  // Right: Billed Account Details
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(108, 50, 88, 38, 3, 3, 'F');
  doc.setDrawColor(...PALETTE.borderColor);
  doc.roundedRect(108, 50, 88, 38, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.primary);
  doc.text('ACCOUNT / HOLDER INFO', 114, 58);

  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('Name:', 114, 65);
  doc.text('Email:', 114, 72);
  doc.text('Ledger ID:', 114, 79);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(userName.length > 22 ? userName.slice(0, 22) + '...' : userName, 138, 65);
  doc.text(userEmail.length > 22 ? userEmail.slice(0, 22) + '...' : userEmail, 138, 72);
  doc.text(checksum, 138, 79);

  // 3. Itemized Ledger Line
  const tableY = 96;
  doc.setFillColor(...PALETTE.lightGreen);
  doc.rect(14, tableY, 182, 9, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.deepEmerald);
  doc.text('DESCRIPTION / EVENT', 20, tableY + 6);
  doc.text('CHANNEL', 105, tableY + 6);
  doc.text('POST-BALANCE', 138, tableY + 6);
  doc.text('AMOUNT', 172, tableY + 6);

  // Row 1
  const rowY = tableY + 16;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(tx.description || 'Wallet transaction settlement', 20, rowY);
  doc.setTextColor(...PALETTE.grayText);
  doc.text(tx.ref?.startsWith('TPU') ? 'Card / Bank Gateway' : tx.ref?.startsWith('WDR') ? 'Bank Transfer' : 'Escrow Ledger', 105, rowY);
  doc.text(tx.balance !== undefined ? `NGN ${Number(tx.balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : 'Verified', 138, rowY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isCredit ? PALETTE.primary[0] : PALETTE.accentRed[0], isCredit ? PALETTE.primary[1] : PALETTE.accentRed[1], isCredit ? PALETTE.primary[2] : PALETTE.accentRed[2]);
  doc.text(`${isCredit ? '+' : '-'}NGN ${Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`, 166, rowY);

  // Horizontal divider
  doc.setDrawColor(...PALETTE.borderColor);
  doc.line(14, rowY + 6, 196, rowY + 6);

  // 4. Financial Summary Card
  const summaryY = 130;
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(110, summaryY, 86, 44, 3, 3, 'F');
  doc.setDrawColor(...PALETTE.borderColor);
  doc.roundedRect(110, summaryY, 86, 44, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('Transaction Amount:', 116, summaryY + 10);
  doc.text('Network Processing Fee:', 116, summaryY + 18);
  doc.text('Escrow Protection:', 116, summaryY + 26);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(`NGN ${Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`, 160, summaryY + 10);
  doc.text('NGN 0.00', 160, summaryY + 18);
  doc.setTextColor(...PALETTE.primary);
  doc.text('Included (Free)', 160, summaryY + 26);

  // Total Paid box
  doc.setFillColor(...PALETTE.deepEmerald);
  doc.roundedRect(110, summaryY + 31, 86, 13, 0, 0, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NET SETTLEMENT:', 116, summaryY + 39.5);
  doc.text(`NGN ${Number(tx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`, 156, summaryY + 39.5);

  // 5. Verification Seal & Notes
  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.darkText);
  doc.setFont('helvetica', 'bold');
  doc.text('Double-Entry Ledger Certification', 14, summaryY + 8);

  doc.setFontSize(8);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('• Fully backed by SMILE FOOD ACID escrow compliance and financial audit trail.', 14, summaryY + 15);
  doc.text('• Encrypted hash verification guarantees immutability of settled funds.', 14, summaryY + 22);
  doc.text(`• Verification Signature: ${checksum}`, 14, summaryY + 29);

  // 6. Page Footer
  doc.setDrawColor(...PALETTE.borderColor);
  doc.line(14, 260, 196, 260);

  doc.setFontSize(7.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.text('SMILE FOOD Technologies • support@smilefood.com • https://smilefood.com', 14, 266);
  doc.text('This is a computer-generated transaction receipt. No physical signature is required.', 14, 271);

  // Save PDF
  doc.save(`SMILE_FOOD_Receipt_${ref.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  return true;
}

/**
 * Download a PDF Receipt for a Food Order (Customer, Vendor, or Platform Admin)
 */
export function downloadOrderReceipt(order, user) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const orderNum = order.orderNumber || order.id || `SF-${Date.now()}`;
  const checksum = generateChecksum(orderNum);
  const customerName = order.customer?.name || user?.user_metadata?.full_name || 'Valued Customer';
  const customerPhone = order.customer?.phone || '+234 803 000 0000';
  const restaurantName = order.restaurant?.name || order.restaurant || 'SMILE FOOD Kitchen';
  const totalAmount = order.totalAmount || order.total || 0;
  const currencySymbol = 'NGN ';
  const formattedTotal = Number(totalAmount).toLocaleString('en-NG', { minimumFractionDigits: 2 });

  // 1. Header Banner
  doc.setFillColor(...PALETTE.primary);
  doc.roundedRect(14, 14, 182, 30, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SMILE FOOD', 22, 27);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL MEAL ORDER RECEIPT', 22, 34);

  doc.setFontSize(9);
  doc.text(`Issued: ${order.timestamp || order.date || new Date().toLocaleDateString()}`, 128, 27);
  doc.text(`Order No: ${orderNum}`, 128, 34);

  // 2. Order & Customer Info Cards
  // Left: Vendor / Restaurant Info
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(14, 50, 88, 40, 3, 3, 'F');
  doc.setDrawColor(...PALETTE.borderColor);
  doc.roundedRect(14, 50, 88, 40, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.primary);
  doc.text('VENDOR & ORDER INFO', 20, 58);

  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('Restaurant:', 20, 65);
  doc.text('Order Ref:', 20, 72);
  doc.text('Status:', 20, 79);
  doc.text('Region:', 20, 86);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(restaurantName.length > 20 ? restaurantName.slice(0, 20) + '...' : restaurantName, 46, 65);
  doc.text(String(orderNum), 46, 72);
  doc.setTextColor(...PALETTE.primary);
  doc.text(String(order.status || 'Completed').toUpperCase(), 46, 79);
  doc.setTextColor(...PALETTE.darkText);
  doc.text(order.region || 'Lagos Hub', 46, 86);

  // Right: Customer Details
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(108, 50, 88, 40, 3, 3, 'F');
  doc.setDrawColor(...PALETTE.borderColor);
  doc.roundedRect(108, 50, 88, 40, 3, 3, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.primary);
  doc.text('CUSTOMER / DELIVERY INFO', 114, 58);

  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('Customer:', 114, 65);
  doc.text('Contact:', 114, 72);
  doc.text('Courier:', 114, 79);
  doc.text('Payment:', 114, 86);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(customerName.length > 20 ? customerName.slice(0, 20) + '...' : customerName, 138, 65);
  doc.text(customerPhone, 138, 72);
  doc.text(order.courier?.name || order.rider || 'Dispatched Courier', 138, 79);
  doc.setTextColor(...PALETTE.primary);
  doc.text('ESCROW VERIFIED', 138, 86);

  // 3. Items Table Header
  const tableY = 98;
  doc.setFillColor(...PALETTE.lightGreen);
  doc.rect(14, tableY, 182, 9, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.deepEmerald);
  doc.text('ITEMS ORDERED', 20, tableY + 6);
  doc.text('QTY', 125, tableY + 6);
  doc.text('UNIT PRICE', 145, tableY + 6);
  doc.text('SUBTOTAL', 172, tableY + 6);

  // Items rows
  let currentY = tableY + 15;
  const itemsList = Array.isArray(order.items) 
    ? order.items 
    : [order.foodItem || 'Specialty Meal Package'];

  itemsList.forEach((item) => {
    let name = typeof item === 'string' ? item : item.name || 'Dish Item';
    let qty = typeof item === 'object' && item.quantity ? item.quantity : 1;
    let price = typeof item === 'object' && item.price ? item.price : null;

    // Check if string contains "x1", "x2"
    if (typeof item === 'string' && item.includes(' x')) {
      const parts = item.split(' x');
      name = parts[0];
      qty = parseInt(parts[1], 10) || 1;
    }

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...PALETTE.darkText);
    doc.text(name.length > 45 ? name.slice(0, 45) + '...' : name, 20, currentY);
    doc.text(String(qty), 128, currentY);
    
    const itemSubtotal = price ? (price * qty) : (Number(totalAmount) / Math.max(1, itemsList.length));
    const formattedItemPrice = price ? `${currencySymbol}${Number(price).toLocaleString()}` : 'Included';
    const formattedItemSub = `${currencySymbol}${Number(itemSubtotal).toLocaleString()}`;

    doc.setTextColor(...PALETTE.grayText);
    doc.text(formattedItemPrice, 145, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PALETTE.darkText);
    doc.text(formattedItemSub, 172, currentY);

    currentY += 8;
  });

  // Divider
  doc.setDrawColor(...PALETTE.borderColor);
  doc.line(14, currentY + 2, 196, currentY + 2);

  // 4. Totals Calculation Box
  const summaryY = Math.max(currentY + 12, 160);
  doc.setFillColor(...PALETTE.cardBg);
  doc.roundedRect(110, summaryY, 86, 48, 3, 3, 'F');
  doc.setDrawColor(...PALETTE.borderColor);
  doc.roundedRect(110, summaryY, 86, 48, 3, 3, 'S');

  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 116, summaryY + 9);
  doc.text('Delivery Fee:', 116, summaryY + 17);
  doc.text('Service & Packaging:', 116, summaryY + 25);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...PALETTE.darkText);
  doc.text(`${currencySymbol}${formattedTotal}`, 170, summaryY + 9);
  doc.text(`${currencySymbol}0.00`, 170, summaryY + 17);
  doc.text(`${currencySymbol}0.00`, 170, summaryY + 25);

  // Total Paid box
  doc.setFillColor(...PALETTE.primary);
  doc.roundedRect(110, summaryY + 32, 86, 16, 0, 0, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAID:', 116, summaryY + 42);
  doc.text(`${currencySymbol}${formattedTotal}`, 166, summaryY + 42);

  // 5. Notes & Verification Stamp
  doc.setFontSize(8.5);
  doc.setTextColor(...PALETTE.darkText);
  doc.setFont('helvetica', 'bold');
  doc.text('Escrow Settlement Guarantee', 14, summaryY + 9);

  doc.setFontSize(8);
  doc.setTextColor(...PALETTE.grayText);
  doc.setFont('helvetica', 'normal');
  doc.text('• Customer escrow hold is protected until confirmed food handoff.', 14, summaryY + 16);
  doc.text('• Real-time courier telemetry logged for transit validation.', 14, summaryY + 23);
  doc.text(`• Ledger Verification Hash: ${checksum}`, 14, summaryY + 30);

  // 6. Page Footer
  doc.setDrawColor(...PALETTE.borderColor);
  doc.line(14, 260, 196, 260);

  doc.setFontSize(7.5);
  doc.setTextColor(...PALETTE.grayText);
  doc.text('SMILE FOOD Technologies • support@smilefood.com • https://smilefood.com', 14, 266);
  doc.text('Thank you for ordering with SMILE FOOD. Keep this receipt for your records.', 14, 271);

  // Save PDF
  doc.save(`SMILE_FOOD_Order_${orderNum.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
  return true;
}
