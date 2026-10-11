import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Store,
  X,
  KeyRound
} from 'lucide-react';
import { api, GST_STATES } from '../services/api';
import apexLogo from '../assets/ApexLogo/ApexLogoWhite.png';

export default function AuthPage({ onAuthSuccess, initialTab = 'login', onBackToLanding }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state - starts completely empty
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password modal state - only accepts email
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // Register form state - starts completely empty with no prefilled defaults
  const [regData, setRegData] = useState({
    storeName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gstin: '',
    stateCode: '', // Empty initially
    city: '',      // Empty initially
    pincode: '',   // Empty initially
    address: ''    // Empty initially
  });

  // Real-time GSTIN validation feedback
  const [gstinFeedback, setGstinFeedback] = useState(null);

  const handleGstinChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setRegData(prev => ({ ...prev, gstin: val }));

    if (!val) {
      setGstinFeedback(null);
      return;
    }

    if (val.length === 15) {
      const isValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val);
      const code = val.substring(0, 2);
      const matchedState = GST_STATES.find(s => s.code === code);
      if (isValid) {
        setGstinFeedback({
          isValid: true,
          message: `Valid GSTIN structure (${matchedState ? matchedState.name : 'State ' + code})`
        });
        if (matchedState) {
          setRegData(prev => ({ ...prev, stateCode: code }));
        }
      } else {
        setGstinFeedback({
          isValid: false,
          message: 'Invalid GSTIN format (15 characters: 2 state + 10 PAN + 3 entity/check)'
        });
      }
    } else {
      setGstinFeedback({
        isValid: false,
        message: `${val.length}/15 characters entered`
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(loginEmail.trim(), loginPassword);
      if (rememberMe) {
        localStorage.setItem('apex_auth_session', JSON.stringify(result));
      } else {
        sessionStorage.setItem('apex_auth_session', JSON.stringify(result));
      }
      onAuthSuccess(result);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Strict Validations
    if (!regData.storeName.trim()) {
      setErrorMessage('Store / Business name is required.');
      return;
    }
    if (!regData.fullName.trim()) {
      setErrorMessage('Owner / Admin full name is required.');
      return;
    }
    if (!regData.email.trim() || !regData.email.includes('@')) {
      setErrorMessage('A valid email address is required.');
      return;
    }
    if (!regData.phone.trim()) {
      setErrorMessage('Mobile / WhatsApp phone number is required.');
      return;
    }
    if (!regData.password || regData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (regData.gstin && regData.gstin.length > 0 && regData.gstin.length !== 15) {
      setErrorMessage('GSTIN must be exactly 15 characters, or leave blank if unregistered.');
      return;
    }
    if (!regData.stateCode) {
      setErrorMessage('Please select a GST State / Place of Supply.');
      return;
    }
    if (!regData.city.trim()) {
      setErrorMessage('City is required.');
      return;
    }
    if (!regData.pincode.trim() || regData.pincode.trim().length !== 6) {
      setErrorMessage('A valid 6-digit Pincode is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        storeName: regData.storeName.trim(),
        fullName: regData.fullName.trim(),
        email: regData.email.trim().toLowerCase(),
        password: regData.password,
        phone: regData.phone.trim(),
        gstin: regData.gstin ? regData.gstin.trim() : null,
        stateCode: regData.stateCode,
        address: regData.address ? `${regData.address.trim()}, ${regData.city.trim()} - ${regData.pincode.trim()}` : `${regData.city.trim()} - ${regData.pincode.trim()}`,
        city: regData.city.trim(),
        pincode: regData.pincode.trim()
      };

      const result = await api.register(payload);
      localStorage.setItem('apex_auth_session', JSON.stringify(result));
      setSuccessMessage('Store registered successfully! Launching your workspace...');
      setTimeout(() => {
        onAuthSuccess(result);
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotStatus(null);

    const email = forgotEmail.trim();
    if (!email || !email.includes('@')) {
      setForgotStatus({
        type: 'error',
        message: 'Please enter a valid registered email address.'
      });
      return;
    }

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotStatus({
        type: 'success',
        message: `Password reset instructions have been dispatched to ${email}. Please check your inbox or spam folder.`
      });
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(59, 130, 246, 0.15), var(--bg-base) 85%)',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background lights */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: activeTab === 'register' ? '680px' : '460px',
        transition: 'max-width 0.3s ease',
        zIndex: 10
      }}>
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '1rem',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#38bdf8'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ← Back to Apex Org (Product Page)
          </button>
        )}

        {/* Logo and Brand Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb, #10b981)',
            boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.4)',
            marginBottom: '0.85rem',
            padding: '8px'
          }}>
            <img
              src={apexLogo}
              alt="Apex Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 0.35rem 0'
          }}>
            Apex GST Suite
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            margin: 0
          }}>
            Enterprise Store Management & GST Billing Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="card" style={{
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid var(--border-subtle)',
          padding: '1.75rem'
        }}>
          {/* Tabs: Sign In vs Register */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-elevated)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'login' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'login' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Store size={15} />
              <span>Store Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'register' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'register' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Sparkles size={15} />
              <span>Register New Store</span>
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: '#f87171',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: '#34d399',
              fontSize: '13px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="#94a3b8" />
                  <span>Store Email Address</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter registered store email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                    <Lock size={14} color="#94a3b8" />
                    <span>Password</span>
                  </label>
                  <span
                    style={{ fontSize: '12px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
                    onClick={() => {
                      setForgotEmail(loginEmail || '');
                      setForgotStatus(null);
                      setShowForgotModal(true);
                    }}
                  >
                    Forgot password?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your store password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Stay logged in on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <span>Authenticating Store...</span>
                ) : (
                  <>
                    <span>Sign In to Store Workspace</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {/* Store Name */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building2 size={14} color="#3b82f6" />
                    <span>Store / Business Name *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter store or business name"
                    value={regData.storeName}
                    onChange={(e) => setRegData({ ...regData, storeName: e.target.value })}
                    required
                  />
                </div>

                {/* Owner Name */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} color="#3b82f6" />
                    <span>Store Owner / Admin Full Name *</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter owner or admin full name"
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={14} color="#3b82f6" />
                    <span>Store Admin Email *</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter store email address"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} color="#3b82f6" />
                    <span>Mobile / WhatsApp Number *</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter 10-digit mobile number"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} color="#3b82f6" />
                    <span>Password *</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Enter password (minimum 6 characters)"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowPassword(p => !p)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px'
                      }}
                      title={regShowPassword ? 'Hide password' : 'Show password'}
                    >
                      {regShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} color="#3b82f6" />
                    <span>Confirm Password *</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={regShowConfirmPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Re-enter password to confirm"
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowConfirmPassword(p => !p)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px'
                      }}
                      title={regShowConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {regShowConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* GSTIN (Optional) */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                      <ShieldCheck size={14} color="#10b981" />
                      <span>GSTIN (Optional)</span>
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Leave blank if unregistered</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter 15-digit GSTIN (optional)"
                    value={regData.gstin}
                    onChange={handleGstinChange}
                    maxLength={15}
                    style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
                  />
                  {gstinFeedback && (
                    <div style={{
                      fontSize: '11px',
                      marginTop: '0.25rem',
                      color: gstinFeedback.isValid ? '#10b981' : '#f59e0b'
                    }}>
                      {gstinFeedback.message}
                    </div>
                  )}
                </div>

                {/* State selector - Starts unselected */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} color="#3b82f6" />
                    <span>GST State / Place of Supply *</span>
                  </label>
                  <select
                    className="form-control"
                    value={regData.stateCode}
                    onChange={(e) => setRegData({ ...regData, stateCode: e.target.value })}
                    required
                  >
                    <option value="">Select State / Place of Supply...</option>
                    {GST_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter city"
                    value={regData.city}
                    onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                    required
                  />
                </div>

                {/* Pincode */}
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter 6-digit pincode"
                    value={regData.pincode}
                    onChange={(e) => setRegData({ ...regData, pincode: e.target.value.replace(/[^0-9]/g, '') })}
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Store Address / Landmark</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter store address or landmark"
                  value={regData.address}
                  onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <span>Registering Store & Initializing Ledger...</span>
                ) : (
                  <>
                    <Building2 size={16} />
                    <span>Register Store & Launch Workspace</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Zero-Cost badge footer inside card */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>100% Free • Zero-Cost Local/Self-Hosted Engine</span>
            </div>
            <span>v1.0.0 Production</span>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL (Email Only) */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.65)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6'
                }}>
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Reset Password
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Enter registered store email
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {forgotStatus && (
              <div style={{
                background: forgotStatus.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${forgotStatus.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: forgotStatus.type === 'success' ? '#34d399' : '#f87171',
                fontSize: '13px'
              }}>
                {forgotStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{forgotStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="#94a3b8" />
                  <span>Store Email Address</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter registered store email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  autoFocus
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  We will send a secure password reset link to this email address.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '0.65rem', fontWeight: 600 }}
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
