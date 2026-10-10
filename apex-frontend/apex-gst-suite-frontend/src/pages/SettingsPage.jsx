import React, { useState } from 'react';
import { Settings, Building2, QrCode, CreditCard, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage({ company, onUpdateCompany }) {
  const [formData, setFormData] = useState({
    legalName: company?.legalName || 'Apex Enterprises Pvt Ltd',
    tradeName: company?.tradeName || 'Apex Solutions',
    gstin: company?.gstin || '27AAPFU0939F1ZV',
    pan: company?.pan || 'AAPFU0939F',
    stateCode: company?.stateCode || '27',
    stateName: company?.stateName || 'Maharashtra',
    addressLine1: company?.addressLine1 || 'Plot 42, Tech Park Avenue, Andheri East',
    city: company?.city || 'Mumbai',
    pincode: company?.pincode || '400069',
    phone: company?.phone || '+91 98765 43210',
    email: company?.email || 'billing@apexsuite.in',
    upiId: company?.upiId || 'apexsolutions@upi',
    bankName: company?.bankName || 'HDFC Bank',
    accountNumber: company?.accountNumber || '50200012345678',
    ifscCode: company?.ifscCode || 'HDFC0001234',
    branchName: company?.branchName || 'Andheri East Branch',
    invoicePrefix: company?.invoicePrefix || 'APEX/26-27',
    nextInvoiceSequence: company?.nextInvoiceSequence || 105
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateCompany) {
      onUpdateCompany(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Business Settings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Company profile, GSTIN jurisdiction, banking details, and dynamic UPI QR configuration
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-banner alert-warning" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#34d399' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <strong>Settings saved successfully!</strong>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px' }}>
        
        {/* Company Identity */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa' }}>
            <Building2 size={18} /> 1. Company Profile & Tax Master
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Legal Name (As on GST Certificate) *</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trade / Brand Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">GSTIN (15-Characters) *</label>
              <input
                type="text"
                required
                className="form-control"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State Code (Default Supply)</label>
              <select
                className="form-control"
                value={formData.stateCode}
                onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
              >
                <option value="27">27 - Maharashtra</option>
                <option value="29">29 - Karnataka</option>
                <option value="24">24 - Gujarat</option>
                <option value="07">07 - Delhi</option>
                <option value="33">33 - Tamil Nadu</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Registered Office Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-control"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Banking & Dynamic UPI */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <QrCode size={18} /> 2. Dynamic NPCI UPI QR & Banking Configuration
          </h3>

          <div className="form-group">
            <label className="form-label">Merchant UPI ID (VPA) for Invoices *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. yourname@hdfcbank or business@upi"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              This UPI ID generates the QR code printed on your invoices for instant scan-and-pay.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                className="form-control"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Branch Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.branchName}
                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Invoice Numbering Prefix */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#a78bfa' }}>
            3. Invoice Numbering Sequence
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Invoice Series Prefix</label>
              <input
                type="text"
                className="form-control"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                placeholder="e.g. APEX/26-27"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Next Sequence Number</label>
              <input
                type="number"
                className="form-control"
                value={formData.nextInvoiceSequence}
                onChange={(e) => setFormData({ ...formData, nextInvoiceSequence: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 1.75rem' }}>
          <Save size={16} /> Save All Settings
        </button>
      </form>
    </div>
  );
}
