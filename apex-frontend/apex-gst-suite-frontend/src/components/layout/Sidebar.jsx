import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, company }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'create-invoice', label: '+ New Invoice', icon: PlusCircle, isHighlight: true },
    { id: 'pos', label: 'POS Counter', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'parties', label: 'Parties & CRM', icon: Users },
    { id: 'reports', label: 'GST Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar no-print">
      <div className="sidebar-header">
        <div className="brand-badge">A</div>
        <div>
          <div className="brand-text">Apex GST</div>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
            {company?.tradeName || 'Premium Electronics'}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                border: 'none',
                width: '100%',
                textAlign: 'left',
                ...(item.isHighlight && !isActive
                  ? { color: '#10b981', background: 'rgba(16, 185, 129, 0.08)' }
                  : {})
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>GSTIN Verified</span>
        </div>
        <span style={{ fontSize: '10px', color: '#64748b' }}>v1.0.0</span>
      </div>
    </aside>
  );
}
