import { jsPDF } from 'jspdf';
import { brand, contact } from '../data/site.js';

/**
 * Converts a numeric amount to Indian currency words.
 * Example: 3000 -> "Three Thousand", 15500 -> "Fifteen Thousand Five Hundred"
 */
export function numberToIndianWords(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return 'Zero';

  const single = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return single[n];
    return `${tens[Math.floor(n / 10)]} ${single[n % 10]}`.trim();
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) {
      res += `${single[hundred]} Hundred`;
    }
    if (rest > 0) {
      res += (res ? ' and ' : '') + convertTwoDigits(rest);
    }
    return res.trim();
  }

  const crores = Math.floor(num / 10000000);
  let rem = num % 10000000;
  const lakhs = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousands = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundreds = rem;

  const parts = [];
  if (crores > 0) parts.push(`${convertTwoDigits(crores)} Crore`);
  if (lakhs > 0) parts.push(`${convertTwoDigits(lakhs)} Lakh`);
  if (thousands > 0) parts.push(`${convertTwoDigits(thousands)} Thousand`);
  if (hundreds > 0) parts.push(convertThreeDigits(hundreds));

  return parts.join(' ').trim();
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) into readable DD-MMM-YYYY
 */
export function formatReceiptDate(dateStr) {
  if (!dateStr) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Converts an image URL into a base64 DataURL using an offscreen canvas
 */
async function loadImageDataUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 480;
        canvas.height = img.naturalHeight || img.height || 412;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn('Canvas conversion failed, returning null', e);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('Image load error for logo:', url);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Generates and downloads an authentic, high-quality Fee Receipt PDF
 *
 * @param {Object} receipt - The fee record to generate the receipt for
 * @param {Object} [studentInfo] - Optional student record (for course, phone, etc.)
 */
export async function downloadFeeReceiptPdf(receipt, studentInfo = {}) {
  if (!receipt) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm x 297mm
  });

  const pw = 210;
  const m = 14;
  const cardW = pw - m * 2; // 182mm
  const cardH = 240; // fills cleanly on single page

  // Try loading institute logo
  let logoDataUrl = null;
  try {
    logoDataUrl = await loadImageDataUrl(brand.logoFull || '/brand/logo-full.png');
  } catch (err) {
    console.warn('Could not load logo image for PDF:', err);
  }

  // 1. Outer Double Border Frame (Certificate / Official Style)
  doc.setDrawColor(15, 23, 42); // slate-900
  doc.setLineWidth(0.8);
  doc.rect(m, m, cardW, cardH);

  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.3);
  doc.rect(m + 1.8, m + 1.8, cardW - 3.6, cardH - 3.6);

  // Decorative corner notches (fine gold/navy detail)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(m + 4, m + 4, m + 10, m + 4);
  doc.line(m + 4, m + 4, m + 4, m + 10);
  doc.line(m + cardW - 4, m + 4, m + cardW - 10, m + 4);
  doc.line(m + cardW - 4, m + 4, m + cardW - 4, m + 10);
  doc.line(m + 4, m + cardH - 4, m + 10, m + cardH - 4);
  doc.line(m + 4, m + cardH - 4, m + 4, m + cardH - 10);
  doc.line(m + cardW - 4, m + cardH - 4, m + cardW - 10, m + cardH - 4);
  doc.line(m + cardW - 4, m + cardH - 4, m + cardW - 4, m + cardH - 10);

  // 2. Top Header with Institute Logo
  let textLeftX = m + 8;
  if (logoDataUrl) {
    // 28mm wide x 24mm high logo
    doc.addImage(logoDataUrl, 'PNG', m + 5, m + 6, 28, 24);
    textLeftX = m + 36;
  }

  // Institute Name & Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SPECIAL LEARNS INSTITUTE', textLeftX, m + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Premier Center for Computer Science, Multimedia & Academic Coaching', textLeftX, m + 16);
  doc.text(`${contact.address.line1}, ${contact.address.line2}, ${contact.address.city} - ${contact.address.postcode}`, textLeftX, m + 20.5);
  doc.text(`Phone: ${contact.phones[0].label}, ${contact.phones[1].label} | Email: ${contact.emails[0].label} | Web: speciallearns.in`, textLeftX, m + 25);

  // 3. Receipt Ribbon Title Banner
  const ribbonY = m + 30;
  doc.setFillColor(15, 23, 42); // Navy slate
  doc.rect(m + 2, ribbonY, cardW - 4, 8.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('OFFICIAL FEE RECEIPT', pw / 2, ribbonY + 5.8, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text('ORIGINAL STUDENT COPY', pw - m - 6, ribbonY + 5.8, { align: 'right' });
  doc.text('GOVT. RECOGNIZED STANDARDS', m + 6, ribbonY + 5.8, { align: 'left' });

  // 4. Student & Receipt Meta Grid Box
  const metaY = ribbonY + 12;
  const metaH = 36;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(m + 4, metaY, cardW - 8, metaH, 2, 2, 'FD');

  const col1X = m + 8;
  const col2X = m + 42;
  const col3X = m + (cardW / 2) + 4;
  const col4X = m + (cardW / 2) + 40;

  const studentName = receipt.studentName || studentInfo.name || 'Student';
  const rollNo = receipt.rollNo || studentInfo.rollNo || 'N/A';
  const course = receipt.course || studentInfo.course || 'Computer Science / Academic Course';
  const phone = studentInfo.phone || 'N/A';
  const receiptNo = receipt.receiptNo || `REC-${new Date().getFullYear()}-001`;
  const paymentDate = formatReceiptDate(receipt.paymentDate);
  const forMonth = receipt.forMonth || 'Current Term';
  const paymentMode = receipt.paymentMode || 'Cash';
  const amount = Number(receipt.amount) || 0;
  const amountWords = numberToIndianWords(amount);

  doc.setFontSize(8.5);

  // Row 1: Receipt No & Student Name
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Receipt No:', col1X, metaY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(receiptNo, col2X, metaY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Student Name:', col3X, metaY + 7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(studentName, col4X, metaY + 7);

  // Row 2: Receipt Date & Roll Number
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Receipt Date:', col1X, metaY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(paymentDate, col2X, metaY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Roll Number:', col3X, metaY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(rollNo, col4X, metaY + 14);

  // Row 3: Fee Month & Course
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Fee Month:', col1X, metaY + 21);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(forMonth, col2X, metaY + 21);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Course Enrolled:', col3X, metaY + 21);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  // Truncate course if very long to fit
  const cleanCourse = course.length > 28 ? `${course.slice(0, 26)}...` : course;
  doc.text(cleanCourse, col4X, metaY + 21);

  // Row 4: Payment Mode & Status
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Payment Mode:', col1X, metaY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(paymentMode, col2X, metaY + 28);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('Status:', col3X, metaY + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('PAID & ACKNOWLEDGED', col4X, metaY + 28);

  // 5. Itemized Fee Table
  const tableY = metaY + metaH + 6;
  const tableW = cardW - 8;
  const tX = m + 4;

  // Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(tX, tableY, tableW, 8.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('S.No', tX + 4, tableY + 5.8);
  doc.text('Particulars & Fee Description', tX + 22, tableY + 5.8);
  doc.text('Billing Period', tX + 110, tableY + 5.8);
  doc.text('Amount (INR)', tX + tableW - 6, tableY + 5.8, { align: 'right' });

  // Table Row 1: Course Fee
  const rowY = tableY + 8.5;
  const rowH = 18;
  doc.setFillColor(255, 255, 255);
  doc.rect(tX, rowY, tableW, rowH, 'FD');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(tX, rowY + rowH, tX + tableW, rowY + rowH);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('01', tX + 5, rowY + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.text(`Tuition & Practical Lab Fee — ${course}`, tX + 22, rowY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const remarksText = receipt.notes ? `Remarks: ${receipt.notes}` : 'Mode: Computerized training, lab access & course materials.';
  doc.text(remarksText, tX + 22, rowY + 12);

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(forMonth, tX + 110, rowY + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Rs. ${amount.toLocaleString('en-IN')}.00`, tX + tableW - 6, rowY + 7.5, { align: 'right' });

  // Total Summary Row
  const totalY = rowY + rowH;
  const totalH = 15;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(tX, totalY, tableW, totalH, 'FD');
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(tX, totalY, tX + tableW, totalY);
  doc.line(tX, totalY + totalH, tX + tableW, totalY + totalH);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Net Amount Received:', tX + 6, totalY + 6.5);

  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105);
  doc.text(`Rs. ${amount.toLocaleString('en-IN')}.00`, tX + tableW - 6, totalY + 6.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Amount in words: Rupees ${amountWords} Only`, tX + 6, totalY + 12);

  // 6. Terms, Authentication Badge & Seal / Signatory
  const footerY = totalY + totalH + 8;

  // Left Side: Terms & Conditions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Terms & Official Conditions:', tX + 2, footerY + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Fees once paid are strictly non-refundable and non-transferable under any condition.', tX + 2, footerY + 7);
  doc.text('2. This is a system-generated authentic computerized receipt issued by Special Learns.', tX + 2, footerY + 11.5);
  doc.text('3. Retain this receipt for certificate issuance, examinations & student portal record.', tX + 2, footerY + 16);
  doc.text('4. In case of any query, contact accounts desk at +91 85271 84745 or info@speciallearns.in.', tX + 2, footerY + 20.5);

  // Verification Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(tX + 2, footerY + 25, 96, 15, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(5, 150, 105);
  doc.text('DIGITALLY AUTHENTICATED BY SPECIAL LEARNS ERP', tX + 5, footerY + 29.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Security Code: SL-REC-${receiptNo.replace(/[^0-9A-Za-z]/g, '')}-${Date.now().toString(36).toUpperCase()}`, tX + 5, footerY + 34);
  doc.text('Verify authenticity online: speciallearns.vercel.app/admin', tX + 5, footerY + 37.8);

  // Right Side: Authentic Circular Stamp / Seal
  const stampCenterX = pw - m - 62;
  const stampCenterY = footerY + 20;

  // Outer circle of stamp
  doc.setDrawColor(4, 120, 87); // Emerald 700
  doc.setLineWidth(0.8);
  doc.circle(stampCenterX, stampCenterY, 15);

  // Inner circle
  doc.setDrawColor(4, 120, 87);
  doc.setLineWidth(0.3);
  doc.circle(stampCenterX, stampCenterY, 12);

  // Stamp text inside
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(4, 120, 87);
  doc.text('SPECIAL LEARNS', stampCenterX, stampCenterY - 7, { align: 'center' });
  doc.text('INSTITUTE', stampCenterX, stampCenterY - 4.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.text('PAID', stampCenterX, stampCenterY, { align: 'center' });

  doc.setFontSize(5);
  doc.text('VERIFIED & AUDITED', stampCenterX, stampCenterY + 4, { align: 'center' });
  doc.text('* NEW DELHI *', stampCenterX, stampCenterY + 8, { align: 'center' });

  // Signatory Signature Line (Far Right)
  const signX = pw - m - 45;
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.4);
  doc.line(signX, footerY + 32, signX + 41, footerY + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Signatory', signX + 20.5, footerY + 36, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Accounts & Administration', signX + 20.5, footerY + 39.5, { align: 'center' });

  // 7. Save and trigger download
  const cleanFilename = `SpecialLearns_FeeReceipt_${receiptNo.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  doc.save(cleanFilename);
  return cleanFilename;
}
