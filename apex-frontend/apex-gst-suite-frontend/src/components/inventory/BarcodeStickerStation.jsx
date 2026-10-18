import React, { useState, useEffect, useRef } from 'react';
import { Printer, X, Settings2, Sliders, CheckSquare, Square, Package, Tag, Layers, RefreshCw } from 'lucide-react';
import JsBarcode from 'jsbarcode';

function BarcodeSvg({ value, format = 'CODE128', width = 1.4, height = 32, fontSize = 10, displayValue = true }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, String(value), {
          format: format || 'CODE128',
          width,
          height,
          displayValue,
          fontSize,
          margin: 0,
          background: 'transparent',
          lineColor: '#000000'
        });
      } catch (err) {
        // Fallback to CODE128
        try {
          JsBarcode(svgRef.current, String(value), {
            format: 'CODE128',
            width,
            height,
            displayValue,
            fontSize,
            margin: 0,
            background: 'transparent',
            lineColor: '#000000'
          });
        } catch (_) {}
      }
    }
  }, [value, format, width, height, fontSize, displayValue]);

  return <svg ref={svgRef} style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />;
}

export default function BarcodeStickerStation({ items = [], selectedItem = null, company, onClose }) {
  const [activeItemId, setActiveItemId] = useState(selectedItem?.id || (items[0]?.id || ''));
  const [layout, setLayout] = useState('a4-24'); // 'a4-24' (3x8), 'a4-40' (4x10), 'thermal-single'
  const [printCount, setPrintCount] = useState(selectedItem ? (Math.max(1, Math.min(24, Math.round(selectedItem.currentStock || 12)))) : 24);

  // Sticker content toggle options
  const [showStoreName, setShowStoreName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBatchExp, setShowBatchExp] = useState(true);
  const [showHsn, setShowHsn] = useState(true);

  const currentItem = items.find(i => i.id === activeItemId) || selectedItem || items[0];
  const barcodeValue = currentItem?.barcode || currentItem?.sku || '8901234567890';
  const storeName = company?.tradeName || company?.legalName || 'Apex Store';

  // Format currency
  const formatInr = (val) => {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const handlePrint = () => {
    window.print();
  };

  // Sticker items array
  const stickerArray = Array.from({ length: Math.max(1, parseInt(printCount) || 1) });

  return (
    <div className="barcode-station-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      zIndex: 110,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      {/* Configuration Header (Hidden on Print) */}
      <div className="no-print card" style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto 1.5rem auto',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Tag size={20} />
            </span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Barcode Sticker Printing Station</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Generate print-ready sticker sheets (A4 sheet labels or single thermal rolls)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Product Select */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Select Product</label>
            <select
              className="form-control"
              value={activeItemId}
              onChange={(e) => setActiveItemId(e.target.value)}
              style={{ fontSize: '13px' }}
            >
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} (Stock: {it.currentStock} {it.uom || 'PCS'}) — ₹{it.sellingPrice}
                </option>
              ))}
            </select>
          </div>

          {/* Sheet Layout */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Label Sheet Layout</label>
            <select
              className="form-control"
              value={layout}
              onChange={(e) => {
                setLayout(e.target.value);
                if (e.target.value === 'a4-24') setPrintCount(24);
                if (e.target.value === 'a4-40') setPrintCount(40);
                if (e.target.value === 'thermal-single') setPrintCount(1);
              }}
              style={{ fontSize: '13px' }}
            >
              <option value="a4-24">A4 Sheet — 24 Labels (3 Cols × 8 Rows)</option>
              <option value="a4-40">A4 Sheet — 40 Labels (4 Cols × 10 Rows)</option>
              <option value="thermal-single">Thermal Roll — 50mm × 25mm (Single Label)</option>
            </select>
          </div>

          {/* Label Quantity */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ fontSize: '12px', margin: 0 }}>Number of Stickers</label>
              <span
                style={{ fontSize: '11px', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => setPrintCount(currentItem?.currentStock || 1)}
              >
                Match Stock ({currentItem?.currentStock || 0})
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
              <input
                type="number"
                min="1"
                max="200"
                className="form-control"
                value={printCount}
                onChange={(e) => setPrintCount(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ fontSize: '13px' }}
              />
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0 0.6rem', fontSize: '12px' }}
                onClick={() => setPrintCount(layout === 'a4-40' ? 40 : 24)}
              >
                Full Sheet
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary"
              style={{ flex: 1, height: '40px', fontWeight: 700, gap: '0.5rem' }}
            >
              <Printer size={16} /> Print {printCount} Sticker{printCount > 1 ? 's' : ''}
            </button>
          </div>
        </div>

        {/* Content Toggles */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showStoreName} onChange={(e) => setShowStoreName(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            <span>Store Name</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showProductName} onChange={(e) => setShowProductName(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            <span>Product Name</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            <span>MRP / Price</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showHsn} onChange={(e) => setShowHsn(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            <span>HSN Code</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={showBatchExp} onChange={(e) => setShowBatchExp(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
            <span>Batch & Expiry</span>
          </label>
        </div>
      </div>

      {/* Sheet Preview & Printable Area */}
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', flex: 1 }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '12px' }}>
          <span>Sheet Preview ({layout === 'a4-24' ? '3 columns × 8 rows' : layout === 'a4-40' ? '4 columns × 10 rows' : 'Thermal Label Roll'})</span>
          <span>Actual printout matches standard adhesive sticker sheets</span>
        </div>

        {/* Printable Station Container */}
        <div id="barcode-print-station" style={{
          background: '#ffffff',
          color: '#000000',
          padding: layout === 'thermal-single' ? '4px' : '10mm',
          borderRadius: '4px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          margin: '0 auto',
          maxWidth: layout === 'thermal-single' ? '60mm' : '210mm',
          minHeight: layout === 'thermal-single' ? 'auto' : '297mm',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: layout === 'a4-24' ? 'repeat(3, 1fr)' : layout === 'a4-40' ? 'repeat(4, 1fr)' : '1fr',
            gap: layout === 'thermal-single' ? '0' : '3mm',
            width: '100%'
          }}>
            {stickerArray.map((_, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: '3px',
                  padding: layout === 'a4-40' ? '3px 4px' : '6px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                  minHeight: layout === 'a4-40' ? '24mm' : layout === 'a4-24' ? '33mm' : '28mm',
                  pageBreakInside: 'avoid'
                }}
              >
                {/* Store Name Header */}
                {showStoreName && (
                  <div style={{ fontSize: layout === 'a4-40' ? '8px' : '9.5px', fontWeight: 800, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                    {storeName}
                  </div>
                )}

                {/* Product Name */}
                {showProductName && (
                  <div style={{
                    fontSize: layout === 'a4-40' ? '9px' : '11px',
                    fontWeight: 700,
                    color: '#000000',
                    lineHeight: 1.15,
                    margin: '1px 0',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {currentItem?.name || 'Product'}
                  </div>
                )}

                {/* Barcode Vector */}
                <div style={{ width: '100%', margin: '1px 0' }}>
                  <BarcodeSvg
                    value={barcodeValue}
                    width={layout === 'a4-40' ? 1.0 : 1.3}
                    height={layout === 'a4-40' ? 22 : 30}
                    fontSize={layout === 'a4-40' ? 8 : 10}
                    displayValue={true}
                  />
                </div>

                {/* Price, HSN, and Batch/Expiry Details */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: layout === 'a4-40' ? '8px' : '10px', fontWeight: 700, color: '#000000', borderTop: '0.5px solid #000000', paddingTop: '2px', marginTop: '1px' }}>
                  {showPrice && (
                    <span>MRP: {formatInr(currentItem?.sellingPrice)}</span>
                  )}
                  {showHsn && currentItem?.hsnSacCode && (
                    <span style={{ fontSize: layout === 'a4-40' ? '7.5px' : '8.5px', fontWeight: 500 }}>
                      HSN: {currentItem.hsnSacCode}
                    </span>
                  )}
                </div>

                {showBatchExp && currentItem?.batchNumber && (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: layout === 'a4-40' ? '7px' : '8.5px', color: '#333333', marginTop: '1px' }}>
                    <span>B: {currentItem.batchNumber}</span>
                    {currentItem.expiryDate && <span>Exp: {currentItem.expiryDate}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
