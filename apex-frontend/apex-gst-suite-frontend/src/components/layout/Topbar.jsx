import React, { useState } from 'react';
import { Search, Plus, Sun, Moon, Bell, Building2, LogOut, Globe, AlertTriangle, X } from 'lucide-react';

export default function Topbar({ company, currentUser, onLogout, onNewInvoice, onViewOrg, theme, toggleTheme }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <>
      <header className="topbar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.85rem',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Building2 size={16} color="#3b82f6" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {company?.tradeName || company?.legalName || 'Store Workspace'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                GST: {company?.gstin || 'Not Registered'}
              </span>
            </div>
          </div>

          <div className="input-addon" style={{ width: '260px' }}>
            <Search size={16} className="addon-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search invoices, items (Ctrl+K)..."
              style={{ height: '36px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onViewOrg && (
            <button
              onClick={onViewOrg}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '12px', gap: '0.4rem' }}
              title="View Apex Org Product Presentation Website"
            >
              <Globe size={15} color="#38bdf8" />
              <span>Apex Org Site</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#3b82f6" />}
          </button>

          <button
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', position: 'relative' }}
            title="Notifications"
          >
            <Bell size={17} />
            <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          </button>

          <button
            onClick={onNewInvoice}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '13px' }}
          >
            <Plus size={16} />
            <span>New Invoice</span>
          </button>

          {/* User Account & Logout Confirmation Trigger */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            paddingLeft: '0.5rem',
            borderLeft: '1px solid var(--border-subtle)'
          }}>
            <div
              title={currentUser?.email || 'Store User'}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
              }}
            >
              {getInitials(currentUser?.fullName || currentUser?.email)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.fullName || 'Store Admin'}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.email || 'admin'}
              </span>
            </div>

            {company?.isPreview || currentUser?.isPreview ? (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                Preview Mode
              </span>
            ) : (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="btn btn-secondary"
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#ef4444',
                  borderColor: 'rgba(239, 68, 68, 0.25)'
                }}
                title="Sign Out / Switch Store"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
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
            maxWidth: '430px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.65)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}>
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Confirm Sign Out
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Apex GST Suite
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
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

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Are you sure you want to sign out from <strong>{company?.tradeName || company?.legalName || 'your store workspace'}</strong>?
              You will need to sign in with your credentials to re-access this store.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '13px', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  padding: '0.65rem 1.25rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                <LogOut size={15} />
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
