import React, { useState } from 'react';
import {
  Settings,
  Building2,
  QrCode,
  CreditCard,
  Save,
  CheckCircle2,
  User,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { GST_STATES, api } from '../services/api';

export default function SettingsPage({ company, currentUser, onUpdateCompany, onUpdateUser }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('company'); // 'company' | 'banking' | 'profile'

  // Company and Banking Form State
  const [formData, setFormData] = useState({
    legalName: company?.legalName || 'Apex Enterprises Pvt Ltd',
    tradeName: company?.tradeName || 'Apex Solutions',
    gstin: company?.gstin || '',
    pan: company?.pan || '',
    stateCode: company?.stateCode || '27',
    stateName: company?.stateName || 'Maharashtra',
    addressLine1: company?.addressLine1 || '',
    city: company?.city || '',
    pincode: company?.pincode || '',
    phone: company?.phone || '',
    email: company?.email || '',
    upiId: company?.upiId || '',
    bankName: company?.bankName || '',
    accountNumber: company?.accountNumber || '',
    ifscCode: company?.ifscCode || '',
    branchName: company?.branchName || '',
    invoicePrefix: company?.invoicePrefix || 'INV/26-27',
    nextInvoiceSequence: company?.nextInvoiceSequence || 101
  });

  // Store Owner Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Handle State Code Change & Auto sync State Name
  const handleStateChange = (code) => {
    const found = GST_STATES.find(s => s.code === code);
    setFormData(prev => ({
      ...prev,
      stateCode: code,
      stateName: found ? found.name : prev.stateName
    }));
  };

  // Submit Business & Banking Settings
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateCompany(formData);
      if (onUpdateCompany) {
        onUpdateCompany(updated);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Profile Changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (!profileData.fullName.trim()) {
      setProfileError('Full name is required.');
      return;
    }
    if (!profileData.email.trim()) {
      setProfileError('Email address is required.');
      return;
    }
    if (profileData.newPassword) {
      if (profileData.newPassword.length < 6) {
        setProfileError('New password must be at least 6 characters.');
        return;
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        setProfileError('New passwords do not match.');
        return;
      }
    }

    try {
      const payload = {
        fullName: profileData.fullName.trim(),
        email: profileData.email.trim().toLowerCase(),
        phone: profileData.phone.trim()
      };
      if (profileData.newPassword) {
        payload.newPassword = profileData.newPassword;
      }

      const updatedUser = await api.updateCurrentUser(payload);
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }

      setProfileSuccess(true);
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Store & Account Settings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Manage your store identity, NPCI UPI & banking setup, invoice prefix sequence, and owner profile.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem',
        paddingBottom: '0.25rem'
      }}>
        <button
          type="button"
          onClick={() => setActiveSettingsTab('company')}
          className={`btn ${activeSettingsTab === 'company' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            padding: '0.55rem 1rem',
            fontSize: '13px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          <Building2 size={16} />
          <span>Business & Tax Master</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab('banking')}
          className={`btn ${activeSettingsTab === 'banking' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            padding: '0.55rem 1rem',
            fontSize: '13px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          <QrCode size={16} />
          <span>UPI & Bank Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsTab('profile')}
          className={`btn ${activeSettingsTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            padding: '0.55rem 1rem',
            fontSize: '13px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem'
          }}
        >
          <User size={16} />
          <span>Owner Profile Edit</span>
        </button>
      </div>

      {/* TAB 1: Business Profile */}
      {activeSettingsTab === 'company' && (
        <form onSubmit={handleCompanySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px' }}>
          {savedSuccess && (
            <div className="alert-banner alert-warning" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <strong>Business settings and invoice sequence updated successfully!</strong>
              </div>
            </div>
          )}

          {/* Company Identity */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa' }}>
              <Building2 size={18} /> 1. Company Profile & Tax Master
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Legal Name (As on GST / Registration Certificate) *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Trade / Brand Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">GSTIN (15 Characters)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Optional if unregistered"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  maxLength={15}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">PAN Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ABCDE1234F"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  maxLength={10}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Default State Code (POS) *</label>
                <select
                  className="form-control"
                  value={formData.stateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                >
                  {GST_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Registered Office Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                placeholder="Shop/Office number, Street, Landmark"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
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
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                  maxLength={6}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Store Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Invoice Numbering Prefix */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#a78bfa' }}>
              2. Invoice Series & Serial Sequence
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '1rem' }}>
              Customize the invoice numbering prefix applied to your sales and tax bills.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Invoice Series Prefix</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.invoicePrefix}
                  onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                  placeholder="e.g. APEX/26-27 or STORE/26-27"
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
            <Save size={16} /> Save Business Profile
          </button>
        </form>
      )}

      {/* TAB 2: UPI & Banking Configuration */}
      {activeSettingsTab === 'banking' && (
        <form onSubmit={handleCompanySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '880px' }}>
          {savedSuccess && (
            <div className="alert-banner alert-warning" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <strong>UPI & Bank Credentials saved successfully!</strong>
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
              <QrCode size={18} /> NPCI Dynamic UPI QR Configuration
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '1.25rem' }}>
              This UPI Virtual Payment Address (VPA) automatically encodes into invoices, POS thermal slips, and PDFs so customers can scan and pay instantly via Google Pay, PhonePe, Paytm, or BHIM.
            </p>

            <div className="form-group">
              <label className="form-label">Merchant UPI ID (VPA) *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. yourstore@okhdfcbank or business@upi"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Payload preview: <code style={{ color: '#38bdf8' }}>upi://pay?pa={formData.upiId || 'yourid@upi'}&pn={encodeURIComponent(formData.tradeName || 'Store')}&cu=INR</code>
              </span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
              <CreditCard size={18} /> Bank Account Details for NEFT / RTGS / IMPS
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '1.25rem' }}>
              These bank details are printed in the payment instructions footer on all B2B Tax Invoices.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. HDFC Bank, State Bank of India, ICICI Bank"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 50200098855544"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div className="form-group">
                <label className="form-label">Bank IFSC Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. HDFC0001234"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                  style={{ fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Branch Name / Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Main Market Branch"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 1.75rem' }}>
            <Save size={16} /> Save UPI & Bank Credentials
          </button>
        </form>
      )}

      {/* TAB 3: Store Owner Profile Edit (No image required) */}
      {activeSettingsTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px' }}>
          {profileSuccess && (
            <div className="alert-banner alert-warning" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#34d399' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <strong>Store owner profile updated successfully!</strong>
              </div>
            </div>
          )}

          {profileError && (
            <div className="alert-banner alert-warning" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#f87171' }}>
              <div>{profileError}</div>
            </div>
          )}

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 700
              }}>
                {(profileData.fullName || 'Admin').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  {profileData.fullName || 'Store Owner Profile'}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Administrator • {company?.tradeName || 'Apex Store'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="#3b82f6" />
                  <span>Owner Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="#3b82f6" />
                  <span>Login Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="#3b82f6" />
                  <span>Mobile / Contact Phone</span>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
              <KeyRound size={18} /> Change Password (Optional)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '1.25rem' }}>
              Leave blank if you do not want to change your current password.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter new password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Confirm new password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 1.75rem' }}>
            <Save size={16} /> Update Owner Profile
          </button>
        </form>
      )}
    </div>
  );
}
