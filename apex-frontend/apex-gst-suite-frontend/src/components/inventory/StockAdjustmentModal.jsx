import React, { useState } from 'react';
import { X, Sliders, AlertCircle, ArrowUpRight, ArrowDownRight, CheckCircle2, History } from 'lucide-react';
import { api } from '../../services/api';

export default function StockAdjustmentModal({ item, onClose, onSuccess }) {
  const currentStock = parseFloat(item?.currentStock) || 0;
  const uom = item?.uom || 'PCS';

  // Mode: 'ADD' (Stock Inward), 'REMOVE' (Damage / Loss / Expired), 'AUDIT' (Count Correction)
  const [adjustmentMode, setAdjustmentMode] = useState('REMOVE'); // 'ADD' | 'REMOVE' | 'AUDIT'
  const [quantity, setQuantity] = useState('');
  const [newPhysicalCount, setNewPhysicalCount] = useState(currentStock);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate net quantity change & resulting stock
  let netQuantityChange = 0;
  let resultingStock = currentStock;

  if (adjustmentMode === 'ADD') {
    const qtyVal = parseFloat(quantity) || 0;
    netQuantityChange = qtyVal;
    resultingStock = currentStock + qtyVal;
  } else if (adjustmentMode === 'REMOVE') {
    const qtyVal = parseFloat(quantity) || 0;
    netQuantityChange = -qtyVal;
    resultingStock = Math.max(0, currentStock - qtyVal);
  } else if (adjustmentMode === 'AUDIT') {
    const auditVal = parseFloat(newPhysicalCount) || 0;
    netQuantityChange = auditVal - currentStock;
    resultingStock = auditVal;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (adjustmentMode !== 'AUDIT' && (!quantity || parseFloat(quantity) <= 0)) {
      setError('Please specify a valid quantity greater than zero.');
      return;
    }

    if (adjustmentMode === 'REMOVE' && parseFloat(quantity) > currentStock) {
      setError(`Cannot remove more than the current stock level (${currentStock} ${uom}).`);
      return;
    }

    let movementType = 'ADJUSTMENT_CORRECTION';
    if (adjustmentMode === 'ADD') movementType = 'INWARD_PURCHASE';
    if (adjustmentMode === 'REMOVE') movementType = 'ADJUSTMENT_DAMAGE';
    if (adjustmentMode === 'AUDIT') movementType = 'ADJUSTMENT_CORRECTION';

    setLoading(true);
    try {
      const defaultRemarks = adjustmentMode === 'ADD'
        ? `Manual Inward Addition (+${netQuantityChange} ${uom})`
        : adjustmentMode === 'REMOVE'
        ? `Damage/Loss Write-off (${netQuantityChange} ${uom})`
        : `Physical Audit Correction (${netQuantityChange >= 0 ? '+' : ''}${netQuantityChange} ${uom})`;

      const updated = await api.adjustStock(
        item.id,
        netQuantityChange,
        movementType,
        remarks.trim() || defaultRemarks
      );
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to adjust stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 105,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '1.75rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} color="#3b82f6" /> Stock Adjustment
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              {item?.name} {item?.sku ? `(${item.sku})` : ''}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.9rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f87171',
            fontSize: '12.5px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Current Stock Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-elevated)',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT RECORDED STOCK</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {currentStock} <span style={{ fontSize: '14px', fontWeight: 600 }}>{uom}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RESULTING STOCK</div>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: resultingStock === currentStock ? 'var(--text-primary)' : resultingStock < currentStock ? '#f87171' : '#34d399'
            }}>
              {resultingStock} <span style={{ fontSize: '14px', fontWeight: 600 }}>{uom}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Action Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => { setAdjustmentMode('REMOVE'); setQuantity(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: adjustmentMode === 'REMOVE' ? '#ef4444' : 'transparent',
                color: adjustmentMode === 'REMOVE' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <ArrowDownRight size={14} /> Damage / Loss
            </button>
            <button
              type="button"
              onClick={() => { setAdjustmentMode('ADD'); setQuantity(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: adjustmentMode === 'ADD' ? '#10b981' : 'transparent',
                color: adjustmentMode === 'ADD' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <ArrowUpRight size={14} /> Direct Inward
            </button>
            <button
              type="button"
              onClick={() => { setAdjustmentMode('AUDIT'); setNewPhysicalCount(currentStock); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                background: adjustmentMode === 'AUDIT' ? 'var(--primary)' : 'transparent',
                color: adjustmentMode === 'AUDIT' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <Sliders size={14} /> Audit Count
            </button>
          </div>

          {/* Quantity Input */}
          {adjustmentMode === 'AUDIT' ? (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Actual Physical Count ({uom}) *</label>
              <input
                type="number"
                step="any"
                required
                className="form-control"
                placeholder={`Counted quantity in shelf (${uom})`}
                value={newPhysicalCount}
                onChange={(e) => setNewPhysicalCount(e.target.value)}
                autoFocus
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                System will record an adjustment of {netQuantityChange >= 0 ? `+${netQuantityChange}` : netQuantityChange} {uom}.
              </span>
            </div>
          ) : (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">
                {adjustmentMode === 'ADD' ? `Quantity to Add (${uom}) *` : `Quantity to Remove (${uom}) *`}
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                className="form-control"
                placeholder={`Enter quantity in ${uom}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Remarks */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Audit Remarks / Reason *</label>
            <input
              type="text"
              className="form-control"
              placeholder={
                adjustmentMode === 'REMOVE'
                  ? 'e.g. Expired lot write-off, water damage, broken seal'
                  : adjustmentMode === 'ADD'
                  ? 'e.g. Initial inventory catch-up, supplier promo sample'
                  : 'e.g. Monthly stock audit discrepancy reconciliation'
              }
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Recording Adjustment...' : 'Confirm Stock Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
