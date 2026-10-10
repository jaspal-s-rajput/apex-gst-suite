import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertTriangle, Barcode, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function InventoryPage({ company }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
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
    minStockAlert: 5
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const list = await api.getItems();
    setItems(list);
  }

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const created = await api.createItem({
      ...newItem,
      purchasePrice: parseFloat(newItem.purchasePrice) || 0,
      sellingPrice: parseFloat(newItem.sellingPrice) || 0,
      currentStock: parseFloat(newItem.currentStock) || 0,
      minStockAlert: parseFloat(newItem.minStockAlert) || 5,
      gstRate: parseFloat(newItem.gstRate) || 18.00
    });
    setItems([...items, created]);
    setShowAddModal(false);
    setNewItem({
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
      minStockAlert: 5
    });
  };

  const filtered = items.filter(i => 
    !search || 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    (i.barcode && i.barcode.includes(search)) ||
    (i.sku && i.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Inventory & Stock Master</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Products, services, HSN tax classifications, and stock alerts
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Product / Service
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="input-addon">
          <Search size={16} className="addon-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name, SKU, or scan barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU / Barcode</th>
                <th>HSN / SAC</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Cost (₹)</th>
                <th style={{ textAlign: 'right' }}>Selling Price (₹)</th>
                <th style={{ textAlign: 'center' }}>GST Slab</th>
                <th style={{ textAlign: 'center' }}>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isLow = item.itemType === 'GOODS' && item.currentStock <= item.minStockAlert;
                const isOut = item.itemType === 'GOODS' && item.currentStock === 0;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.itemType}</div>
                    </td>
                    <td>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{item.sku || '—'}</div>
                      {item.barcode && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <Barcode size={12} /> {item.barcode}
                        </div>
                      )}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{item.hsnSacCode}</td>
                    <td>{item.category || 'General'}</td>
                    <td style={{ textAlign: 'right' }}>₹{Number(item.purchasePrice || 0).toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#3b82f6' }}>
                      ₹{Number(item.sellingPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.gstRate}%</td>
                    <td style={{ textAlign: 'center' }}>
                      {item.itemType === 'SERVICE' ? (
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Service N/A</span>
                      ) : (
                        <span className={`badge ${isOut ? 'badge-unpaid' : isLow ? 'badge-partial' : 'badge-paid'}`}>
                          {item.currentStock} {item.uom} {isLow && '⚠️'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '550px', width: '100%', padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add New Product / Service</h3>
            
            <form onSubmit={handleSaveItem}>
              <div className="form-group">
                <label className="form-label">Item Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-control" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">HSN / SAC Code *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-control" 
                    value={newItem.hsnSacCode} 
                    onChange={(e) => setNewItem({ ...newItem, hsnSacCode: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Barcode (EAN/UPC)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newItem.barcode} 
                    onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    required 
                    className="form-control" 
                    value={newItem.sellingPrice} 
                    onChange={(e) => setNewItem({ ...newItem, sellingPrice: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Tax Rate *</label>
                  <select 
                    className="form-control" 
                    value={newItem.gstRate} 
                    onChange={(e) => setNewItem({ ...newItem, gstRate: parseFloat(e.target.value) })}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Opening Stock Qty</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newItem.currentStock} 
                    onChange={(e) => setNewItem({ ...newItem, currentStock: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Stock Alert Level</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={newItem.minStockAlert} 
                    onChange={(e) => setNewItem({ ...newItem, minStockAlert: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
