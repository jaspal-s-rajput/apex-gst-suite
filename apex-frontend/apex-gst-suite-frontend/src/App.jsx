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
import { api, DEMO_STORE_USER, DEMO_STORE_COMPANY } from './services/api';
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
    // Clean slate: ensure all legacy users and sessions are completely purged
    try {
      // Remove any previously stored mock users
      localStorage.removeItem('apex_local_users');
    } catch (_) {}

    // Check saved session in local/session storage
    const saved = localStorage.getItem('apex_auth_session') || sessionStorage.getItem('apex_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only restore actual real user sessions, never preview sessions
        if (parsed?.user && parsed?.store && !parsed?.user?.isPreview && !parsed?.store?.isPreview) {
          setCurrentUser(parsed.user);
          setCompany(parsed.store);
          setView('workspace');
        } else {
          // Clear any leftover preview session or invalid session
          localStorage.removeItem('apex_auth_session');
          sessionStorage.removeItem('apex_auth_session');
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
      const demoResult = {
        token: 'apex-demo-jwt-' + Date.now(),
        user: {
          id: 'u-demo-preview-owner',
          email: DEMO_STORE_USER.email,
          fullName: DEMO_STORE_USER.fullName,
          phone: DEMO_STORE_USER.phone,
          role: 'ADMIN',
          isPreview: true
        },
        store: DEMO_STORE_COMPANY,
        message: 'Preview workspace initialized'
      };
      // Do NOT persist preview session in localStorage/sessionStorage
      // Only keep in transient memory for this view
      setCurrentUser(demoResult.user);
      setCompany(demoResult.store);
      setView('workspace');
      setActiveTab('dashboard');
    } catch (_) {
      handleNavigateToAuth('login');
    }
  };

  const handleReturnToLanding = () => {
    // If current session is preview, clean up transient preview state
    if (currentUser?.isPreview || company?.isPreview) {
      setCurrentUser(null);
      setCompany(null);
    }
    setView('landing');
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
    const saved = localStorage.getItem('apex_auth_session') || sessionStorage.getItem('apex_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.store = updated;
        if (localStorage.getItem('apex_auth_session')) {
          localStorage.setItem('apex_auth_session', JSON.stringify(parsed));
        } else {
          sessionStorage.setItem('apex_auth_session', JSON.stringify(parsed));
        }
      } catch (_) {}
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
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
          onViewOrg={handleReturnToLanding}
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
            currentUser={currentUser}
            onUpdateCompany={handleUpdateCompany}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </div>
    </div>
  );
}
