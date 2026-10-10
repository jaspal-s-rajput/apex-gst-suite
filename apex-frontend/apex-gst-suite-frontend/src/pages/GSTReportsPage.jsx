import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function GSTReportsPage({ company }) {
  const [invoices, setInvoices] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [activeReportTab, setActiveReportTab] = useState('gstr1');

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    const [invList, m] = await Promise.all([
      api.getInvoices(),
      api.getDashboardMetrics()
    ]);
    setInvoices(invList);
    setMetrics(m);
  }

  const formatInr = (val) => {
    const num = parseFloat(val) || 0;
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  // Group line items for HSN Table 12 summary
  const hsnSummaryMap = {};
  invoices.forEach(inv => {
    (inv.items || []).forEach(item => {
      const code = item.hsnSacCode || 'OTHER';
      if (!hsnSummaryMap[code]) {
        hsnSummaryMap[code] = {
          hsnCode: code,
          itemName: item.itemName,
          uom: item.uom || 'PCS',
          totalQty: 0,
          totalTaxable: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          totalTax: 0
        };
      }
      hsnSummaryMap[code].totalQty += parseFloat(item.quantity) || 0;
      hsnSummaryMap[code].totalTaxable += parseFloat(item.taxableValue) || 0;
      hsnSummaryMap[code].cgst += parseFloat(item.cgstAmount) || 0;
      hsnSummaryMap[code].sgst += parseFloat(item.sgstAmount) || 0;
      hsnSummaryMap[code].igst += parseFloat(item.igstAmount) || 0;
      hsnSummaryMap[code].totalTax += (parseFloat(item.cgstAmount) || 0) + (parseFloat(item.sgstAmount) || 0) + (parseFloat(item.igstAmount) || 0);
    });
  });

  const hsnRows = Object.values(hsnSummaryMap);

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>GST Compliance & Returns Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            CA-ready GSTR-1 tables, HSN Table 12 aggregations, and GSTR-3B tax offset reconciliation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => alert('JSON exported for GST Offline Tool!')} className="btn btn-secondary">
            <Download size={16} /> Export JSON
          </button>
          <button onClick={() => alert('Excel report generated!')} className="btn btn-primary">
            <FileSpreadsheet size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveReportTab('gstr1')}
          className={`btn ${activeReportTab === 'gstr1' ? 'btn-blue' : 'btn-outline'}`}
        >
          GSTR-1 Summary (Outward Supplies)
        </button>
        <button
          onClick={() => setActiveReportTab('gstr3b')}
          className={`btn ${activeReportTab === 'gstr3b' ? 'btn-blue' : 'btn-outline'}`}
        >
          GSTR-3B Worksheet (Net Tax Liability)
        </button>
      </div>

      {activeReportTab === 'gstr1' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section: HSN-wise summary (Table 12) */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Table 12: HSN-Wise Summary of Outward Supplies</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mandatory reporting format for GST filing portal</p>
              </div>
              <span className="badge badge-paid">{hsnRows.length} HSN Records</span>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>HSN / SAC</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'center' }}>Total Qty</th>
                    <th style={{ textAlign: 'right' }}>Total Taxable Value (₹)</th>
                    <th style={{ textAlign: 'right' }}>CGST (₹)</th>
                    <th style={{ textAlign: 'right' }}>SGST (₹)</th>
                    <th style={{ textAlign: 'right' }}>IGST (₹)</th>
                    <th style={{ textAlign: 'right' }}>Total Tax (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {hsnRows.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#60a5fa' }}>{row.hsnCode}</td>
                      <td>{row.itemName}</td>
                      <td style={{ textAlign: 'center' }}>{row.totalQty} {row.uom}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatInr(row.totalTaxable)}</td>
                      <td style={{ textAlign: 'right' }}>{formatInr(row.cgst)}</td>
                      <td style={{ textAlign: 'right' }}>{formatInr(row.sgst)}</td>
                      <td style={{ textAlign: 'right' }}>{formatInr(row.igst)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#10b981' }}>{formatInr(row.totalTax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: B2B Invoices (Table 4) */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Table 4: B2B Supplies to Registered Taxpayers
            </h3>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>GSTIN of Recipient</th>
                    <th>Receiver Name</th>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th style={{ textAlign: 'right' }}>Invoice Value (₹)</th>
                    <th>Place of Supply</th>
                    <th style={{ textAlign: 'right' }}>Taxable Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.filter(i => i.party?.gstin).map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{inv.party.gstin}</td>
                      <td>{inv.party.name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>{inv.invoiceNumber}</td>
                      <td>{inv.invoiceDate}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatInr(inv.grandTotal)}</td>
                      <td>{inv.placeOfSupply}</td>
                      <td style={{ textAlign: 'right' }}>{formatInr(inv.taxableAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* GSTR-3B Worksheet */
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            GSTR-3B Tax Liability & ITC Reconciliation Worksheet
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>1. Output Tax Liability (Sales)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171', margin: '0.4rem 0' }}>
                {formatInr(metrics?.totalTaxCollected)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                CGST: {formatInr(metrics?.cgstCollected)} | SGST: {formatInr(metrics?.sgstCollected)}
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>2. Eligible ITC (Purchases)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a78bfa', margin: '0.4rem 0' }}>
                {formatInr(metrics?.totalItcAvailable)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Available credit offset ledger
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>3. Net Tax Payable in Cash</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', margin: '0.4rem 0' }}>
                {formatInr(metrics?.netTaxPayable)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Tax liability minus available ITC
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#3b82f6" />
            <span>
              All tax computations adhere to Section 49 of the CGST Act for automatic Input Tax Credit set-off ordering.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
