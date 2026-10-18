import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  AlertTriangle,
  Barcode,
  Sliders,
  History,
  Edit2,
  Trash2,
  ShieldAlert,
  Tag,
  X
} from 'lucide-react';
import { api } from '../services/api';
import BarcodeStickerStation from '../components/inventory/BarcodeStickerStation';
import StockAdjustmentModal from '../components/inventory/StockAdjustmentModal';
import StockMovementLedgerModal from '../components/inventory/StockMovementLedgerModal';

export default function InventoryPage({ company }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'LOW_STOCK' | 'EXPIRING'

  // Modals state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [adjustingItem, setAdjustingItem] = useState(null);
  const [barcodeStationItem, setBarcodeStationItem] = useState(null);
  const [showBarcodeStation, setShowBarcodeStation] = useState(false);
  const [movementLedgerItem, setMovementLedgerItem] = useState(null);
  const [showMovementLedger, setShowMovementLedger] = useState(false);

  // Form state for Add / Edit Item
  const initialFormState = {
    name: '',
    sku: '',
    barcode: '',
    category: 'General',
    itemType: 'GOODS',
    hsnSacCode: '8471',
    uom: 'PCS',
    purchasePrice: '',
    sellingPrice: '',
    gstRate: 18.00,
    currentStock: 10,
    minStockAlert: 5,
    batchTrackingEnabled: false,
    batchNumber: '',
    expiryDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const list = await api.getItems();
      setItems(list || []);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Generate random 13-digit EAN barcode (starts with 890 for India)
  const generateEanBarcode = () => {
    let code = '890';
    for (let i = 0; i < 9; i++) {
      code += Math.floor(Math.random() * 10);
    }
    // Checksum
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    code += checkDigit;
    setFormData(prev => ({ ...prev, barcode: code }));
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData(initialFormState);
    setShowItemModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      sku: item.sku || '',
      barcode: item.barcode || '',
      category: item.category || 'General',
      itemType: item.itemType || 'GOODS',
      hsnSacCode: item.hsnSacCode || '8471',
      uom: item.uom || 'PCS',
      purchasePrice: item.purchasePrice || '',
      sellingPrice: item.sellingPrice || '',
      gstRate: parseFloat(item.gstRate) || 18.00,
      currentStock: item.currentStock || 0,
      minStockAlert: item.minStockAlert || 5,
      batchTrackingEnabled: Boolean(item.batchTrackingEnabled),
      batchNumber: item.batchNumber || '',
      expiryDate: item.expiryDate || ''
    });
    setShowItemModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      currentStock: parseFloat(formData.currentStock) || 0,
      minStockAlert: parseFloat(formData.minStockAlert) || 5,
      gstRate: parseFloat(formData.gstRate) || 18.00,
      batchNumber: formData.batchTrackingEnabled ? formData.batchNumber.trim() : null,
      expiryDate: (formData.batchTrackingEnabled && formData.expiryDate) ? formData.expiryDate : null
    };

    if (editingItem?.id) {
      const updated = await api.updateItem({ ...payload, id: editingItem.id });
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...updated } : i));
    } else {
      const created = await api.createItem(payload);
      setItems([created, ...items]);
    }

    setShowItemModal(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this product from the inventory master?')) {
      await api.deleteItem(itemId);
      setItems(items.filter(i => i.id !== itemId));
    }
  };

  // Expiry calculation helper
  const getExpiryStatus = (item) => {
    if (!item.batchTrackingEnabled || !item.expiryDate) {
      if (item.batchNumber) {
        return { type: 'NORMAL', text: `Lot: ${item.batchNumber}`, days: null };
      }
      return null;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exp = new Date(item.expiryDate);
      exp.setHours(0, 0, 0, 0);

      const diffTime = exp.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { type: 'EXPIRED', text: `Expired (${item.expiryDate})`, days: diffDays };
      } else if (diffDays <= 30) {
        return { type: 'EXPIRING_SOON', text: `Exp in ${diffDays}d (${item.expiryDate})`, days: diffDays };
      } else {
        return { type: 'VALID', text: `Exp: ${item.expiryDate}`, days: diffDays };
      }
    } catch (_) {
      return null;
    }
  };

  // Filter items
  const lowStockItems = items.filter(i => i.itemType === 'GOODS' && (parseFloat(i.currentStock) || 0) <= (parseFloat(i.minStockAlert) || 5));
  const expiringOrExpiredItems = items.filter(i => {
    const st = getExpiryStatus(i);
    return st && (st.type === 'EXPIRED' || st.type === 'EXPIRING_SOON');
  });

  const filtered = items.filter(i => {
    // Tab filter
    if (activeTab === 'LOW_STOCK') {
      const isLow = i.itemType === 'GOODS' && (parseFloat(i.currentStock) || 0) <= (parseFloat(i.minStockAlert) || 5);
      if (!isLow) return false;
    } else if (activeTab === 'EXPIRING') {
      const st = getExpiryStatus(i);
      if (!st || (st.type !== 'EXPIRED' && st.type !== 'EXPIRING_SOON')) return false;
    }

    // Search filter
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      i.name.toLowerCase().includes(s) ||
      (i.barcode && i.barcode.includes(s)) ||
      (i.sku && i.sku.toLowerCase().includes(s)) ||
      (i.batchNumber && i.batchNumber.toLowerCase().includes(s)) ||
      (i.hsnSacCode && i.hsnSacCode.includes(s)) ||
      (i.category && i.category.toLowerCase().includes(s))
    );
  });

  return (
    <div className="page-body">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Inventory & Stock Master</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0.25rem 0 0 0' }}>
            Batch & expiry monitoring, manual stock audit adjustments, and barcode sticker printing
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setShowMovementLedger(true); setMovementLedgerItem(null); }}
            className="btn btn-secondary"
            title="View company-wide stock inward/outward/damage ledger"
          >
            <History size={16} /> Movement History
          </button>
          <button
            onClick={() => { setShowBarcodeStation(true); setBarcodeStationItem(null); }}
            className="btn btn-secondary"
            title="Open printable barcode sticker station"
          >
            <Tag size={16} /> Barcode Station
          </button>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <Plus size={16} /> Add Product / Service
          </button>
        </div>
      </div>

      {/* Quick Summary Warning Banner */}
      {(lowStockItems.length > 0 || expiringOrExpiredItems.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          {lowStockItems.length > 0 && (
            <div className="alert-banner alert-warning" style={{ margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} />
                <span><strong>{lowStockItems.length} Product(s)</strong> are below minimum reorder threshold!</span>
              </div>
              <button
                onClick={() => setActiveTab('LOW_STOCK')}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem', fontSize: '11.5px', background: 'rgba(0,0,0,0.2)' }}
              >
                Filter Low Stock
              </button>
            </div>
          )}

          {expiringOrExpiredItems.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.6rem',
              color: '#f87171',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} />
                <span><strong>{expiringOrExpiredItems.length} Lot(s)</strong> expired or expiring within 30 days!</span>
              </div>
              <button
                onClick={() => setActiveTab('EXPIRING')}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem', fontSize: '11.5px', background: 'rgba(0,0,0,0.2)', color: '#f87171' }}
              >
                Review Lots
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tabs & Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('ALL')}
              className={`btn ${activeTab === 'ALL' ? 'btn-blue' : 'btn-outline'}`}
              style={{ fontSize: '12.5px', padding: '0.45rem 0.85rem' }}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('LOW_STOCK')}
              className={`btn ${activeTab === 'LOW_STOCK' ? 'btn-blue' : 'btn-outline'}`}
              style={{ fontSize: '12.5px', padding: '0.45rem 0.85rem' }}
            >
              Low Stock Alerts ({lowStockItems.length})
            </button>
            <button
              onClick={() => setActiveTab('EXPIRING')}
              className={`btn ${activeTab === 'EXPIRING' ? 'btn-blue' : 'btn-outline'}`}
              style={{ fontSize: '12.5px', padding: '0.45rem 0.85rem' }}
            >
              Batch & Expiry ({expiringOrExpiredItems.length})
            </button>
          </div>

          {/* Search box */}
          <div className="input-addon" style={{ minWidth: '280px', flex: '0 1 360px' }}>
            <Search size={16} className="addon-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, SKU, HSN, batch, barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU & Barcode</th>
                <th>HSN / SAC</th>
                <th>Batch & Expiry</th>
                <th style={{ textAlign: 'right' }}>Cost (₹)</th>
                <th style={{ textAlign: 'right' }}>Selling Price (₹)</th>
                <th style={{ textAlign: 'center' }}>GST</th>
                <th style={{ textAlign: 'center' }}>Stock Level</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading product catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No products found in this view. Click "Add Product / Service" to register your first item.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isLow = item.itemType === 'GOODS' && (parseFloat(item.currentStock) || 0) <= (parseFloat(item.minStockAlert) || 5);
                  const isOut = item.itemType === 'GOODS' && (parseFloat(item.currentStock) || 0) === 0;
                  const expStatus = getExpiryStatus(item);

                  return (
                    <tr key={item.id}>
                      {/* Name & Type */}
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span>{item.category || 'General'}</span>
                          <span>•</span>
                          <span>{item.itemType}</span>
                        </div>
                      </td>

                      {/* SKU & Barcode */}
                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                          {item.sku || '—'}
                        </div>
                        {item.barcode && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', color: 'var(--text-secondary)' }}>
                            <Barcode size={12} /> {item.barcode}
                          </div>
                        )}
                      </td>

                      {/* HSN */}
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {item.hsnSacCode}
                      </td>

                      {/* Batch & Expiry Badges */}
                      <td>
                        {item.batchTrackingEnabled || item.batchNumber ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                            {item.batchNumber && (
                              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                                Lot: {item.batchNumber}
                              </span>
                            )}
                            {expStatus && (
                              <span
                                className={`badge ${
                                  expStatus.type === 'EXPIRED'
                                    ? 'badge-unpaid'
                                    : expStatus.type === 'EXPIRING_SOON'
                                    ? 'badge-partial'
                                    : 'badge-paid'
                                }`}
                                style={{ fontSize: '10.5px' }}
                              >
                                {expStatus.type === 'EXPIRED' && '⚠️ '}
                                {expStatus.type === 'EXPIRING_SOON' && '⏳ '}
                                {expStatus.text}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                        )}
                      </td>

                      {/* Cost */}
                      <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ₹{Number(item.purchasePrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Selling Price */}
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>
                        ₹{Number(item.sellingPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* GST Slab */}
                      <td style={{ textAlign: 'center', fontWeight: 600, fontSize: '12px' }}>
                        {item.gstRate}%
                      </td>

                      {/* Stock Level */}
                      <td style={{ textAlign: 'center' }}>
                        {item.itemType === 'SERVICE' ? (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Service</span>
                        ) : (
                          <span className={`badge ${isOut ? 'badge-unpaid' : isLow ? 'badge-partial' : 'badge-paid'}`}>
                            {item.currentStock} {item.uom || 'PCS'} {isLow && '⚠️'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          {item.itemType === 'GOODS' && (
                            <>
                              {/* Stock Adjustment */}
                              <button
                                onClick={() => setAdjustingItem(item)}
                                className="btn btn-outline"
                                style={{ padding: '0.35rem 0.5rem', color: '#10b981' }}
                                title="Adjust Stock (Add Inward / Record Damage / Reconcile Audit)"
                              >
                                <Sliders size={13} />
                              </button>

                              {/* Print Barcode Stickers */}
                              <button
                                onClick={() => { setBarcodeStationItem(item); setShowBarcodeStation(true); }}
                                className="btn btn-outline"
                                style={{ padding: '0.35rem 0.5rem', color: '#38bdf8' }}
                                title="Print Barcode Stickers"
                              >
                                <Tag size={13} />
                              </button>

                              {/* Movement History */}
                              <button
                                onClick={() => { setMovementLedgerItem(item); setShowMovementLedger(true); }}
                                className="btn btn-outline"
                                style={{ padding: '0.35rem 0.5rem' }}
                                title="View Movement Ledger"
                              >
                                <History size={13} />
                              </button>
                            </>
                          )}

                          {/* Edit Item */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.5rem' }}
                            title="Edit Product"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showItemModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <div className="card" style={{
            maxWidth: '640px',
            width: '100%',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxHeight: '92vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {editingItem ? `Edit Product: ${editingItem.name}` : 'Add New Product / Service'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveItem}>
              {/* Type toggle */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, itemType: 'GOODS' })}
                  className={`btn ${formData.itemType === 'GOODS' ? 'btn-blue' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.45rem', fontSize: '12.5px' }}
                >
                  Physical Goods (Inventory Tracked)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, itemType: 'SERVICE' })}
                  className={`btn ${formData.itemType === 'SERVICE' ? 'btn-blue' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '0.45rem', fontSize: '12.5px' }}
                >
                  Services / Labour (Non-Inventory)
                </button>
              </div>

              {/* Item Name */}
              <div className="form-group">
                <label className="form-label">Item / Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomic Aluminium Laptop Stand"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* SKU & Barcode */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">SKU / Item Code</label>
                  <input
                    type="text"
                    placeholder="e.g. LAP-STD-01"
                    className="form-control"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Barcode (EAN/UPC)</label>
                    <span
                      onClick={generateEanBarcode}
                      style={{ fontSize: '11px', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}
                      title="Auto-generate standard 13-digit EAN barcode"
                    >
                      + Generate EAN
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 8901234567890"
                    className="form-control"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
              </div>

              {/* HSN & Category & UOM */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">HSN / SAC Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8471"
                    className="form-control"
                    value={formData.hsnSacCode}
                    onChange={(e) => setFormData({ ...formData, hsnSacCode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit of Measure (UOM)</label>
                  <select
                    className="form-control"
                    value={formData.uom}
                    onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="NOS">NOS (Numbers)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="KGS">KGS (Kilograms)</option>
                    <option value="GMS">GMS (Grams)</option>
                    <option value="LTR">LTR (Litres)</option>
                    <option value="MTR">MTR (Metres)</option>
                    <option value="PKT">PKT (Packets)</option>
                    <option value="SET">SET (Sets)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Peripherals"
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing & GST */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Cost / Purchase Price (₹)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    className="form-control"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    className="form-control"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Tax Rate *</label>
                  <select
                    className="form-control"
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) })}
                  >
                    <option value="0">0% (Nil / Exempt)</option>
                    <option value="5">5% (Essential Goods)</option>
                    <option value="12">12% (Standard Slab 1)</option>
                    <option value="18">18% (Standard Slab 2)</option>
                    <option value="28">28% (Luxury / High Tax)</option>
                  </select>
                </div>
              </div>

              {/* Stock Levels (Only for GOODS) */}
              {formData.itemType === 'GOODS' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">
                      {editingItem ? 'Current Stock Level' : 'Opening Stock Quantity'}
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Stock Reorder Alert</label>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      value={formData.minStockAlert}
                      onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Batch & Expiry Section */}
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginTop: '0.5rem',
                marginBottom: '1.25rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={formData.batchTrackingEnabled}
                    onChange={(e) => setFormData({ ...formData, batchTrackingEnabled: e.target.checked })}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Enable Lot / Batch & Expiry Date Tracking</span>
                </label>

                {formData.batchTrackingEnabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.85rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11.5px' }}>Lot / Batch Number</label>
                      <input
                        type="text"
                        placeholder="e.g. LOT-2026-B102"
                        className="form-control"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11.5px' }}>Expiry Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowItemModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <StockAdjustmentModal
          item={adjustingItem}
          onClose={() => setAdjustingItem(null)}
          onSuccess={(updated) => {
            if (updated) {
              setItems(items.map(i => i.id === updated.id ? { ...i, ...updated } : i));
            } else {
              loadItems();
            }
          }}
        />
      )}

      {/* Barcode Sticker Station Modal */}
      {showBarcodeStation && (
        <BarcodeStickerStation
          items={items.filter(i => i.itemType === 'GOODS')}
          selectedItem={barcodeStationItem}
          company={company}
          onClose={() => { setShowBarcodeStation(false); setBarcodeStationItem(null); }}
        />
      )}

      {/* Stock Movement Ledger Modal */}
      {showMovementLedger && (
        <StockMovementLedgerModal
          item={movementLedgerItem}
          onClose={() => { setShowMovementLedger(false); setMovementLedgerItem(null); }}
        />
      )}
    </div>
  );
}
