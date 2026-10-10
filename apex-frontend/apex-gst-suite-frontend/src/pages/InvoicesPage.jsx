import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Printer, Share2, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import InvoicePrintPreview from '../components/invoice/InvoicePrintPreview';

export default function InvoicesPage({ company, onNavigateToNewInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [previewInvoice, setPreviewInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    const list = await api.getInvoices();
    setInvoices(list);
  }

  const formatInr = (val) => {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  const filtered = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'ALL' || inv.paymentStatus === filterStatus;
    const matchesSearch = !search || 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.party?.name && inv.party.name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Invoices & Billing Ledger</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Manage tax invoices, monitor outstanding dues, and reprint receipts
          </p>
        </div>
        <button onClick={onNavigateToNewInvoice} className="btn btn-primary">
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card no-print" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="input-addon" style={{ flex: '1', minWidth: '240px' }}>
            <Search size={16} className="addon-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search by invoice number or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'PAID', 'PARTIALLY_PAID', 'UNPAID'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`btn ${filterStatus === status ? 'btn-blue' : 'btn-outline'}`}
                style={{ fontSize: '12px', padding: '0.4rem 0.8rem' }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card no-print">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Issue Date</th>
                <th>Supply Type</th>
                <th style={{ textAlign: 'right' }}>Total (₹)</th>
                <th style={{ textAlign: 'right' }}>Balance Due (₹)</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No invoices match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>
                      {inv.invoiceNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.party?.name || 'Walk-in Customer'}</div>
                      {inv.party?.gstin && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {inv.party.gstin}
                        </div>
                      )}
                    </td>
                    <td>{inv.invoiceDate}</td>
                    <td>
                      {inv.isInterState ? (
                        <span className="badge badge-partial" style={{ fontSize: '10px' }}>IGST</span>
                      ) : (
                        <span className="badge badge-paid" style={{ fontSize: '10px' }}>CGST + SGST</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {formatInr(inv.grandTotal)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: inv.balanceAmount > 0 ? '#f87171' : '#34d399' }}>
                      {formatInr(inv.balanceAmount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${inv.paymentStatus === 'PAID' ? 'badge-paid' : inv.paymentStatus === 'PARTIALLY_PAID' ? 'badge-partial' : 'badge-unpaid'}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '12px' }}
                          title="View Invoice"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setPreviewInvoice(inv);
                            setTimeout(() => window.print(), 100);
                          }}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '12px' }}
                          title="Print A4"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          onClick={() => {
                            const text = `Invoice ${inv.invoiceNumber} from ${company?.tradeName || 'Apex Enterprises'} for ₹${inv.grandTotal} is ready.`;
                            window.open(`https://wa.me/${(inv.party?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                          }}
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '12px', color: '#10b981' }}
                          title="WhatsApp"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview if clicked */}
      {previewInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Invoice: {previewInvoice.invoiceNumber}</h3>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => window.print()} className="btn btn-primary">
                  <Printer size={16} /> Print
                </button>
                <button onClick={() => setPreviewInvoice(null)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>

            <InvoicePrintPreview invoice={previewInvoice} company={company} />
          </div>
        </div>
      )}
    </div>
  );
}
