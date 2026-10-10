import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/InvoicesPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import POSPage from './pages/POSPage';
import InventoryPage from './pages/InventoryPage';
import PartiesPage from './pages/PartiesPage';
import GSTReportsPage from './pages/GSTReportsPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import { api, BASE_SEED_USER } from './services/api';
import './index.css';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'auth' | 'workspace'
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [company, setCompany] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check saved session in local/session storage
    const saved = localStorage.getItem('apex_auth_session') || sessionStorage.getItem('apex_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.user && parsed?.store) {
          setCurrentUser(parsed.user);
          setCompany(parsed.store);
          setView('workspace');
        }
      } catch (_) {}
    }
    setAuthInitialized(true);
  }, []);

  const handleNavigateToAuth = (initialTab = 'login') => {
    setAuthInitialTab(initialTab);
    setView('auth');
  };

  const handleLaunchDemoStore = async () => {
    try {
      const result = await api.login(BASE_SEED_USER.email, BASE_SEED_USER.password);
      localStorage.setItem('apex_auth_session', JSON.stringify(result));
      setCurrentUser(result.user);
      setCompany(result.store);
      setView('workspace');
      setActiveTab('dashboard');
    } catch (_) {
      // Fallback
      handleNavigateToAuth('login');
    }
  };

  const handleAuthSuccess = (authData) => {
    setCurrentUser(authData.user);
    setCompany(authData.store);
    setView('workspace');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('apex_auth_session');
    sessionStorage.removeItem('apex_auth_session');
    setCurrentUser(null);
    setCompany(null);
    setView('landing');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateCompany = (updated) => {
    setCompany(updated);
    const saved = localStorage.getItem('apex_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.store = updated;
        localStorage.setItem('apex_auth_session', JSON.stringify(parsed));
      } catch (_) {}
    }
  };

  if (!authInitialized) {
    return null;
  }

  // View 1: Apex Org Marketing / Product Presentation Site
  if (view === 'landing') {
    return (
      <LandingPage
        onNavigateToAuth={handleNavigateToAuth}
        onLaunchDemoStore={handleLaunchDemoStore}
        currentUser={currentUser}
        company={company}
        onReturnToWorkspace={() => setView('workspace')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  // View 2: Store Authentication (Sign In & Register)
  if (view === 'auth') {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        initialTab={authInitialTab}
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  // View 3: Store Operations & ERP Workspace
  return (
    <div className="app-container">
      {/* Collapsible Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} company={company} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sticky Topbar */}
        <Topbar
          company={company}
          currentUser={currentUser}
          onLogout={handleLogout}
          onViewOrg={() => setView('landing')}
          onNewInvoice={() => setActiveTab('create-invoice')}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Dynamic Page Views */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToNewInvoice={() => setActiveTab('create-invoice')}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesPage
            company={company}
            onNavigateToNewInvoice={() => setActiveTab('create-invoice')}
          />
        )}

        {activeTab === 'create-invoice' && (
          <CreateInvoicePage
            company={company}
            onBack={() => setActiveTab('invoices')}
            onInvoiceSaved={(inv) => setActiveTab('invoices')}
          />
        )}

        {activeTab === 'pos' && (
          <POSPage company={company} />
        )}

        {activeTab === 'inventory' && (
          <InventoryPage company={company} />
        )}

        {activeTab === 'parties' && (
          <PartiesPage company={company} />
        )}

        {activeTab === 'reports' && (
          <GSTReportsPage company={company} />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            company={company}
            onUpdateCompany={handleUpdateCompany}
          />
        )}
      </div>
    </div>
  );
}
