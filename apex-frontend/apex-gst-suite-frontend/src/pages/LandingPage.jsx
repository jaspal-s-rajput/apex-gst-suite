import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  FileText,
  ShoppingCart,
  Package,
  QrCode,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Server,
  Database,
  Lock,
  ChevronDown,
  Sun,
  Moon,
  ChevronRight,
  Store,
  DollarSign,
  Printer,
  Users
} from 'lucide-react';
import { BASE_SEED_USER } from '../services/api';

export default function LandingPage({
  onNavigateToAuth,
  onLaunchDemoStore,
  currentUser,
  company,
  onReturnToWorkspace,
  theme,
  toggleTheme
}) {
  const [activeSection, setActiveSection] = useState('home');
  const [previewTab, setPreviewTab] = useState('pos'); // 'pos' | 'invoice' | 'reports' | 'inventory'
  const [expandedFaq, setExpandedFaq] = useState(0);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: "Is Apex GST Suite truly 100% free with zero hidden subscription costs?",
      a: "Yes, absolutely. Apex GST Suite was engineered under a strict Zero-Cost Architecture. It does not use paid third-party tax APIs, proprietary cloud engines, or payment gateway cuts. The software can be run locally or self-hosted in your private server with zero recurring charges forever."
    },
    {
      q: "Can I manage multiple retail branches or stores under one system?",
      a: "Yes. Apex GST Suite supports multi-store isolation. Each store receives its own dedicated legal entity profile, custom invoice prefix sequence (e.g. PREM/26-27), bank configuration, and inventory ledger while remaining accessible from a single master deployment."
    },
    {
      q: "How does the Dynamic UPI QR Code work without a payment gateway charge?",
      a: "Traditional billing applications route UPI payments through third-party aggregators (Razorpay, Paytm) that charge 1.5% - 2.5% per transaction. Apex GST Suite generates compliant NPCI UPI QR payloads directly on client invoices. The customer scans using GPay, PhonePe, or Paytm, and money deposits directly into your merchant bank account with 0% gateway deductions."
    },
    {
      q: "Does Apex GST Suite calculate both Intra-State and Inter-State GST automatically?",
      a: "Yes. By analyzing the 2-digit GST state codes of both the supplier and customer, the engine automatically splits taxes into CGST (50%) + SGST (50%) for intra-state sales, or applies 100% IGST for inter-state deliveries. Fractional amounts are rounded off to the nearest rupee in strict compliance with GST rules."
    },
    {
      q: "How fast is the POS Billing Counter during peak retail rush hours?",
      a: "The counter is engineered for sub-300ms transaction times. It supports instant USB/Bluetooth barcode scanner inputs, quick cash tender change calculation, keyboard shortcuts, and instant thermal receipt printing."
    }
  ];

  return (
    <div className="landing-shell">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="landing-nav-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Brand Logo */}
          <div
            onClick={() => scrollToSection('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563eb, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#ffffff',
              fontSize: '18px',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
            }}>
              A
            </div>
            <div>
              <span style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Apex GST <span style={{ color: '#38bdf8' }}>Suite</span>
              </span>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
                ENTERPRISE ORG
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => scrollToSection('home')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: activeSection === 'home' ? 600 : 500,
                color: activeSection === 'home' ? '#38bdf8' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('product')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: activeSection === 'product' ? 600 : 500,
                color: activeSection === 'product' ? '#38bdf8' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              Product & Modules
            </button>
            <button
              onClick={() => scrollToSection('about')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: activeSection === 'about' ? 600 : 500,
                color: activeSection === 'about' ? '#38bdf8' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              About Apex
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: activeSection === 'architecture' ? 600 : 500,
                color: activeSection === 'architecture' ? '#38bdf8' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              Zero-Cost Architecture
            </button>
            <button
              onClick={() => scrollToSection('comparison')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: activeSection === 'comparison' ? 600 : 500,
                color: activeSection === 'comparison' ? '#38bdf8' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              Comparison
            </button>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#3b82f6" />}
          </button>

          {currentUser ? (
            <button
              onClick={onReturnToWorkspace}
              className="btn btn-blue"
              style={{
                padding: '0.5rem 1.15rem',
                fontSize: '13px',
                fontWeight: 600,
                gap: '0.5rem'
              }}
            >
              <Store size={15} />
              <span>Go to {company?.tradeName || 'Store Workspace'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigateToAuth('login')}
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                Store Sign In
              </button>

              <button
                onClick={() => onNavigateToAuth('register')}
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.15rem',
                  fontSize: '13px',
                  fontWeight: 600,
                  gap: '0.4rem'
                }}
              >
                <span>Register Store Free</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" style={{
        padding: '5rem 0 3.5rem 0',
        position: 'relative',
        background: 'radial-gradient(ellipse 90% 60% at 50% -15%, rgba(59, 130, 246, 0.18), transparent 75%)'
      }}>
        <div className="landing-container" style={{ textAlign: 'center' }}>
          {/* Badge */}
          <div className="landing-badge">
            <Sparkles size={14} color="#38bdf8" />
            <span>Apex GST Suite 2.0 • 100% Free Zero-Cost Retail Billing Engine</span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 auto 1.5rem auto',
            maxWidth: '960px'
          }}>
            The Modern GST Billing & <br />
            <span className="gradient-text-rainbow">Retail ERP Engine</span> for Indian Stores
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 2.5rem auto'
          }}>
            Empowering Indian supermarkets, electronics retailers, and wholesalers with
            sub-second POS barcode billing, automated GST tax calculation, dynamic UPI QR payments,
            and real-time inventory intelligence — with <strong style={{ color: '#34d399' }}>zero recurring subscription fees</strong>.
          </p>

          {/* Hero CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => onNavigateToAuth('login')}
              className="btn btn-blue"
              style={{
                padding: '0.85rem 1.85rem',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.45)'
              }}
            >
              <Store size={18} />
              <span>Launch Store Workspace</span>
            </button>

            <button
              onClick={onLaunchDemoStore}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Zap size={18} />
              <span>1-Click Demo (Premium Electronics)</span>
            </button>

            <button
              onClick={() => onNavigateToAuth('register')}
              className="btn btn-secondary"
              style={{
                padding: '0.85rem 1.65rem',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <span>Register New Store</span>
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: '920px',
            margin: '0 auto 4rem auto'
          }}>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                ₹0.00
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                Subscription Fees Forever
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                &lt; 300 ms
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                POS Barcode Checkout Speed
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-heading)' }}>
                37 States/UTs
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                Full GSTIN Luhn Mod-36
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
                0% Deduction
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                Direct NPCI Dynamic UPI QR
              </div>
            </div>
          </div>

          {/* Interactive Live Product Preview Deck */}
          <div className="card" style={{
            padding: '1.75rem',
            maxWidth: '1060px',
            margin: '0 auto',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.55)',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)'
          }}>
            {/* Interactive Preview Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              {[
                { id: 'pos', label: 'POS Billing Counter', icon: ShoppingCart },
                { id: 'invoice', label: 'A4 GST Tax Studio', icon: FileText },
                { id: 'reports', label: 'GSTR Compliance Radar', icon: BarChart3 },
                { id: 'inventory', label: 'Warehouse & Stock Control', icon: Package },
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = previewTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPreviewTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                      color: isSelected ? '#60a5fa' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Live Interface Snapshot */}
            <div style={{
              background: 'var(--bg-app)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.75rem',
              textAlign: 'left'
            }}>
              {previewTab === 'pos' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Counter #1 • Supermarket Express Checkout
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        USB Barcode Scanner Active • Thermal Slip Mode
                      </div>
                    </div>
                    <span className="badge badge-success">● Cash Drawer Ready</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                            <th style={{ padding: '6px 0', textAlign: 'left' }}>Item Description</th>
                            <th style={{ padding: '6px 0', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '6px 0', textAlign: 'right' }}>Rate</th>
                            <th style={{ padding: '6px 0', textAlign: 'right' }}>GST</th>
                            <th style={{ padding: '6px 0', textAlign: 'right' }}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '8px 0', fontWeight: 600 }}>Ergonomic Laptop Stand (Aluminium)</td>
                            <td style={{ padding: '8px 0', textAlign: 'center' }}>1</td>
                            <td style={{ padding: '8px 0', textAlign: 'right' }}>₹1,499.00</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', color: '#10b981' }}>18%</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>₹1,768.82</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '8px 0', fontWeight: 600 }}>Wireless Optical Mouse 2.4GHz</td>
                            <td style={{ padding: '8px 0', textAlign: 'center' }}>2</td>
                            <td style={{ padding: '8px 0', textAlign: 'right' }}>₹699.00</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', color: '#10b981' }}>18%</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700 }}>₹1,649.64</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PAYABLE AMOUNT</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                          ₹3,418.00
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          CGST (9%): ₹260.70 • SGST (9%): ₹260.70
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '12px' }}>
                          Print Slip (F5)
                        </button>
                        <button className="btn btn-blue" style={{ flex: 1, padding: '0.5rem', fontSize: '12px' }}>
                          Show UPI QR (F8)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'invoice' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Tax Invoice PREM/26-27/101 • Premium Electronics
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        B2B Tax Invoice • Customer: Reliance Retail Ltd (27AAACR5055K1ZK)
                      </div>
                    </div>
                    <span className="badge badge-blue">Intra-State (CGST + SGST)</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '12px' }}>
                    <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Supplier Details:</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                        Premium Electronics Retail Pvt Ltd<br />
                        GSTIN: 27AAPFU0939F1ZV<br />
                        Mumbai, Maharashtra - 400086
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Customer Details:</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                        Reliance Retail Ltd<br />
                        GSTIN: 27AAACR5055K1ZK<br />
                        Marine Lines, Mumbai - 400002
                      </p>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <QrCode size={38} color="#10b981" />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Dynamic NPCI UPI QR</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Direct bank settlement</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'reports' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        GSTR-1 & GSTR-3B Tax Filing Radar (October 2026)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Automated B2B Tables (4A, 4B) • B2C Small (7) • HSN Summary (12)
                      </div>
                    </div>
                    <span className="badge badge-success">✓ 100% Reconciled</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TOTAL TAXABLE TURNOVER</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>₹8,45,200.00</div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CGST COLLECTED</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#38bdf8' }}>₹76,068.00</div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SGST COLLECTED</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#34d399' }}>₹76,068.00</div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ITC RECONCILED</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>₹1,24,500.00</div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'inventory' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Warehouse Inventory & Real-Time Stock Ledger
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Low Stock Radar • FIFO Costing • Barcode Automation
                      </div>
                    </div>
                    <span className="badge badge-warning">2 Items Below Reorder Level</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Aluminium Laptop Stand</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: LAP-STD-01 • HSN: 8473</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#34d399' }}>45 PCS in stock</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Threshold: 10</span>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>Wireless Optical Mouse</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: MOU-WL-02 • HSN: 8471</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#34d399' }}>80 PCS in stock</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Threshold: 15</span>
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>USB-C Fast Charging Cable</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: CAB-USBC-03 • HSN: 8544</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b' }}>8 PCS (LOW STOCK)</span>
                        <span style={{ fontSize: '11px', color: '#f59e0b' }}>Threshold: 20</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT & MODULES SHOWCASE */}
      <section id="product" style={{ padding: '6rem 0', background: 'var(--bg-app)' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="landing-badge">
              <Cpu size={14} color="#34d399" />
              <span>Full-Stack Suite Modules</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Everything Your Store Needs, <br />
              <span className="gradient-text-emerald">Nothing You Have to Pay For</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '16px' }}>
              Designed specifically for fast-paced retail counters, inventory-heavy superstores,
              and wholesale enterprises compliant with Indian GST laws.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {/* Module 1: POS Billing */}
            <div className="feature-grid-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                <ShoppingCart size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
                Sub-Second POS Counter
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Scan barcodes with zero lag. Compute instant line-item discounts, tender amounts,
                and print thermal slips (80mm/58mm) in under 300 milliseconds.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Barcode scanner auto-focus
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Hotkeys (F1–F8) for lightning operation
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Real-time cash balance calculator
                </li>
              </ul>
            </div>

            {/* Module 2: GST Tax Calculation */}
            <div className="feature-grid-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
                Intelligent GST Tax Engine
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Automatic split of Intra-State CGST + SGST vs Inter-State IGST based on place of supply.
                Full Luhn Mod-36 checksum verification for all 37 Indian GSTIN states.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Strict 2-decimal fractional tax rounding
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> HSN / SAC 4, 6, and 8 digit compliance
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Zero third-party tax API dependencies
                </li>
              </ul>
            </div>

            {/* Module 3: Dynamic UPI QR */}
            <div className="feature-grid-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(167, 139, 250, 0.12)', color: '#a78bfa' }}>
                <QrCode size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
                Dynamic NPCI UPI QR Codes
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Generate exact-amount UPI QR codes on every invoice. Customers scan via GPay, PhonePe,
                or Paytm with 100% direct bank credit and 0% payment gateway deductions.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Zero 2.5% payment gateway cut
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> NPCI standard compliant payload
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Instant client-side SVG/Canvas rendering
                </li>
              </ul>
            </div>

            {/* Module 4: Inventory & Warehouse */}
            <div className="feature-grid-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                <Package size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
                Warehouse & Stock Control
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Real-time stock ledger that increments on purchase bills and deducts on sales invoices.
                Automated low-stock alerts notify you before popular SKUs run out.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> FIFO valuation & purchase price tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Barcode & SKU generation utility
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Audit log for stock adjustments
                </li>
              </ul>
            </div>

            {/* Module 5: GSTR Compliance */}
            <div className="feature-grid-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}>
                <BarChart3 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
                GSTR-1 & GSTR-3B Auto Reports
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Generate monthly tax filing summaries with one click. Automatic breakdown into B2B Invoices,
                B2C Large/Small, HSN-wise tax summaries, and ITC reconciliation.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> One-click GSTR JSON export structure
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> ITC Input Tax Credit offset calculations
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Visual charts for revenue vs tax liabilities
                </li>
              </ul>
            </div>

            {/* Module 6: Multi-Store Isolation */}
            <div className="feature-grid-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
                Multi-Store & Tenant Isolation
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Run multiple business branches or retail outlets on a single installation.
                Each store possesses its own custom invoice prefix series, bank accounts, and user permissions.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Independent invoice series (e.g. PREM/26-27)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Role-based store administrator access
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={14} color="#10b981" /> Seamless 1-click store switching
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT APEX ORG & MISSION */}
      <section id="about" style={{
        padding: '6rem 0',
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div className="landing-badge">
                <Building2 size={14} color="#38bdf8" />
                <span>Our Organization Mission</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0 0 1.25rem 0' }}>
                Built to Free Indian Retailers from <br />
                <span className="gradient-text-blue">Software Subscription Traps</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px', marginBottom: '1.25rem' }}>
                Every year, hundreds of thousands of small and medium retailers in India are forced
                to pay recurrent annual subscriptions of ₹5,000 to ₹25,000 to proprietary SaaS companies
                just to generate a basic GST invoice or print a receipt.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '15px', marginBottom: '1.75rem' }}>
                <strong>Apex GST Suite</strong> was founded on the fundamental principle that enterprise-grade
                retail billing and inventory management should be accessible, private, and owned by the merchant —
                not held hostage behind paywalls or annual license renewals.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8' }}>100% Private</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Your sales and customer data stay on your machine.</div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>Zero Lock-in</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Export data and reports anytime in open formats.</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={20} color="#3b82f6" />
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>Pillar 1: Complete Operational Independence</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  You own your software. Run it on a store desktop, local LAN, or your private cloud with Docker. No external company can disable your counter.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <Zap size={20} color="#10b981" />
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>Pillar 2: Blazing Fast Checkout Architecture</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Cloud-only SaaS apps lag during internet dropouts. Apex GST Suite operates locally with instant sub-300ms counter responsiveness.
                </p>
              </div>

              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #a78bfa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <DollarSign size={20} color="#a78bfa" />
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>Pillar 3: Zero Hidden Costs Guarantee</span>
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Zero license keys, zero upgrade fees, zero payment gateway processing cuts, and zero third-party API surcharges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ZERO-COST ARCHITECTURE BLUEPRINT */}
      <section id="architecture" style={{ padding: '6rem 0', background: 'var(--bg-app)' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="landing-badge">
              <Server size={14} color="#a78bfa" />
              <span>Engineering Blueprint</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 1rem 0' }}>
              How Apex Delivers <span className="gradient-text-rainbow">100% Zero-Cost</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '16px' }}>
              We deliberately replaced paid third-party vendor APIs with self-hosted, mathematically sound
              in-house software solutions.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                TRADITIONAL PAID SAAS
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Paid GST Verification APIs
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                SaaS vendors charge ₹1.50 to ₹3.00 per GSTIN lookup via external third-party aggregators.
              </p>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>APEX ZERO-COST SOLUTION:</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  In-house Luhn Mod-36 checksum engine runs 100% locally with offline 37-state validation.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                TRADITIONAL PAID SAAS
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Payment Gateway Percentage Cut
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Gateways charge 2% to 2.5% on every customer transaction, siphoning thousands of rupees every month.
              </p>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>APEX ZERO-COST SOLUTION:</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  Direct NPCI dynamic UPI QR format deposits funds straight into your merchant bank account at 0% fee.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                TRADITIONAL PAID SAAS
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Cloud PDF Rendering Services
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Platforms use commercial cloud PDF converters with monthly tier quotas and watermarks.
              </p>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>APEX ZERO-COST SOLUTION:</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  Native CSS Paged Media `@media print` renders crisp vector A4 and 80mm thermal receipts with 0 external calls.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                TRADITIONAL PAID SAAS
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Cloud Database Recurring Hosting
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Monthly AWS/GCP database fees escalate as your transaction records expand over the financial years.
              </p>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 700 }}>APEX ZERO-COST SOLUTION:</span>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                  Lightweight PostgreSQL 16 on Docker or local desktop engine. 100% self-hosted with unlimited records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON MATRIX */}
      <section id="comparison" style={{
        padding: '6rem 0',
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="landing-badge">
              <TrendingUp size={14} color="#38bdf8" />
              <span>Platform Comparison</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '0 0 1rem 0' }}>
              How Apex GST Suite Compares
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '16px' }}>
              See why stores and businesses choose Apex GST Suite over expensive commercial legacy alternatives.
            </p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="comp-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Feature / Capability</th>
                  <th style={{ width: '24%', background: 'rgba(59, 130, 246, 0.12)', color: '#38bdf8' }}>
                    Apex GST Suite
                  </th>
                  <th style={{ width: '16%' }}>Vyapar</th>
                  <th style={{ width: '16%' }}>ClearTax</th>
                  <th style={{ width: '16%' }}>Zoho Books</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>Annual Recurring Cost</td>
                  <td className="comp-highlight" style={{ fontSize: '15px' }}>₹0.00 (Free Forever)</td>
                  <td style={{ color: '#ef4444' }}>₹3,500 – ₹7,000/yr</td>
                  <td style={{ color: '#ef4444' }}>₹9,999 – ₹24,999/yr</td>
                  <td style={{ color: '#ef4444' }}>₹8,999 – ₹35,999/yr</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>High-Speed POS Barcode Billing</td>
                  <td className="comp-highlight">✓ Sub-300ms Native Engine</td>
                  <td>Limited Mobile UI</td>
                  <td>No POS Mode</td>
                  <td>Add-on POS Required</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Dynamic NPCI UPI QR on Invoices</td>
                  <td className="comp-highlight">✓ Built-in (0% Deduction)</td>
                  <td>Static VPA Only</td>
                  <td>Payment Gateway (2% cut)</td>
                  <td>Gateway Required (2% cut)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>GSTR-1 & GSTR-3B Auto Reconcile</td>
                  <td className="comp-highlight">✓ Built-in Local Engine</td>
                  <td>Basic Excel Export</td>
                  <td>✓ Cloud (Paid tier)</td>
                  <td>✓ Cloud (Paid tier)</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Self-Hosting / Data Privacy</td>
                  <td className="comp-highlight">✓ 100% Local / Self-Hosted</td>
                  <td>Cloud Sync Locked</td>
                  <td>Cloud Server Locked</td>
                  <td>Cloud Server Locked</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Multi-Store Branch Isolation</td>
                  <td className="comp-highlight">✓ Included Free</td>
                  <td>Paid Extra Per Store</td>
                  <td>Enterprise Tier Only</td>
                  <td>Multi-company Surcharge</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Luhn Mod-36 GSTIN Validator</td>
                  <td className="comp-highlight">✓ Offline In-House</td>
                  <td>Partial Regex Only</td>
                  <td>Cloud API Only</td>
                  <td>Cloud API Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-app)' }}>
        <div className="landing-container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Clear answers to the most common questions from store owners and merchants.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    borderColor: isOpen ? 'rgba(59, 130, 246, 0.35)' : 'var(--border-subtle)'
                  }}
                  onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: isOpen ? '#38bdf8' : 'var(--text-primary)' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color={isOpen ? '#38bdf8' : 'var(--text-muted)'}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                        marginLeft: '1rem'
                      }}
                    />
                  </div>
                  {isOpen && (
                    <div style={{
                      marginTop: '0.85rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. PRE-FOOTER CTA CARD */}
      <section style={{ padding: '0 0 5rem 0', background: 'var(--bg-app)' }}>
        <div className="landing-container">
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.15))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.45)'
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Ready to Upgrade Your Store Operations?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 2rem auto', fontSize: '15px' }}>
              Join forward-thinking retail owners across India. Experience the lightning speed of
              sub-second POS billing and automated GST compliance today.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigateToAuth('register')}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 2rem',
                  fontSize: '15px',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Register Your Store Free
              </button>
              <button
                onClick={onLaunchDemoStore}
                className="btn btn-secondary"
                style={{
                  padding: '0.85rem 1.75rem',
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)'
                }}
              >
                Open Demo Store (Premium Electronics)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ORG FOOTER (Strictly NO contact page / form) */}
      <footer style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem 0 2rem 0',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        <div className="landing-container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#ffffff',
                fontSize: '16px'
              }}>
                A
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Apex GST Suite
              </span>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontWeight: 600 }}>
                100% Free Self-Hosted
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span onClick={() => scrollToSection('home')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Home</span>
              <span onClick={() => scrollToSection('product')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Product</span>
              <span onClick={() => scrollToSection('about')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>About</span>
              <span onClick={() => scrollToSection('architecture')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Architecture</span>
              <span onClick={() => scrollToSection('comparison')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Comparison</span>
              <span onClick={() => onNavigateToAuth('login')} style={{ cursor: 'pointer', color: '#38bdf8', fontWeight: 600 }}>Sign In</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            fontSize: '12px',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              © 2026 Apex GST Suite. Built for Indian Retailers, Wholesalers & Enterprises.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Zero-Cost Engine • Local-First Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
