import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function InvoicePrintPreview({ invoice, company }) {
  const comp = company || {
    legalName: 'Apex Enterprises Pvt Ltd',
    tradeName: 'Apex Solutions',
    gstin: '27AAPFU0939F1ZV',
    stateCode: '27',
    stateName: 'Maharashtra',
    addressLine1: 'Plot 42, Tech Park Avenue, Andheri East, Mumbai - 400069',
    phone: '+91 98765 43210',
    email: 'billing@apexsuite.in',
    bankName: 'HDFC Bank',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    upiId: 'apexsolutions@upi'
  };

  const inv = invoice || {};
  const party = inv.party || {};
  const items = inv.items || [];
  const isInterState = inv.isInterState || false;

  // Format currency in Indian Rupees
  const formatInr = (val) => {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Convert numbers to words (Rupees)
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n) => {
      if ((n = n.toString()).length > 9) return 'overflow';
      let nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!nArray) return '';
      let str = '';
      str += (nArray[1] != 0) ? (a[Number(nArray[1])] || b[nArray[1][0]] + ' ' + a[nArray[1][1]]) + 'Crore ' : '';
      str += (nArray[2] != 0) ? (a[Number(nArray[2])] || b[nArray[2][0]] + ' ' + a[nArray[2][1]]) + 'Lakh ' : '';
      str += (nArray[3] != 0) ? (a[Number(nArray[3])] || b[nArray[3][0]] + ' ' + a[nArray[3][1]]) + 'Thousand ' : '';
      str += (nArray[4] != 0) ? (a[Number(nArray[4])] || b[nArray[4][0]] + ' ' + a[nArray[4][1]]) + 'Hundred ' : '';
      str += (nArray[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0]] + ' ' + a[nArray[5][1]]) : '';
      return str.trim();
    };
    const rounded = Math.round(Number(num) || 0);
    return rounded > 0 ? inWords(rounded) + ' Rupees Only' : 'Zero Rupees';
  };

  const upiPayload = inv.upiQrPayload || `upi://pay?pa=${comp.upiId}&pn=${encodeURIComponent(comp.tradeName || comp.legalName)}&am=${inv.grandTotal || 0}&cu=INR&tn=Invoice%20Payment`;

  return (
    <div className="invoice-preview-container" id="printable-invoice">
      {/* Document Header */}
      <div className="inv-header">
        <div className="inv-brand">
          <h1>{comp.tradeName || comp.legalName}</h1>
          <p style={{ fontWeight: 600 }}>{comp.legalName}</p>
          <p>{comp.addressLine1}</p>
          <p>
            <strong>GSTIN:</strong> {comp.gstin} &nbsp;|&nbsp; 
            <strong>State:</strong> {comp.stateName} ({comp.stateCode})
          </p>
          <p>Email: {comp.email} &nbsp;|&nbsp; Phone: {comp.phone}</p>
        </div>

        <div className="inv-meta">
          <h2>TAX INVOICE</h2>
          <p style={{ fontSize: '11px', color: '#64748b' }}>ORIGINAL FOR RECIPIENT</p>
          <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
            <p><strong>Invoice No:</strong> {inv.invoiceNumber || 'DRAFT'}</p>
            <p><strong>Date:</strong> {inv.invoiceDate || new Date().toISOString().split('T')[0]}</p>
            {inv.dueDate && <p><strong>Due Date:</strong> {inv.dueDate}</p>}
            <p><strong>Place of Supply:</strong> {inv.placeOfSupply || comp.stateCode}</p>
          </div>
        </div>
      </div>

      {/* Parties Info Grid */}
      <div className="inv-grid">
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.75rem' }}>
          <div className="inv-section-title">Billed To (Customer):</div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{party.name || 'Walk-in Customer'}</p>
          {party.gstin ? (
            <p style={{ color: '#1e3a8a', fontWeight: 600 }}>
              <strong>GSTIN:</strong> {party.gstin}
            </p>
          ) : (
            <p style={{ color: '#64748b', fontSize: '11px' }}>Consumer / Unregistered</p>
          )}
          <p>{party.billingAddress || 'Local Address'}</p>
          <p>
            <strong>State:</strong> {party.stateName || 'Maharashtra'} ({party.stateCode || inv.placeOfSupply || '27'})
          </p>
          {party.phone && <p>Phone: {party.phone}</p>}
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.75rem' }}>
          <div className="inv-section-title">Transportation & Tax Details:</div>
          <p><strong>Supply Type:</strong> {isInterState ? 'Inter-State Supply (IGST)' : 'Intra-State Supply (CGST + SGST)'}</p>
          <p><strong>Reverse Charge (RCM):</strong> {inv.isReverseCharge ? 'Yes' : 'No'}</p>
          <p><strong>Payment Mode:</strong> {inv.paymentMode || 'Credit / Bank Transfer'}</p>
          <p><strong>Payment Status:</strong> {inv.paymentStatus || 'UNPAID'}</p>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="inv-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>#</th>
            <th>Item Description</th>
            <th style={{ width: '70px' }}>HSN/SAC</th>
            <th style={{ width: '50px', textAlign: 'center' }}>Qty</th>
            <th style={{ width: '80px', textAlign: 'right' }}>Rate</th>
            <th style={{ width: '90px', textAlign: 'right' }}>Taxable</th>
            <th style={{ width: '60px', textAlign: 'center' }}>GST %</th>
            {!isInterState ? (
              <>
                <th style={{ width: '75px', textAlign: 'right' }}>CGST</th>
                <th style={{ width: '75px', textAlign: 'right' }}>SGST</th>
              </>
            ) : (
              <th style={{ width: '90px', textAlign: 'right' }}>IGST</th>
            )}
            <th style={{ width: '95px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={isInterState ? 8 : 9} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                No items added yet.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>
                  <strong>{item.itemName}</strong>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{item.hsnSacCode}</td>
                <td style={{ textAlign: 'center' }}>{item.quantity} {item.uom || 'PCS'}</td>
                <td style={{ textAlign: 'right' }}>{formatInr(item.unitPrice)}</td>
                <td style={{ textAlign: 'right' }}>{formatInr(item.taxableValue)}</td>
                <td style={{ textAlign: 'center' }}>{item.gstRate}%</td>
                {!isInterState ? (
                  <>
                    <td style={{ textAlign: 'right' }}>{formatInr(item.cgstAmount)}</td>
                    <td style={{ textAlign: 'right' }}>{formatInr(item.sgstAmount)}</td>
                  </>
                ) : (
                  <td style={{ textAlign: 'right' }}>{formatInr(item.igstAmount)}</td>
                )}
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatInr(item.totalAmount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Footer Details & Totals */}
      <div className="inv-footer">
        <div>
          {/* Dynamic NPCI UPI QR Code Block */}
          <div className="inv-qr-card">
            <QRCodeSVG 
              value={upiPayload} 
              size={90} 
              level="M" 
              includeMargin={false}
            />
            <div className="qr-info">
              <h4>Scan to Pay (NPCI UPI)</h4>
              <p>Scan with Google Pay, PhonePe, Paytm</p>
              <p style={{ marginTop: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                UPI: <strong>{comp.upiId}</strong>
              </p>
              <p style={{ color: '#059669', fontWeight: 700 }}>
                Exact Due: {formatInr(inv.balanceAmount || inv.grandTotal)}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', fontSize: '11px', color: '#475569' }}>
            <p><strong>Bank Details:</strong></p>
            <p>Bank: {comp.bankName} | A/C: {comp.accountNumber}</p>
            <p>IFSC: {comp.ifscCode} | Branch: {comp.branchName}</p>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '11px', color: '#475569' }}>
            <p><strong>Amount in Words:</strong></p>
            <p style={{ fontStyle: 'italic', fontWeight: 600, color: '#0f172a' }}>
              {numberToWords(inv.grandTotal)}
            </p>
          </div>
        </div>

        <div>
          <table className="inv-totals-table">
            <tbody>
              <tr>
                <td>Subtotal:</td>
                <td style={{ textAlign: 'right' }}>{formatInr(inv.subtotal)}</td>
              </tr>
              {inv.discountAmount > 0 && (
                <tr style={{ color: '#dc2626' }}>
                  <td>Discount:</td>
                  <td style={{ textAlign: 'right' }}>-{formatInr(inv.discountAmount)}</td>
                </tr>
              )}
              <tr>
                <td>Taxable Amount:</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatInr(inv.taxableAmount)}</td>
              </tr>
              {!isInterState ? (
                <>
                  <tr>
                    <td>CGST:</td>
                    <td style={{ textAlign: 'right' }}>{formatInr(inv.cgstAmount)}</td>
                  </tr>
                  <tr>
                    <td>SGST:</td>
                    <td style={{ textAlign: 'right' }}>{formatInr(inv.sgstAmount)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td>IGST:</td>
                  <td style={{ textAlign: 'right' }}>{formatInr(inv.igstAmount)}</td>
                </tr>
              )}
              {inv.roundOff !== 0 && (
                <tr>
                  <td>Round Off:</td>
                  <td style={{ textAlign: 'right' }}>{formatInr(inv.roundOff)}</td>
                </tr>
              )}
              <tr className="total-row">
                <td>Grand Total:</td>
                <td style={{ textAlign: 'right' }}>{formatInr(inv.grandTotal)}</td>
              </tr>
              <tr>
                <td>Amount Paid:</td>
                <td style={{ textAlign: 'right', color: '#059669', fontWeight: 600 }}>{formatInr(inv.amountPaid)}</td>
              </tr>
              <tr style={{ fontWeight: 700, color: '#dc2626' }}>
                <td>Balance Due:</td>
                <td style={{ textAlign: 'right' }}>{formatInr(inv.balanceAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: '#64748b' }}>For {comp.tradeName || comp.legalName}</p>
            <div style={{ height: '35px' }}></div>
            <p style={{ fontSize: '11px', fontWeight: 700, borderTop: '1px solid #cbd5e1', display: 'inline-block', paddingLeft: '1rem', paddingRight: '1rem' }}>
              Authorized Signatory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
