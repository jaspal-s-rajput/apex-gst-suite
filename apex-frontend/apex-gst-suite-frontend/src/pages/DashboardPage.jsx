import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  Eye, 
  Printer, 
  Share2,
  Package
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ onNavigateToNewInvoice, onNavigateToInventory }) {
  const [metrics, setMetrics] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    const [m, invs] = await Promise.all([
      api.getDashboardMetrics(),
      api.getInvoices()
    ]);
    setMetrics(m);
    setRecentInvoices(invs.slice(0, 5));
    setLoading(false);
  }

  const formatInr = (val) => {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  // Calculate monthly turnover dynamically from issued invoices
  const currentYear = new Date().getFullYear();
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const monthlyTotals = months.map(m => ({ month: m, total: 0 }));

  (recentInvoices && recentInvoices.length > 0 ? recentInvoices : []).forEach(inv => {
    if (!inv.invoiceDate) return;
    const d = new Date(inv.invoiceDate);
    if (isNaN(d.getTime())) return;
    const mIdx = d.getMonth(); // 0 = Jan, 3 = Apr, etc.
    // Map calendar month to FY month (Apr=0 ... Mar=11)
    const fyIdx = (mIdx + 9) % 12;
    if (fyIdx >= 0 && fyIdx < 12) {
      monthlyTotals[fyIdx].total += (parseFloat(inv.grandTotal) || 0);
    }
  });

  const maxVal = Math.max(...monthlyTotals.map(m => m.total), 1);
  const currentMtdTotal = metrics?.totalSales || 0;
  const currentMonthIdx = (new Date().getMonth() + 9) % 12;

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Business Cockpit</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Real-time financial turnover, GST liability, and inventory health
          </p>
        </div>
        <button onClick={onNavigateToNewInvoice} className="btn btn-primary">
          <Plus size={16} /> New Tax Invoice
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {metrics?.lowStockCount > 0 && (
        <div className="alert-banner alert-warning">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={18} />
            <span>
              <strong>Inventory Warning:</strong> {metrics.lowStockCount} product(s) are running below their minimum reorder threshold!
            </span>
          </div>
          <button onClick={onNavigateToInventory} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '12px' }}>
            View Stock
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Card 1: Total Sales */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-title">Total Sales (Turnover)</span>
            <span style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="metric-value">{formatInr(metrics?.totalSales)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '12px', color: (metrics?.totalSales > 0 ? '#10b981' : 'var(--text-muted)') }}>
            {metrics?.totalSales > 0 ? (
              <>
                <ArrowUpRight size={14} />
                <span>Live recorded sales</span>
              </>
            ) : (
              <span>No sales recorded yet</span>
            )}
          </div>
        </div>

        {/* Card 2: Output GST Liability */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-title">GST Tax Collected</span>
            <span style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Receipt size={16} />
            </span>
          </div>
          <div className="metric-value">{formatInr(metrics?.totalTaxCollected)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            CGST: {formatInr(metrics?.cgstCollected)} | SGST: {formatInr(metrics?.sgstCollected)}
          </div>
        </div>

        {/* Card 3: Input Tax Credit (ITC) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-title">Available ITC (Purchases)</span>
            <span style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <CreditCard size={16} />
            </span>
          </div>
          <div className="metric-value" style={{ color: '#a78bfa' }}>{formatInr(metrics?.totalItcAvailable)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Claimable against Output Tax
          </div>
        </div>

        {/* Card 4: Net Tax Payable */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="card-title">Net Tax Payable (GSTR-3B)</span>
            <span style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Receipt size={16} />
            </span>
          </div>
          <div className="metric-value" style={{ color: '#fbbf24' }}>{formatInr(metrics?.netTaxPayable)}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Due by 20th of the month
          </div>
        </div>
      </div>

      {/* Middle Grid: Turnover & Cash Flow Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Turnover Trends (FY 2026-27)</h3>
            <span className="badge badge-paid">Live Sync</span>
          </div>
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            {monthlyTotals.slice(0, 7).map((bar, i) => {
              const hasSales = bar.total > 0;
              const barHeight = hasSales ? Math.max(16, Math.min(140, Math.round((bar.total / maxVal) * 130))) : 4;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div 
                    title={`${bar.month}: ${formatInr(bar.total)}`}
                    style={{ 
                      width: '100%', 
                      height: `${barHeight}px`, 
                      background: hasSales 
                        ? (i === currentMonthIdx ? 'linear-gradient(180deg, #10b981, #059669)' : 'linear-gradient(180deg, #3b82f6, #1e40af)')
                        : 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '4px',
                      transition: 'height 0.4s ease'
                    }}
                  ></div>
                  <span style={{ fontSize: '11px', color: i === currentMonthIdx ? '#38bdf8' : 'var(--text-muted)' }}>{bar.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>FY Target: {metrics?.totalSales > 0 ? formatInr(Math.max(100000, metrics.totalSales * 1.5)) : '₹0'}</span>
            <span>Current MTD: {formatInr(currentMtdTotal)}</span>
          </div>
        </div>

        {/* Receivables & Quick Stats */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Receivables Ledger</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Pending Balance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f87171' }}>
                {formatInr(metrics?.totalReceivables)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Invoices Issued</span>
                <strong>{metrics?.totalInvoicesCount || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items in Catalog</span>
                <strong>{metrics?.itemsCount ?? 0} items</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Vendor Payables</span>
                <strong>{formatInr(metrics?.totalPayables)}</strong>
              </div>
            </div>
          </div>

          <button onClick={onNavigateToNewInvoice} className="btn btn-blue" style={{ width: '100%', marginTop: '1rem' }}>
            <Plus size={16} /> Quick Invoice
          </button>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Issued Invoices</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Auto-sequenced</span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Supply Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>
                    {inv.invoiceNumber}
                  </td>
                  <td>{inv.party?.name || 'Walk-in Customer'}</td>
                  <td>{inv.invoiceDate}</td>
                  <td>
                    {inv.isInterState ? (
                      <span className="badge badge-partial" style={{ fontSize: '10px' }}>Inter-State (IGST)</span>
                    ) : (
                      <span className="badge badge-paid" style={{ fontSize: '10px' }}>Intra-State (CGST+SGST)</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>
                    {formatInr(inv.grandTotal)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${inv.paymentStatus === 'PAID' ? 'badge-paid' : inv.paymentStatus === 'PARTIALLY_PAID' ? 'badge-partial' : 'badge-unpaid'}`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button 
                        onClick={() => window.print()}
                        className="btn btn-outline" 
                        style={{ padding: '0.35rem', borderRadius: '4px' }}
                        title="Print"
                      >
                        <Printer size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          const text = `Invoice ${inv.invoiceNumber} for ₹${inv.grandTotal} is ready.`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="btn btn-outline" 
                        style={{ padding: '0.35rem', borderRadius: '4px', color: '#10b981' }}
                        title="WhatsApp"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
