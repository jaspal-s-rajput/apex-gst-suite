import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, ShieldCheck, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function PartiesPage({ company }) {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newParty, setNewParty] = useState({
    name: '',
    gstin: '',
    partyType: 'CUSTOMER',
    stateCode: '27',
    stateName: 'Maharashtra',
    phone: '',
    email: '',
    billingAddress: '',
    creditPeriodDays: 30
  });

  const [gstinCheckResult, setGstinCheckResult] = useState(null);
  const [checkingGstin, setCheckingGstin] = useState(false);

  useEffect(() => {
    loadParties();
  }, []);

  async function loadParties() {
    const list = await api.getParties();
    setParties(list);
  }

  // Live GSTIN verify on input
  const handleGstinChange = async (val) => {
    const upper = val.toUpperCase().trim();
    setNewParty(prev => ({ ...prev, gstin: upper }));

    if (upper.length === 15) {
      setCheckingGstin(true);
      const res = await api.verifyGstin(upper);
      setGstinCheckResult(res);
      if (res.isValid && res.stateCode) {
        setNewParty(prev => ({
          ...prev,
          stateCode: res.stateCode,
          stateName: res.stateName
        }));
      }
      setCheckingGstin(false);
    } else {
      setGstinCheckResult(null);
    }
  };

  const handleSaveParty = async (e) => {
    e.preventDefault();
    const created = await api.createParty(newParty);
    setParties([...parties, created]);
    setShowAddModal(false);
    setNewParty({
      name: '',
      gstin: '',
      partyType: 'CUSTOMER',
      stateCode: '27',
      stateName: 'Maharashtra',
      phone: '',
      email: '',
      billingAddress: '',
      creditPeriodDays: 30
    });
    setGstinCheckResult(null);
  };

  const filtered = parties.filter(p => 
    !search || 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.gstin && p.gstin.includes(search))
  );

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Parties & CRM</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Customers, registered vendors, live GSTIN verification, and account balances
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Party (Client / Vendor)
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="input-addon">
          <Search size={16} className="addon-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search party by business name or GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Party Name</th>
                <th>Type</th>
                <th>GSTIN & State</th>
                <th>Contact</th>
                <th>Billing Address</th>
                <th style={{ textAlign: 'right' }}>Outstanding Balance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((party) => (
                <tr key={party.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{party.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Credit: {party.creditPeriodDays || 30} days</div>
                  </td>
                  <td>
                    <span className={`badge ${party.partyType === 'CUSTOMER' ? 'badge-paid' : 'badge-partial'}`} style={{ fontSize: '10px' }}>
                      {party.partyType}
                    </span>
                  </td>
                  <td>
                    {party.gstin ? (
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#60a5fa' }}>
                          {party.gstin}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {party.stateName} ({party.stateCode})
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Consumer / Unregistered</span>
                    )}
                  </td>
                  <td>
                    {party.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px' }}>
                        <Phone size={12} /> {party.phone}
                      </div>
                    )}
                    {party.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <Mail size={12} /> {party.email}
                      </div>
                    )}
                  </td>
                  <td style={{ maxWidth: '220px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {party.billingAddress || 'Local Address'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: party.currentBalance > 0 ? '#f87171' : '#34d399' }}>
                    ₹{Number(party.currentBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Party Modal with Live GSTIN Verification */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '580px', width: '100%', padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add Customer / Vendor</h3>

            <form onSubmit={handleSaveParty}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Party Legal Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Party Type</label>
                  <select
                    className="form-control"
                    value={newParty.partyType}
                    onChange={(e) => setNewParty({ ...newParty, partyType: e.target.value })}
                  >
                    <option value="CUSTOMER">Customer (Client)</option>
                    <option value="VENDOR">Vendor (Supplier)</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
              </div>

              {/* GSTIN Field with Live Checksum Result */}
              <div className="form-group">
                <label className="form-label">15-Digit GSTIN (Optional for Retail B2C)</label>
                <input
                  type="text"
                  maxLength="15"
                  className="form-control"
                  placeholder="e.g. 27AAACR5055K1ZK"
                  value={newParty.gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />

                {gstinCheckResult && (
                  <div style={{ 
                    marginTop: '0.4rem', 
                    padding: '0.5rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '12px',
                    background: gstinCheckResult.isValid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    color: gstinCheckResult.isValid ? '#34d399' : '#f87171',
                    border: `1px solid ${gstinCheckResult.isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    {gstinCheckResult.isValid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>{gstinCheckResult.message} &nbsp;|&nbsp; State: {gstinCheckResult.stateName} ({gstinCheckResult.stateCode})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newParty.phone}
                    onChange={(e) => setNewParty({ ...newParty, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newParty.email}
                    onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Billing Address</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={newParty.billingAddress}
                  onChange={(e) => setNewParty({ ...newParty, billingAddress: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
