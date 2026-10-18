import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Phone,
  Mail,
  RefreshCw,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';

export default function PartyStatementModal({ party, company, onClose }) {
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  useEffect(() => {
    if (party?.id) {
      loadStatement();
    }
  }, [party?.id]);

  async function loadStatement(from = null, to = null) {
    setLoading(true);
    try {
      const data = await api.getPartyStatement(party.id, from, to);
      setStatement(data);
    } catch (err) {
      console.error('Failed to load party statement:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDatePreset = (preset) => {
    setDateFilter(preset);
    const now = new Date();
    let from = null;
    let to = now.toISOString().slice(0, 10);

    if (preset === '30DAYS') {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      from = past.toISOString().slice(0, 10);
    } else if (preset === 'QUARTER') {
      const past = new Date();
      past.setDate(past.getDate() - 90);
      from = past.toISOString().slice(0, 10);
    } else if (preset === 'FY') {
      const curYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      from = `${curYear}-04-01`;
      to = `${curYear + 1}-03-31`;
    }

    setCustomFrom(from || '');
    setCustomTo(to || '');
    loadStatement(from, to);
  };

  const handleApplyCustomDates = (e) => {
    e.preventDefault();
    setDateFilter('CUSTOM');
    loadStatement(customFrom || null, customTo || null);
  };

  // Download statement as CSV
  const handleExportCSV = () => {
    if (!statement || !statement.entries || statement.entries.length === 0) {
      alert('No ledger transactions to export.');
      return;
    }

    const headers = ['Date', 'Reference #', 'Type', 'Description', 'Due Date', 'Debit (INR)', 'Credit (INR)', 'Running Balance (INR)', 'Status'];
    const rows = statement.entries.map(e => [
      e.date || '',
      `"${e.referenceNumber || ''}"`,
      `"${e.type || ''}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      e.dueDate || '',
      Number(e.debit || 0).toFixed(2),
      Number(e.credit || 0).toFixed(2),
      Number(e.balance || 0).toFixed(2),
      e.status || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const safeName = (party?.name || 'Party').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Party_Ledger_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!party) return null;

  const entries = statement?.entries || [];
  const filteredEntries = entries.filter(e => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (e.referenceNumber && e.referenceNumber.toLowerCase().includes(term)) ||
      (e.description && e.description.toLowerCase().includes(term)) ||
      (e.type && e.type.toLowerCase().includes(term))
    );
  });

  const creditLimit = Number(statement?.creditLimit || party.creditLimit || 0);
  const closingBalance = Number(statement?.closingBalance !== undefined ? statement.closingBalance : (party.currentBalance || 0));
  const creditPeriodDays = Number(statement?.creditPeriodDays || party.creditPeriodDays || 30);
  const isExceeded = creditLimit > 0 && closingBalance > creditLimit;
  const excessAmount = isExceeded ? closingBalance - creditLimit : 0;
  const overdueAmount = Number(statement?.overdueAmount || 0);
  const overdueCount = Number(statement?.overdueInvoicesCount || 0);
  const availableCredit = Math.max(0, creditLimit - closingBalance);

  return (
    <div
      className="party-statement-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        id="party-statement-print-area"
        style={{
          backgroundColor: 'var(--bg-card, #111827)',
          color: 'var(--text-primary, #f9fafb)',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Top Header (Screen only) */}
        <div
          className="no-print"
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(17, 24, 39, 0.85)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.35))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {party.name}
                </h3>
                <span
                  className={`badge ${party.partyType === 'CUSTOMER' ? 'badge-paid' : 'badge-partial'}`}
                  style={{ fontSize: '11px', textTransform: 'uppercase' }}
                >
                  {party.partyType || 'CUSTOMER'}
                </span>
                {isExceeded && (
                  <span
                    className="badge badge-unpaid"
                    style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <AlertTriangle size={12} /> Limit Exceeded
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary, #9ca3af)', marginTop: '2px' }}>
                Party Ledger &amp; Running Balance Statement &bull; GSTIN: {party.gstin || 'Unregistered'} &bull; State: {party.stateName || 'N/A'} ({party.stateCode || '--'})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', padding: '0.5rem 0.85rem' }}
              title="Print formal statement on A4"
            >
              <Printer size={15} /> Print Statement
            </button>
            <button
              onClick={handleExportCSV}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '13px', padding: '0.5rem 0.85rem' }}
              title="Download CSV for Excel / Tally"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #9ca3af)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Header (Shown ONLY on print) */}
        <div
          className="print-only"
          style={{
            display: 'none',
            paddingBottom: '1rem',
            borderBottom: '2px solid #111827',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#111827' }}>
                {company?.legalName || company?.tradeName || 'Apex Store Pvt Ltd'}
              </h1>
              <p style={{ margin: '2px 0', fontSize: '12px', color: '#4b5563' }}>
                {company?.addressLine1 || 'Store Operations Hub'} {company?.city ? `, ${company.city}` : ''} - {company?.pincode || ''}
              </p>
              <p style={{ margin: '2px 0', fontSize: '12px', color: '#4b5563' }}>
                GSTIN: <strong>{company?.gstin || '00APEXX0000G0ST'}</strong> | State: {company?.stateName || 'All India'} ({company?.stateCode || '00'})
              </p>
              <p style={{ margin: '2px 0', fontSize: '12px', color: '#4b5563' }}>
                Phone: {company?.phone || 'N/A'} | Email: {company?.email || 'accounts@apexstore.org'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#1e40af', letterSpacing: '0.05em' }}>
                STATEMENT OF ACCOUNT
              </div>
              <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                Period: {customFrom || 'Beginning'} to {customTo || 'Today'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '6px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '12px' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#111827', textTransform: 'uppercase', fontSize: '11px' }}>PARTY DETAILS</div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{party.name}</div>
              <div>GSTIN: {party.gstin || 'Consumer / Unregistered'}</div>
              <div>Address: {party.billingAddress || 'Local Address'}</div>
              <div>Phone: {party.phone || 'N/A'} | Email: {party.email || 'N/A'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: '#111827', textTransform: 'uppercase', fontSize: '11px' }}>ACCOUNT TERMS</div>
              <div>Credit Terms: <strong>{creditPeriodDays} Days</strong></div>
              <div>Credit Limit: <strong>₹{creditLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 800, color: closingBalance > 0 ? '#b91c1c' : '#047857' }}>
                Closing Balance: ₹{closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (Dr)
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* Key Metric Highlights Cards (Screen only) */}
          <div
            className="no-print"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            {/* Total Invoiced */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                borderRadius: 'var(--radius-md, 10px)',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)', fontSize: '12px', fontWeight: 600 }}>
                <span>TOTAL BILLED (DR)</span>
                <ArrowUpRight size={16} color="#60a5fa" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.4rem', color: '#60a5fa' }}>
                ₹{Number(statement?.totalDebit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #9ca3af)', marginTop: '0.2rem' }}>
                Invoices &amp; debits
              </div>
            </div>

            {/* Total Paid */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                borderRadius: 'var(--radius-md, 10px)',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)', fontSize: '12px', fontWeight: 600 }}>
                <span>TOTAL RECEIVED (CR)</span>
                <ArrowDownRight size={16} color="#34d399" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.4rem', color: '#34d399' }}>
                ₹{Number(statement?.totalCredit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #9ca3af)', marginTop: '0.2rem' }}>
                Payments &amp; credits
              </div>
            </div>

            {/* Net Closing Balance */}
            <div
              style={{
                background: closingBalance > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: `1px solid ${closingBalance > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                borderRadius: 'var(--radius-md, 10px)',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)', fontSize: '12px', fontWeight: 600 }}>
                <span>OUTSTANDING BALANCE</span>
                <CreditCard size={16} color={closingBalance > 0 ? '#f87171' : '#34d399'} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.4rem', color: closingBalance > 0 ? '#f87171' : '#34d399' }}>
                ₹{closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: closingBalance > 0 ? '#fca5a5' : '#86efac', marginTop: '0.2rem', fontWeight: 600 }}>
                {closingBalance > 0 ? 'Due to Collect (Dr)' : 'Account Cleared / Advance'}
              </div>
            </div>

            {/* Credit Limit & Terms Health */}
            <div
              style={{
                background: isExceeded ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isExceeded ? '#ef4444' : 'var(--border-subtle, rgba(255, 255, 255, 0.08))'}`,
                borderRadius: 'var(--radius-md, 10px)',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted, #9ca3af)', fontSize: '12px', fontWeight: 600 }}>
                <span>CREDIT ENFORCEMENT</span>
                {isExceeded ? <ShieldAlert size={16} color="#ef4444" /> : <Clock size={16} color="#60a5fa" />}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.4rem', color: isExceeded ? '#f87171' : '#f9fafb' }}>
                {creditLimit > 0 ? `₹${creditLimit.toLocaleString('en-IN')}` : 'No Limit Set'}
              </div>
              <div style={{ fontSize: '11px', marginTop: '0.2rem' }}>
                {isExceeded ? (
                  <span style={{ color: '#f87171', fontWeight: 700 }}>
                    ⚠️ Exceeded by ₹{excessAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                ) : overdueAmount > 0 ? (
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                    ⚠️ ₹{overdueAmount.toLocaleString('en-IN')} Overdue ({overdueCount} bills)
                  </span>
                ) : (
                  <span style={{ color: '#34d399' }}>
                    Terms: {creditPeriodDays} Days &bull; ₹{availableCredit.toLocaleString('en-IN')} Left
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Credit Limit Exceeded Warning Alert Banner */}
          {isExceeded && (
            <div
              className="no-print"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 'var(--radius-md, 8px)',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#fca5a5'
              }}
            >
              <AlertTriangle size={20} color="#f87171" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13px' }}>
                <strong>Credit Limit Policy Alert:</strong> This party has an outstanding balance of{' '}
                <strong>₹{closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>, which exceeds
                their assigned credit limit of{' '}
                <strong>₹{creditLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> by{' '}
                <span style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'underline' }}>
                  ₹{excessAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                . Payment recovery is required prior to extending further unbilled credits.
              </div>
            </div>
          )}

          {/* Date Range & Search Toolbar (Screen only) */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))'
            }}
          >
            {/* Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleDatePreset('ALL')}
                className={`btn ${dateFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '0.35rem 0.65rem' }}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset('30DAYS')}
                className={`btn ${dateFilter === '30DAYS' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '0.35rem 0.65rem' }}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset('QUARTER')}
                className={`btn ${dateFilter === 'QUARTER' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '0.35rem 0.65rem' }}
              >
                Last 90 Days
              </button>
              <button
                type="button"
                onClick={() => handleDatePreset('FY')}
                className={`btn ${dateFilter === 'FY' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '0.35rem 0.65rem' }}
              >
                Fiscal Year
              </button>
            </div>

            {/* Custom Range & Search */}
            <form onSubmit={handleApplyCustomDates} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>From</span>
                <input
                  type="date"
                  className="form-control"
                  style={{ fontSize: '12px', padding: '0.3rem 0.5rem', width: '135px' }}
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
                <span>To</span>
                <input
                  type="date"
                  className="form-control"
                  style={{ fontSize: '12px', padding: '0.3rem 0.5rem', width: '135px' }}
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary" style={{ fontSize: '12px', padding: '0.35rem 0.6rem' }}>
                  Filter
                </button>
              </div>

              <div className="input-addon" style={{ width: '220px' }}>
                <Search size={14} className="addon-icon" />
                <input
                  type="text"
                  placeholder="Filter by ref / doc #..."
                  className="form-control"
                  style={{ fontSize: '12px', padding: '0.3rem 0.5rem 0.3rem 2rem' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => loadStatement(customFrom || null, customTo || null)}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.55rem' }}
                title="Reload statement"
              >
                <RefreshCw size={14} className={loading ? 'spinning' : ''} />
              </button>
            </form>
          </div>

          {/* Statement Table */}
          <div className="data-table-wrapper" style={{ borderRadius: 'var(--radius-md, 8px)' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '12.5px' }}>
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>Date</th>
                  <th style={{ width: '160px' }}>Ref / Doc No</th>
                  <th style={{ width: '110px' }}>Type</th>
                  <th>Description / Particulars</th>
                  <th style={{ width: '100px' }}>Due Date</th>
                  <th style={{ textAlign: 'right', width: '120px' }}>Debit (₹)</th>
                  <th style={{ textAlign: 'right', width: '120px' }}>Credit (₹)</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Running Bal (₹)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <RefreshCw size={24} className="spinning" style={{ margin: '0 auto 0.5rem' }} />
                      <div>Computing party ledger entries...</div>
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <Clock size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                      <div>No transactions found for this party in the selected date range.</div>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((row, idx) => (
                    <tr key={idx} style={{ background: row.isOverdue ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
                      <td style={{ whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                        {row.date ? new Date(row.date).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        <span style={{ color: '#60a5fa' }}>{row.referenceNumber || '—'}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            row.type === 'INVOICE'
                              ? 'badge-blue'
                              : row.type === 'PAYMENT'
                              ? 'badge-paid'
                              : row.type === 'PURCHASE_BILL'
                              ? 'badge-partial'
                              : 'badge-outline'
                          }`}
                          style={{ fontSize: '10px' }}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ color: 'var(--text-primary)' }}>{row.description}</div>
                        {row.isOverdue && (
                          <div style={{ color: '#f87171', fontSize: '10.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            <Clock size={11} /> Overdue past payment terms
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: '11px', color: row.isOverdue ? '#f87171' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {row.dueDate ? new Date(row.dueDate).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: row.debit > 0 ? '#60a5fa' : 'var(--text-muted)' }}>
                        {row.debit > 0 ? `₹${Number(row.debit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: row.credit > 0 ? '#34d399' : 'var(--text-muted)' }}>
                        {row.credit > 0 ? `₹${Number(row.credit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: 700,
                          color: row.balance > 0 ? '#f87171' : '#34d399'
                        }}
                      >
                        ₹{Math.abs(Number(row.balance || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        <span style={{ fontSize: '10px', marginLeft: '3px', color: 'var(--text-muted)' }}>
                          {row.balance > 0 ? 'Dr' : row.balance < 0 ? 'Cr' : ''}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', fontWeight: 800 }}>
                  <td colSpan="5" style={{ textAlign: 'right', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                    Statement Total &amp; Closing Outstanding:
                  </td>
                  <td style={{ textAlign: 'right', color: '#60a5fa' }}>
                    ₹{Number(statement?.totalDebit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'right', color: '#34d399' }}>
                    ₹{Number(statement?.totalCredit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'right', color: closingBalance > 0 ? '#f87171' : '#34d399', fontSize: '13px' }}>
                    ₹{Math.abs(closingBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })} {closingBalance > 0 ? 'Dr' : closingBalance < 0 ? 'Cr' : ''}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Printable Signature & Legal Footer (Print only) */}
          <div
            className="print-only"
            style={{
              display: 'none',
              marginTop: '3rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              fontSize: '11px',
              color: '#4b5563'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ margin: '2px 0' }}>1. Please notify us of any discrepancy within 7 days of statement receipt.</p>
                <p style={{ margin: '2px 0' }}>2. Payments should be made to <strong>{company?.legalName || company?.tradeName || 'Apex Store Pvt Ltd'}</strong>.</p>
                <p style={{ margin: '2px 0' }}>3. This is an electronically generated statement of account.</p>
              </div>
              <div style={{ textAlign: 'center', width: '200px' }}>
                <div style={{ height: '45px', borderBottom: '1px solid #111827', marginBottom: '4px' }}></div>
                <strong>Authorized Signatory</strong>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{company?.legalName || 'Apex Store'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Screen only) */}
        <div
          className="no-print"
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(17, 24, 39, 0.95)'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredEntries.length}</strong> transaction entries &bull; Default credit period:{' '}
            <strong>{creditPeriodDays} days</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={handlePrint} className="btn btn-secondary">
              <Printer size={15} /> Print A4 Statement
            </button>
            <button type="button" onClick={handleExportCSV} className="btn btn-secondary">
              <Download size={15} /> Export CSV
            </button>
            <button type="button" onClick={onClose} className="btn btn-primary" style={{ minWidth: '90px' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
