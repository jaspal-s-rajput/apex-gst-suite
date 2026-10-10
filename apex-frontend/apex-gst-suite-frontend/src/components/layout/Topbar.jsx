import React from 'react';
import { Search, Plus, Sun, Moon, Bell, Building2, LogOut, User, Globe } from 'lucide-react';

export default function Topbar({ company, currentUser, onLogout, onNewInvoice, onViewOrg, theme, toggleTheme }) {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
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
              {company?.tradeName || company?.legalName || 'Premium Electronics'}
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

        {/* User Account / Sign Out Section */}
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

          <button
            onClick={onLogout}
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
        </div>
      </div>
    </header>
  );
}
