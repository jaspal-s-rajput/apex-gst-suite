import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  FileText,
  Edit2,
  Trash2,
  Clock,
  CreditCard,
  X,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import PartyStatementModal from '../components/parties/PartyStatementModal';

const DEFAULT_PARTY_FORM = {
  name: '',
  gstin: '',
  partyType: 'CUSTOMER',
  stateCode: '27',
  stateName: 'Maharashtra',
  phone: '',
  email: '',
  billingAddress: '',
  shippingAddress: '',
  city: '',
  pincode: '',
  creditPeriodDays: 30,
  creditLimit: 0,
  openingBalance: 0
};

export default function PartiesPage({ company }) {
  const [parties, setParties] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [partyForm, setPartyForm] = useState(DEFAULT_PARTY_FORM);
  const [statementParty, setStatementParty] = useState(null);

  const [gstinCheckResult, setGstinCheckResult] = useState(null);
  const [checkingGstin, setCheckingGstin] = useState(false);

  useEffect(() => {
    loadParties();
  }, []);

  async function loadParties() {
    const list = await api.getParties();
    setParties(list || []);
  }

  // Live GSTIN verify on input
  const handleGstinChange = async (val) => {
    const upper = val.toUpperCase().trim();
    setPartyForm(prev => ({ ...prev, gstin: upper }));

    if (upper.length === 15) {
      setCheckingGstin(true);
      const res = await api.verifyGstin(upper);
      setGstinCheckResult(res);
      if (res.isValid && res.stateCode) {
        setPartyForm(prev => ({
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

  const handleOpenAdd = () => {
    setEditingPartyId(null);
    setPartyForm(DEFAULT_PARTY_FORM);
    setGstinCheckResult(null);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPartyId(p.id);
    setPartyForm({
      name: p.name || '',
      gstin: p.gstin || '',
      partyType: p.partyType || 'CUSTOMER',
      stateCode: p.stateCode || '27',
      stateName: p.stateName || 'Maharashtra',
      phone: p.phone || '',
      email: p.email || '',
      billingAddress: p.billingAddress || '',
      shippingAddress: p.shippingAddress || '',
      city: p.city || '',
      pincode: p.pincode || '',
      creditPeriodDays: p.creditPeriodDays !== undefined ? p.creditPeriodDays : 30,
      creditLimit: p.creditLimit !== undefined ? p.creditLimit : 0,
      openingBalance: p.openingBalance !== undefined ? p.openingBalance : 0
    });
    setGstinCheckResult(null);
    setShowModal(true);
  };

  const handleSaveParty = async (e) => {
    e.preventDefault();
    const payload = {
      ...partyForm,
      creditLimit: parseFloat(partyForm.creditLimit) || 0,
      creditPeriodDays: parseInt(partyForm.creditPeriodDays) || 30,
      openingBalance: parseFloat(partyForm.openingBalance) || 0
    };

    if (editingPartyId) {
      const updated = await api.updateParty({ ...payload, id: editingPartyId });
      setParties(parties.map(p => p.id === editingPartyId ? { ...p, ...updated } : p));
    } else {
      const created = await api.createParty(payload);
      setParties([...parties, created]);
    }

    setShowModal(false);
    setEditingPartyId(null);
    setPartyForm(DEFAULT_PARTY_FORM);
    setGstinCheckResult(null);
  };

  const handleDeleteParty = async (partyId, partyName) => {
    if (window.confirm(`Are you sure you want to deactivate party "${partyName}"?`)) {
      await api.deleteParty(partyId);
      setParties(parties.filter(p => p.id !== partyId));
    }
  };

  // Filter parties by tab and search
  const filtered = parties.filter(p => {
    // Search query
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.gstin && p.gstin.toLowerCase().includes(search.toLowerCase())) ||
      (p.phone && p.phone.includes(search));

    if (!matchSearch) return false;

    const balance = Number(p.currentBalance || 0);
    const limit = Number(p.creditLimit || 0);
    const isExceeded = limit > 0 && balance > limit;

    if (activeTab === 'CUSTOMERS') return p.partyType === 'CUSTOMER' || p.partyType === 'BOTH';
    if (activeTab === 'VENDORS') return p.partyType === 'VENDOR' || p.partyType === 'BOTH';
    if (activeTab === 'EXCEEDED') return isExceeded;
    if (activeTab === 'UNPAID') return balance > 0;
    return true;
  });

  // Calculate Tab Metrics
  const customerCount = parties.filter(p => p.partyType === 'CUSTOMER' || p.partyType === 'BOTH').length;
  const vendorCount = parties.filter(p => p.partyType === 'VENDOR' || p.partyType === 'BOTH').length;
  const exceededCount = parties.filter(p => Number(p.creditLimit || 0) > 0 && Number(p.currentBalance || 0) > Number(p.creditLimit)).length;
  const unpaidCount = parties.filter(p => Number(p.currentBalance || 0) > 0).length;

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Parties &amp; CRM</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Customer &amp; vendor directories, real-time GSTIN validation, account statements, and credit terms enforcement
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={16} /> Add Party (Client / Vendor)
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`btn ${activeTab === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '12.5px', padding: '0.4rem 0.8rem' }}
          >
            All Parties ({parties.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CUSTOMERS')}
            className={`btn ${activeTab === 'CUSTOMERS' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '12.5px', padding: '0.4rem 0.8rem' }}
          >
            Customers ({customerCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('VENDORS')}
            className={`btn ${activeTab === 'VENDORS' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '12.5px', padding: '0.4rem 0.8rem' }}
          >
            Vendors ({vendorCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EXCEEDED')}
            className={`btn ${activeTab === 'EXCEEDED' ? 'btn-primary' : 'btn-outline'}`}
            style={{
              fontSize: '12.5px',
              padding: '0.4rem 0.8rem',
              borderColor: exceededCount > 0 ? '#ef4444' : undefined,
              color: exceededCount > 0 && activeTab !== 'EXCEEDED' ? '#f87171' : undefined
            }}
          >
            ⚠️ Credit Limit Exceeded ({exceededCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('UNPAID')}
            className={`btn ${activeTab === 'UNPAID' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '12.5px', padding: '0.4rem 0.8rem' }}
          >
            With Outstanding ({unpaidCount})
          </button>
        </div>

        {/* Search input */}
        <div className="input-addon" style={{ width: '320px', margin: 0 }}>
          <Search size={16} className="addon-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search party by name, GSTIN or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Parties Directory Table */}
      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Party Name &amp; Terms</th>
                <th>Type</th>
                <th>GSTIN &amp; State</th>
                <th>Contact</th>
                <th>Credit Limit</th>
                <th style={{ textAlign: 'right' }}>Outstanding Balance</th>
                <th style={{ textAlign: 'center', width: '180px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Users size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                    <div>No parties found matching the selected filter or search term.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((party) => {
                  const currentBal = Number(party.currentBalance || 0);
                  const limit = Number(party.creditLimit || 0);
                  const isLimitExceeded = limit > 0 && currentBal > limit;
                  const excessAmount = isLimitExceeded ? currentBal - limit : 0;
                  const creditDays = party.creditPeriodDays || 30;

                  return (
                    <tr
                      key={party.id}
                      style={{
                        background: isLimitExceeded ? 'rgba(239, 68, 68, 0.04)' : undefined
                      }}
                    >
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                          {party.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <Clock size={11} />
                          <span>Terms: <strong>{creditDays} Days</strong></span>
                          {party.city && <span>&bull; {party.city}</span>}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge ${party.partyType === 'CUSTOMER' ? 'badge-paid' : 'badge-partial'}`}
                          style={{ fontSize: '10px', textTransform: 'uppercase' }}
                        >
                          {party.partyType || 'CUSTOMER'}
                        </span>
                      </td>

                      <td>
                        {party.gstin ? (
                          <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#60a5fa', fontSize: '12.5px' }}>
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
                            <Phone size={12} color="#60a5fa" />
                            <a href={`tel:${party.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {party.phone}
                            </a>
                          </div>
                        )}
                        {party.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            <Mail size={12} /> {party.email}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>
                          {limit > 0 ? `₹${limit.toLocaleString('en-IN')}` : <span style={{ color: 'var(--text-muted)' }}>No Limit</span>}
                        </div>
                        {limit > 0 && (
                          <div style={{ fontSize: '10.5px', color: isLimitExceeded ? '#f87171' : 'var(--text-muted)' }}>
                            {isLimitExceeded
                              ? '100% Utilized'
                              : `${Math.round((currentBal / limit) * 100)}% Used`}
                          </div>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '14px',
                            color: currentBal > 0 ? '#f87171' : '#34d399'
                          }}
                        >
                          ₹{currentBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>

                        {/* Credit Limit Alert Badge */}
                        {isLimitExceeded ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '10px',
                              fontWeight: 700,
                              color: '#ef4444',
                              background: 'rgba(239, 68, 68, 0.12)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              marginTop: '3px',
                              border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                            title={`Credit limit of ₹${limit.toLocaleString('en-IN')} exceeded by ₹${excessAmount.toLocaleString('en-IN')}`}
                          >
                            <ShieldAlert size={11} /> Over by ₹{excessAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                          </div>
                        ) : limit > 0 && currentBal > 0 ? (
                          <div style={{ fontSize: '10.5px', color: '#34d399', marginTop: '2px' }}>
                            ₹{(limit - currentBal).toLocaleString('en-IN', { minimumFractionDigits: 0 })} available
                          </div>
                        ) : null}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => setStatementParty(party)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.55rem', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}
                            title="View Transaction History & Account Statement"
                          >
                            <FileText size={13} color="#60a5fa" />
                            <span>Statement</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(party)}
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '11px' }}
                            title="Edit Party Details & Credit Terms"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteParty(party.id, party.name)}
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.5rem', fontSize: '11px', color: '#f87171' }}
                            title="Deactivate Party"
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

      {/* Add / Edit Party Modal with Credit Terms & GSTIN Validation */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: 'var(--bg-card, #111827)',
              borderRadius: 'var(--radius-lg, 12px)',
              maxWidth: '680px',
              width: '100%',
              padding: '1.75rem',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {editingPartyId ? 'Edit Party & Credit Terms' : 'Add Customer / Vendor'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveParty}>
              {/* Row 1: Legal Name & Party Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Party Legal Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Acme Technologies Pvt Ltd"
                    value={partyForm.name}
                    onChange={(e) => setPartyForm({ ...partyForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Party Type</label>
                  <select
                    className="form-control"
                    value={partyForm.partyType}
                    onChange={(e) => setPartyForm({ ...partyForm, partyType: e.target.value })}
                  >
                    <option value="CUSTOMER">Customer (Client)</option>
                    <option value="VENDOR">Vendor (Supplier)</option>
                    <option value="BOTH">Both (Client &amp; Supplier)</option>
                  </select>
                </div>
              </div>

              {/* GSTIN Field with Live Checksum Result */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">15-Digit GSTIN (Optional for Retail B2C / Unregistered)</label>
                <input
                  type="text"
                  maxLength="15"
                  className="form-control"
                  placeholder="e.g. 27AAACR5055K1ZK"
                  value={partyForm.gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />

                {gstinCheckResult && (
                  <div
                    style={{
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
                    }}
                  >
                    {gstinCheckResult.isValid ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    <span>
                      {gstinCheckResult.message} &bull; State: {gstinCheckResult.stateName} ({gstinCheckResult.stateCode})
                    </span>
                  </div>
                )}
              </div>

              {/* Credit Limit & Terms Section */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--radius-md, 8px)',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={15} /> Credit Limit &amp; Payment Terms Policy
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11.5px' }}>Credit Limit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      className="form-control"
                      placeholder="e.g. 50000 (0 for no limit)"
                      value={partyForm.creditLimit}
                      onChange={(e) => setPartyForm({ ...partyForm, creditLimit: e.target.value })}
                    />
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Max unpaid balance allowed
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11.5px' }}>Payment Terms (Days)</label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      className="form-control"
                      placeholder="e.g. 30"
                      value={partyForm.creditPeriodDays}
                      onChange={(e) => setPartyForm({ ...partyForm, creditPeriodDays: e.target.value })}
                    />
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Days allowed before overdue
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '11.5px' }}>Opening Balance (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      value={partyForm.openingBalance}
                      onChange={(e) => setPartyForm({ ...partyForm, openingBalance: e.target.value })}
                    />
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Prior balance brought forward
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. +91 98765 43210"
                    value={partyForm.phone}
                    onChange={(e) => setPartyForm({ ...partyForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. billing@acme.com"
                    value={partyForm.email}
                    onChange={(e) => setPartyForm({ ...partyForm, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Billing Address</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Street, Building, Landmark..."
                  value={partyForm.billingAddress}
                  onChange={(e) => setPartyForm({ ...partyForm, billingAddress: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mumbai"
                    value={partyForm.city}
                    onChange={(e) => setPartyForm({ ...partyForm, city: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    maxLength="6"
                    className="form-control"
                    placeholder="e.g. 400001"
                    value={partyForm.pincode}
                    onChange={(e) => setPartyForm({ ...partyForm, pincode: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '120px' }}>
                  {editingPartyId ? 'Save Changes' : 'Create Party'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statement & Ledger Modal */}
      {statementParty && (
        <PartyStatementModal
          party={statementParty}
          company={company}
          onClose={() => {
            setStatementParty(null);
            loadParties(); // Refresh balances after viewing
          }}
        />
      )}
    </div>
  );
}
