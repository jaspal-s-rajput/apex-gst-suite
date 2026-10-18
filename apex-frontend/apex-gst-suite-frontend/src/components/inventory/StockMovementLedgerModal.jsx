import React, { useState, useEffect } from 'react';
import { X, History, ArrowUpRight, ArrowDownRight, RefreshCw, Filter, Package } from 'lucide-react';
import { api } from '../../services/api';

export default function StockMovementLedgerModal({ item = null, onClose }) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadMovements();
  }, [item]);

  async function loadMovements() {
    setLoading(true);
    try {
      let data = [];
      if (item?.id) {
        data = await api.getItemMovements(item.id);
      } else {
        data = await api.getAllMovements();
      }
      setMovements(data || []);
    } catch (_) {
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
      return dateStr;
    }
  };

  const getMovementBadge = (type) => {
    switch (type) {
      case 'INWARD_PURCHASE':
        return <span className="badge badge-paid" style={{ fontSize: '11px' }}>Inward / Purchase</span>;
      case 'OUTWARD_SALE':
        return <span className="badge badge-blue" style={{ fontSize: '11px' }}>Outward Sale</span>;
      case 'ADJUSTMENT_DAMAGE':
        return <span className="badge badge-unpaid" style={{ fontSize: '11px' }}>Damage / Loss</span>;
      case 'ADJUSTMENT_CORRECTION':
        return <span className="badge badge-partial" style={{ fontSize: '11px' }}>Audit Correction</span>;
      case 'RETURN_INWARD':
        return <span className="badge badge-paid" style={{ fontSize: '11px' }}>Customer Return</span>;
      case 'RETURN_OUTWARD':
        return <span className="badge badge-unpaid" style={{ fontSize: '11px' }}>Vendor Return</span>;
      default:
        return <span className="badge badge-outline" style={{ fontSize: '11px' }}>{type}</span>;
    }
  };

  const filteredMovements = movements.filter(m => {
    if (filterType === 'ALL') return true;
    return m.movementType === filterType;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 105,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="card" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <History size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                {item ? `Stock Movement History: ${item.name}` : 'Stock Movement Ledger (All Goods)'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                {item ? `SKU: ${item.sku || 'N/A'} | Current Balance: ${item.currentStock} ${item.uom || 'PCS'}` : 'Complete audit trail of inward, outward sales, corrections, and damages'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Records' },
              { id: 'INWARD_PURCHASE', label: 'Inward / Add' },
              { id: 'OUTWARD_SALE', label: 'Sales' },
              { id: 'ADJUSTMENT_DAMAGE', label: 'Damage / Loss' },
              { id: 'ADJUSTMENT_CORRECTION', label: 'Audit Correction' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`btn ${filterType === f.id ? 'btn-blue' : 'btn-outline'}`}
                style={{ fontSize: '11.5px', padding: '0.3rem 0.65rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button onClick={loadMovements} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem', fontSize: '11.5px' }} title="Refresh">
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Table Body */}
        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Loading stock movement records...
            </div>
          ) : filteredMovements.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No stock movements found matching the selected filter.
            </div>
          ) : (
            <table className="data-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  {!item && <th>Item Name</th>}
                  <th>Movement Type</th>
                  <th style={{ textAlign: 'right' }}>Qty Change</th>
                  <th style={{ textAlign: 'right' }}>Balance After</th>
                  <th>Remarks / Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((m) => {
                  const isPositive = (parseFloat(m.quantityChange) || 0) > 0;
                  const isZero = (parseFloat(m.quantityChange) || 0) === 0;
                  return (
                    <tr key={m.id}>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                        {formatTimestamp(m.createdAt)}
                      </td>
                      {!item && (
                        <td style={{ fontWeight: 600 }}>{m.itemName || '—'}</td>
                      )}
                      <td>{getMovementBadge(m.movementType)}</td>
                      <td style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: isZero ? 'var(--text-muted)' : isPositive ? '#10b981' : '#f87171'
                      }}>
                        {isPositive ? `+${m.quantityChange}` : m.quantityChange}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {m.balanceAfter}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                        {m.remarks || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
