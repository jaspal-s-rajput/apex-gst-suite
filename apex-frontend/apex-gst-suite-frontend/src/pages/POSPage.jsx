import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Barcode, Trash2, Printer, CheckCircle, CreditCard, Banknote, Search, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function POSPage({ company }) {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [cashTendered, setCashTendered] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [completedOrder, setCompletedOrder] = useState(null);
  const barcodeRef = useRef(null);

  useEffect(() => {
    loadItems();
    if (barcodeRef.current) barcodeRef.current.focus();
  }, []);

  async function loadItems() {
    const list = await api.getItems();
    setItems(list.filter(i => i.itemType === 'GOODS'));
  }

  // Handle barcode submission
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = items.find(i =>
      i.barcode === barcodeInput.trim() ||
      i.name.toLowerCase().includes(barcodeInput.trim().toLowerCase())
    );

    if (matched) {
      addToCart(matched);
      setBarcodeInput('');
    } else {
      alert('No product found matching: ' + barcodeInput);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const totalTax = cart.reduce((sum, item) => {
    const taxable = item.sellingPrice * item.quantity;
    return sum + (taxable * (item.gstRate || 18.00) / 100);
  }, 0);
  const grandTotal = Math.round(subtotal + totalTax);
  const tenderedNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);

  // Complete POS sale
  const handleCompleteSale = async () => {
    if (cart.length === 0) return;

    const orderData = {
      orderNumber: 'POS-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN'),
      cart: [...cart],
      subtotal,
      totalTax,
      grandTotal,
      paymentMode,
      cashTendered: tenderedNum > 0 ? tenderedNum : grandTotal,
      changeDue
    };

    setCompletedOrder(orderData);
    setCart([]);
    setCashTendered('');
  };

  return (
    <div className="page-body">
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Retail POS Counter</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            High-speed barcode scanner billing, fast cash tender, and 80mm thermal receipts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-paid" style={{ fontSize: '11px' }}>
            <Sparkles size={12} /> Scanner Active
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Left Side: Barcode Scanner & Quick Item Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Barcode Scanner Input */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <form onSubmit={handleBarcodeSubmit}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div className="input-addon" style={{ flex: 1 }}>
                  <Barcode size={18} className="addon-icon" color="#3b82f6" />
                  <input
                    ref={barcodeRef}
                    type="text"
                    className="form-control"
                    placeholder="Scan barcode or type product name & press Enter..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    style={{ height: '44px', fontSize: '14px' }}
                  />
                </div>
                <button type="submit" className="btn btn-blue" style={{ height: '44px', padding: '0 1.25rem' }}>
                  Add Item
                </button>
              </div>
            </form>
          </div>

          {/* Quick Select Grid */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Quick Item Catalog ({items.length} goods)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '100px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '0.2rem' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HSN: {item.hsnSacCode}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>
                      ₹{item.sellingPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Stock: {item.currentStock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cart & Fast Tender Calculator */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={18} color="#3b82f6" /> Current Bill
            </h3>
            <span className="badge badge-paid">{cart.length} items</span>
          </div>

          {/* Cart Table */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                Cart is empty. Scan items to begin counter sale.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ₹{item.sellingPrice} × {item.quantity} (GST {item.gstRate}%)
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', background: 'none', padding: '0.2rem 0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>-</button>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '0 0.4rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', background: 'none', padding: '0.2rem 0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>+</button>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, width: '65px', textAlign: 'right' }}>
                        ₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals Summary */}
          <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Taxable Value:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total GST (CGST + SGST):</span>
              <span>₹{Math.round(totalTax).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', color: '#10b981' }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Tender Calculator */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {['Cash', 'UPI', 'Card'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`btn ${paymentMode === mode ? 'btn-blue' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.4rem', fontSize: '12px' }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {paymentMode === 'Cash' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Cash Received (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Change to Return:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: changeDue > 0 ? '#10b981' : 'var(--text-secondary)' }}>
                    ₹{changeDue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className="btn btn-primary"
            style={{ width: '100%', height: '48px', fontSize: '15px' }}
          >
            <CheckCircle size={18} /> Complete Sale & Print Slip
          </button>
        </div>

      </div>

      {/* Completed Thermal Receipt Modal */}
      {completedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div 
            id="pos-receipt-print-area"
            style={{ 
              background: '#ffffff', 
              color: '#000000', 
              borderRadius: '8px', 
              maxWidth: '340px', 
              width: '100%', 
              padding: '1.5rem', 
              fontFamily: 'monospace', 
              fontSize: '12px', 
              border: '1px solid #cbd5e1' 
            }}
          >
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #000000', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 4px 0', color: '#000000' }}>
                {company?.tradeName || company?.legalName || 'Apex Enterprises'}
              </h3>
              <p style={{ margin: '2px 0', color: '#000000' }}>GSTIN: {company?.gstin || '27AAPFU0939F1ZV'}</p>
              <p style={{ margin: '2px 0', color: '#000000' }}>Order #{completedOrder.orderNumber}</p>
              <p style={{ margin: '2px 0', fontSize: '10px', color: '#000000' }}>{completedOrder.date}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.75rem', color: '#000000' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed #000000' }}>
                  <th style={{ textAlign: 'left', padding: '2px 0', color: '#000000' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '2px 0', color: '#000000' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '2px 0', color: '#000000' }}>Amt</th>
                </tr>
              </thead>
              <tbody>
                {completedOrder.cart.map((c, i) => (
                  <tr key={i} style={{ color: '#000000' }}>
                    <td>{c.name.substring(0, 14)}</td>
                    <td style={{ textAlign: 'center' }}>{c.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₹{c.sellingPrice * c.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '1px dashed #000000', paddingTop: '0.5rem', lineHeight: '1.6', color: '#000000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>₹{completedOrder.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST Tax:</span>
                <span>₹{Math.round(completedOrder.totalTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '14px', borderTop: '1px solid #000000', paddingTop: '2px' }}>
                <span>GRAND TOTAL:</span>
                <span>₹{completedOrder.grandTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span>Paid ({completedOrder.paymentMode}):</span>
                <span>₹{completedOrder.cashTendered}</span>
              </div>
              {completedOrder.changeDue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Change Return:</span>
                  <span>₹{completedOrder.changeDue}</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px dashed #000000', paddingTop: '0.5rem', fontSize: '11px', color: '#000000' }}>
              Thank You! Visit Again.
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
                <Printer size={14} /> Print
              </button>
              <button onClick={() => setCompletedOrder(null)} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', background: '#e2e8f0', color: '#0f172a' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
