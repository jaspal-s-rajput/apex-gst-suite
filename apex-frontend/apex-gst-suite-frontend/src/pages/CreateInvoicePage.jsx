import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Save,
  ArrowLeft
} from 'lucide-react';
import InvoicePrintPreview from '../components/invoice/InvoicePrintPreview';
import { api } from '../services/api';

export default function CreateInvoicePage({ company, onBack, onInvoiceSaved }) {
  const [parties, setParties] = useState([]);
  const [itemsCatalog, setItemsCatalog] = useState([]);
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState(company?.stateCode || '27');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('Thank you for choosing Apex Enterprises!');
  const [termsAndConditions, setTermsAndConditions] = useState('Payment is due within 30 days. Goods once sold will not be taken back.');
  
  // Line items state - starts 100% clean and empty
  const [lines, setLines] = useState([]);

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [pList, iList] = await Promise.all([
      api.getParties(),
      api.getItems()
    ]);
    setParties(pList);
    setItemsCatalog(iList);
    if (pList.length > 0) {
      setSelectedPartyId(pList[0].id);
      if (pList[0].stateCode) {
        setPlaceOfSupply(pList[0].stateCode);
      }
    }
  }

  const selectedParty = parties.find(p => p.id === selectedPartyId) || null;
  const isInterState = company?.stateCode !== placeOfSupply;

  // Handle party change
  const handlePartySelect = (partyId) => {
    setSelectedPartyId(partyId);
    const p = parties.find(x => x.id === partyId);
    if (p && p.stateCode) {
      setPlaceOfSupply(p.stateCode);
    }
  };

  // Recalculate line item taxes
  const calculateLine = (line, interState) => {
    const qty = parseFloat(line.quantity) || 0;
    const price = parseFloat(line.unitPrice) || 0;
    const gross = qty * price;
    
    let discount = 0;
    if (line.discountPercent > 0) {
      discount = (gross * line.discountPercent) / 100;
    } else {
      discount = parseFloat(line.discountAmount) || 0;
    }

    const taxable = Math.max(0, gross - discount);
    const rate = parseFloat(line.gstRate) || 0;

    let cgst = 0, sgst = 0, igst = 0;
    if (interState) {
      igst = (taxable * rate) / 100;
    } else {
      const halfRate = rate / 2;
      cgst = (taxable * halfRate) / 100;
      sgst = (taxable * halfRate) / 100;
    }

    const total = taxable + cgst + sgst + igst;

    return {
      ...line,
      taxableValue: Math.round(taxable * 100) / 100,
      cgstAmount: Math.round(cgst * 100) / 100,
      sgstAmount: Math.round(sgst * 100) / 100,
      igstAmount: Math.round(igst * 100) / 100,
      totalAmount: Math.round(total * 100) / 100
    };
  };

  // Update line item
  const updateLine = (index, field, value) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };

    // If item selected from catalog
    if (field === 'itemId') {
      const catItem = itemsCatalog.find(i => i.id === value);
      if (catItem) {
        updated[index].itemName = catItem.name;
        updated[index].hsnSacCode = catItem.hsnSacCode;
        updated[index].unitPrice = catItem.sellingPrice;
        updated[index].gstRate = catItem.gstRate;
        updated[index].uom = catItem.uom;
      }
    }

    updated[index] = calculateLine(updated[index], isInterState);
    setLines(updated);
  };

  // Add line item
  const addLine = () => {
    const newLine = calculateLine({
      itemId: '',
      itemName: '',
      hsnSacCode: '8471',
      quantity: 1,
      uom: 'PCS',
      unitPrice: 0,
      discountPercent: 0,
      discountAmount: 0,
      gstRate: 18.00,
      taxableValue: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalAmount: 0
    }, isInterState);
    setLines([...lines, newLine]);
  };

  // Delete line item
  const deleteLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  // Recompute when place of supply changes
  useEffect(() => {
    const interState = company?.stateCode !== placeOfSupply;
    setLines(prev => prev.map(line => calculateLine(line, interState)));
  }, [placeOfSupply]);

  // Compute Invoice Summary Totals
  const subtotal = lines.reduce((sum, l) => sum + (parseFloat(l.unitPrice) * parseFloat(l.quantity) || 0), 0);
  const taxableAmount = lines.reduce((sum, l) => sum + (l.taxableValue || 0), 0);
  const cgstAmount = lines.reduce((sum, l) => sum + (l.cgstAmount || 0), 0);
  const sgstAmount = lines.reduce((sum, l) => sum + (l.sgstAmount || 0), 0);
  const igstAmount = lines.reduce((sum, l) => sum + (l.igstAmount || 0), 0);
  const preRound = taxableAmount + cgstAmount + sgstAmount + igstAmount;
  const roundOff = Math.round(preRound) - preRound;
  const grandTotal = Math.round(preRound);
  const paidVal = parseFloat(amountPaid) || 0;
  const balanceAmount = Math.max(0, grandTotal - paidVal);

  const previewInvoiceData = {
    invoiceNumber: `${company?.invoicePrefix || 'APEX/26-27'}/0${company?.nextInvoiceSequence || 105}`,
    invoiceDate,
    dueDate,
    placeOfSupply,
    isInterState,
    party: selectedParty,
    paymentMode,
    subtotal: Math.round(subtotal * 100) / 100,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstAmount: Math.round(sgstAmount * 100) / 100,
    igstAmount: Math.round(igstAmount * 100) / 100,
    roundOff: Math.round(roundOff * 100) / 100,
    grandTotal,
    amountPaid: paidVal,
    balanceAmount,
    paymentStatus: balanceAmount === 0 ? 'PAID' : paidVal > 0 ? 'PARTIALLY_PAID' : 'UNPAID',
    items: lines
  };

  // Handle Save
  const handleSaveInvoice = async () => {
    if (lines.length === 0) {
      alert('Please add at least one line item to the invoice.');
      return;
    }
    const hasEmptyItem = lines.some(l => !l.itemName?.trim());
    if (hasEmptyItem) {
      alert('Please provide a name or select an item from catalog for all line items.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        companyId: company?.id,
        partyId: selectedPartyId,
        invoiceDate,
        dueDate: dueDate || null,
        placeOfSupply,
        paymentMode,
        amountPaid: paidVal,
        notes,
        termsAndConditions,
        items: lines.map(l => ({
          itemId: l.itemId || null,
          itemName: l.itemName,
          hsnSacCode: l.hsnSacCode,
          quantity: parseFloat(l.quantity) || 1,
          uom: l.uom || 'PCS',
          unitPrice: parseFloat(l.unitPrice) || 0,
          discountPercent: parseFloat(l.discountPercent) || 0,
          discountAmount: parseFloat(l.discountAmount) || 0,
          gstRate: parseFloat(l.gstRate) || 18.0
        }))
      };

      const result = await api.createInvoice(payload);
      setToastMessage('Tax Invoice issued successfully!');
      setTimeout(() => {
        if (onInvoiceSaved) onInvoiceSaved(result);
      }, 1200);
    } catch (err) {
      alert('Failed to save invoice: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = `Hello ${selectedParty?.name || 'Customer'},\nYour GST Tax Invoice from ${company?.tradeName || 'Apex Enterprises'} is ready.\n\n*Invoice No:* ${previewInvoiceData.invoiceNumber}\n*Grand Total:* ₹${grandTotal.toLocaleString('en-IN')}\n*Balance Due:* ₹${balanceAmount.toLocaleString('en-IN')}\n\nPay immediately via UPI: ${company?.upiId}\nThank you for your business!`;
    const url = `https://wa.me/${(selectedParty?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-body">
      {/* Top Action Bar */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBack} className="btn btn-outline" style={{ padding: '0.5rem 0.75rem' }}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tax Invoice Studio</h2>
          <span className="badge badge-paid" style={{ fontSize: '11px' }}>
            <Sparkles size={12} /> Live Preview Active
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={16} />
            <span>Print A4</span>
          </button>

          <button onClick={() => window.print()} className="btn btn-secondary">
            <Download size={16} />
            <span>Download PDF</span>
          </button>

          <button onClick={handleWhatsAppShare} className="btn btn-secondary" style={{ color: '#10b981' }}>
            <Share2 size={16} />
            <span>Share on WhatsApp</span>
          </button>

          <button 
            onClick={handleSaveInvoice} 
            disabled={saving} 
            className="btn btn-primary"
            style={{ minWidth: '130px' }}
          >
            <Save size={16} />
            <span>{saving ? 'Issuing...' : 'Save & Issue'}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="alert-banner alert-warning" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#34d399' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <strong>{toastMessage}</strong>
          </div>
        </div>
      )}

      {/* Split Screen Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Pane: Invoice Creation Form */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card: Party & Logistics */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#60a5fa' }}>
              1. Customer & Tax Jurisdiction
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Customer / Party</label>
                <select 
                  className="form-control"
                  value={selectedPartyId}
                  onChange={(e) => handlePartySelect(e.target.value)}
                >
                  {parties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.gstin ? `(${p.gstin})` : '(Unregistered)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Place of Supply (State)</label>
                <select 
                  className="form-control"
                  value={placeOfSupply}
                  onChange={(e) => setPlaceOfSupply(e.target.value)}
                >
                  <option value="27">27 - Maharashtra</option>
                  <option value="29">29 - Karnataka</option>
                  <option value="24">24 - Gujarat</option>
                  <option value="07">07 - Delhi</option>
                  <option value="33">33 - Tamil Nadu</option>
                  <option value="09">09 - Uttar Pradesh</option>
                </select>
              </div>
            </div>

            {selectedParty && (
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GSTIN: </span>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{selectedParty.gstin || 'Unregistered'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {isInterState ? (
                    <span className="badge badge-partial" style={{ fontSize: '10px' }}>Inter-State (IGST)</span>
                  ) : (
                    <span className="badge badge-paid" style={{ fontSize: '10px' }}>Intra-State (CGST + SGST)</span>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Due Date</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Card: Line Items Studio */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#60a5fa' }}>
                2. Items & Pricing Breakdown
              </h3>
              <button onClick={addLine} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '12px' }}>
                <Plus size={14} /> Add Line Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lines.length === 0 ? (
                <div style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-muted)'
                }}>
                  <p style={{ fontSize: '13px', marginBottom: '0.75rem', fontWeight: 500 }}>
                    No items added yet. Click <strong>+ Add Line Item</strong> above or choose from your catalog.
                  </p>
                  <button
                    type="button"
                    onClick={addLine}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 1rem', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Plus size={14} /> Add First Item
                  </button>
                </div>
              ) : (
                lines.map((line, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: 'var(--bg-elevated)', 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '1rem',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Quick Item Selector</label>
                        <select 
                          className="form-control"
                          value={line.itemId}
                          onChange={(e) => updateLine(idx, 'itemId', e.target.value)}
                          style={{ height: '34px', fontSize: '12px' }}
                        >
                          <option value="">-- Choose from Catalog --</option>
                          {itemsCatalog.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Item Name / Description</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={line.itemName}
                          onChange={(e) => updateLine(idx, 'itemName', e.target.value)}
                          placeholder="Product name"
                          style={{ height: '34px', fontSize: '12px' }}
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>HSN/SAC</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={line.hsnSacCode}
                          onChange={(e) => updateLine(idx, 'hsnSacCode', e.target.value)}
                          style={{ height: '34px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>GST Tax Rate</label>
                        <select 
                          className="form-control"
                          value={line.gstRate}
                          onChange={(e) => updateLine(idx, 'gstRate', parseFloat(e.target.value))}
                          style={{ height: '34px', fontSize: '12px' }}
                        >
                          <option value="0">0% (Exempt)</option>
                          <option value="5">5% GST</option>
                          <option value="12">12% GST</option>
                          <option value="18">18% GST (Standard)</option>
                          <option value="28">28% GST</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.2fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Qty & Unit</label>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <input 
                            type="number" 
                            min="1"
                            className="form-control"
                            value={line.quantity}
                            onChange={(e) => updateLine(idx, 'quantity', e.target.value)}
                            style={{ height: '34px', fontSize: '12px', width: '60px' }}
                          />
                          <select 
                            className="form-control"
                            value={line.uom}
                            onChange={(e) => updateLine(idx, 'uom', e.target.value)}
                            style={{ height: '34px', fontSize: '12px' }}
                          >
                            <option value="PCS">PCS</option>
                            <option value="KGS">KGS</option>
                            <option value="BOX">BOX</option>
                            <option value="HOURS">HOURS</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Rate (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="form-control"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(idx, 'unitPrice', e.target.value)}
                          style={{ height: '34px', fontSize: '12px' }}
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontSize: '11px' }}>Discount %</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={line.discountPercent}
                          onChange={(e) => updateLine(idx, 'discountPercent', parseFloat(e.target.value) || 0)}
                          style={{ height: '34px', fontSize: '12px' }}
                        />
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Tax: ₹{isInterState ? line.igstAmount : (line.cgstAmount + line.sgstAmount)}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>
                          ₹{line.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteLine(idx)} 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem', color: '#ef4444', height: '34px' }}
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card: Payment & Terms */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#60a5fa' }}>
              3. Payment Tender & Terms
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select 
                  className="form-control"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI (Scan & Pay)</option>
                  <option value="NEFT">NEFT / RTGS / IMPS</option>
                  <option value="Credit">Credit (Pay Later)</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount Paid Right Now (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control"
                  placeholder="0.00"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes for Customer</label>
              <input 
                type="text" 
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Right Pane: Live A4 Tax Invoice Preview */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <InvoicePrintPreview invoice={previewInvoiceData} company={company} />
        </div>

      </div>
    </div>
  );
}
