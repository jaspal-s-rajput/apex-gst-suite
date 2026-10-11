/**
 * Centralized API Client for Apex GST Suite
 * Interacts with Spring Boot REST API at http://localhost:8080/api/v1
 * Features automatic fallback to structured mock data if the backend is not yet started.
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Demo presentation persona requested for landing platform overview
export const DEMO_STORE_USER = {
  email: 'apexgstsuite@support.org',
  password: 'DemoPass@123',
  storeName: 'Apex Store Pvt Ltd (preview)',
  fullName: 'store owner',
  phone: '000000000',
  role: 'ADMIN',
  isPreview: true
};

export const DEMO_STORE_COMPANY = {
  id: 'c-demo-preview-01',
  legalName: 'Apex Store Pvt Ltd (preview)',
  tradeName: 'Apex Store Pvt Ltd (preview)',
  gstin: '00APEXX0000G0ST',
  pan: 'APEXX0000G',
  stateCode: '00',
  stateName: 'Other Territory / Preview',
  addressLine1: 'Preview Store Operations Hub, Apex Cloud Platform',
  city: 'National Hub',
  pincode: '000000',
  phone: '000000000',
  email: 'apexgstsuite@support.org',
  upiId: 'apexpreview@upi',
  bankName: 'Preview Reserve Bank',
  accountNumber: '00000000000000',
  ifscCode: 'APEX0000000',
  branchName: 'Headquarters Hub',
  invoicePrefix: 'PREV/26-27',
  nextInvoiceSequence: 101,
  isPreview: true
};

export const GST_STATES = [
  { code: '01', name: 'Jammu and Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman and Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
  { code: '97', name: 'Other Territory' }
];

const MOCK_COMPANY = {
  id: 'c-preview-demo',
  legalName: 'Apex Store Pvt Ltd (preview)',
  tradeName: 'Apex Store Pvt Ltd (preview)',
  gstin: '00APEXX0000G0ST',
  pan: 'APEXX0000G',
  stateCode: '00',
  stateName: 'Other Territory / Preview',
  addressLine1: 'Preview Store Operations Hub, Apex Cloud Platform',
  city: 'National Hub',
  pincode: '000000',
  phone: '000000000',
  email: 'apexgstsuite@support.org',
  upiId: 'apexpreview@upi',
  bankName: 'Preview Reserve Bank',
  accountNumber: '00000000000000',
  ifscCode: 'APEX0000000',
  branchName: 'Headquarters Hub',
  invoicePrefix: 'PREV/26-27',
  nextInvoiceSequence: 101,
  isPreview: true
};

const MOCK_PARTIES = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    name: 'Reliance Retail Ltd',
    gstin: '27AAACR5055K1ZK',
    stateCode: '27',
    stateName: 'Maharashtra',
    partyType: 'CUSTOMER',
    city: 'Mumbai',
    phone: '+91 91234 56789',
    billingAddress: 'Court House, Dhobi Talao, Marine Lines, Mumbai - 400002',
    currentBalance: 3840.00
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    name: 'Infosys Technologies Ltd',
    gstin: '29AAACI4798H1ZE',
    stateCode: '29',
    stateName: 'Karnataka',
    partyType: 'CUSTOMER',
    city: 'Bengaluru',
    phone: '+91 80285 20361',
    billingAddress: 'Electronics City, Hosur Road, Bengaluru - 560100',
    currentBalance: 8248.00
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    name: 'Sharma Retailers (Walk-in)',
    stateCode: '27',
    stateName: 'Maharashtra',
    partyType: 'CUSTOMER',
    city: 'Pune',
    phone: '+91 98200 11223',
    billingAddress: 'Shop 14, Market Yard, Pune - 411037',
    currentBalance: 0.00
  }
];

const MOCK_ITEMS = [
  {
    id: 'i1111111-1111-1111-1111-111111111111',
    name: 'Ergonomic Aluminium Laptop Stand',
    sku: 'LAP-STD-01',
    barcode: '8901234567890',
    category: 'Office Accessories',
    itemType: 'GOODS',
    hsnSacCode: '8473',
    uom: 'PCS',
    purchasePrice: 750.00,
    sellingPrice: 1499.00,
    gstRate: 18.00,
    currentStock: 45,
    minStockAlert: 10
  },
  {
    id: 'i2222222-2222-2222-2222-222222222222',
    name: 'Wireless Optical Mouse 2.4GHz',
    sku: 'MOU-WL-02',
    barcode: '8901234567891',
    category: 'Computer Peripherals',
    itemType: 'GOODS',
    hsnSacCode: '8471',
    uom: 'PCS',
    purchasePrice: 320.00,
    sellingPrice: 699.00,
    gstRate: 18.00,
    currentStock: 80,
    minStockAlert: 15
  },
  {
    id: 'i3333333-3333-3333-3333-333333333333',
    name: 'Braided USB-C Fast Charging Cable 2M',
    sku: 'CAB-USBC-03',
    barcode: '8901234567892',
    category: 'Cables',
    itemType: 'GOODS',
    hsnSacCode: '8544',
    uom: 'PCS',
    purchasePrice: 120.00,
    sellingPrice: 299.00,
    gstRate: 18.00,
    currentStock: 4, // Low stock trigger
    minStockAlert: 10
  },
  {
    id: 'i4444444-4444-4444-4444-444444444444',
    name: 'Annual GST Audit & Software Support',
    sku: 'SRV-GST-01',
    category: 'Services',
    itemType: 'SERVICE',
    hsnSacCode: '9983',
    uom: 'HOURS',
    purchasePrice: 0.00,
    sellingPrice: 2500.00,
    gstRate: 18.00,
    currentStock: 0,
    minStockAlert: 0
  }
];

const MOCK_INVOICES = [
  {
    id: 'inv-101',
    invoiceNumber: 'APEX/26-27/0101',
    invoiceType: 'TAX_INVOICE',
    invoiceDate: '2026-10-08',
    dueDate: '2026-11-08',
    placeOfSupply: '27',
    isInterState: false,
    party: MOCK_PARTIES[0],
    subtotal: 7495.00,
    taxableAmount: 7495.00,
    cgstAmount: 674.55,
    sgstAmount: 674.55,
    igstAmount: 0.00,
    roundOff: -0.10,
    grandTotal: 8844.00,
    paymentStatus: 'PARTIALLY_PAID',
    amountPaid: 5000.00,
    balanceAmount: 3844.00,
    paymentMode: 'NEFT',
    upiQrPayload: 'upi://pay?pa=apexsolutions@upi&pn=Apex%20Solutions&am=3844.00&tr=APEX/26-27/0101&cu=INR&tn=Payment%20for%20APEX/26-27/0101',
    items: [
      {
        itemName: 'Ergonomic Aluminium Laptop Stand',
        hsnSacCode: '8473',
        quantity: 5,
        uom: 'PCS',
        unitPrice: 1499.00,
        taxableValue: 7495.00,
        gstRate: 18.0,
        cgstAmount: 674.55,
        sgstAmount: 674.55,
        igstAmount: 0.00,
        totalAmount: 8844.10
      }
    ]
  },
  {
    id: 'inv-102',
    invoiceNumber: 'APEX/26-27/0102',
    invoiceType: 'TAX_INVOICE',
    invoiceDate: '2026-10-08',
    dueDate: '2026-11-08',
    placeOfSupply: '29',
    isInterState: true,
    party: MOCK_PARTIES[1],
    subtotal: 6990.00,
    taxableAmount: 6990.00,
    cgstAmount: 0.00,
    sgstAmount: 0.00,
    igstAmount: 1258.20,
    roundOff: -0.20,
    grandTotal: 8248.00,
    paymentStatus: 'UNPAID',
    amountPaid: 0.00,
    balanceAmount: 8248.00,
    paymentMode: 'UPI',
    upiQrPayload: 'upi://pay?pa=apexsolutions@upi&pn=Apex%20Solutions&am=8248.00&tr=APEX/26-27/0102&cu=INR&tn=Payment%20for%20APEX/26-27/0102',
    items: [
      {
        itemName: 'Wireless Optical Mouse 2.4GHz',
        hsnSacCode: '8471',
        quantity: 10,
        uom: 'PCS',
        unitPrice: 699.00,
        taxableValue: 6990.00,
        gstRate: 18.0,
        cgstAmount: 0.00,
        sgstAmount: 0.00,
        igstAmount: 1258.20,
        totalAmount: 8248.20
      }
    ]
  }
];

export const api = {
  // Company
  async getCompany() {
    const store = this.getActiveStore();
    if (store) return store;
    try {
      const res = await fetch(`${API_BASE_URL}/companies/current`);
      if (res.ok) return await res.json();
    } catch (_) { }
    return MOCK_COMPANY;
  },

  async updateCompany(companyData) {
    const store = this.getActiveStore();
    const updatedStore = { ...(store || {}), ...companyData };

    // Attempt backend update
    try {
      const res = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore)
      });
      if (res.ok) {
        const saved = await res.json();
        this.syncSessionStore(saved);
        return saved;
      }
    } catch (_) { }

    // Fallback sync session & local users registry
    this.syncSessionStore(updatedStore);
    return updatedStore;
  },

  syncSessionStore(updatedStore) {
    const sessionStr = localStorage.getItem('apex_auth_session') || sessionStorage.getItem('apex_auth_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        session.store = updatedStore;
        if (localStorage.getItem('apex_auth_session')) {
          localStorage.setItem('apex_auth_session', JSON.stringify(session));
        } else {
          sessionStorage.setItem('apex_auth_session', JSON.stringify(session));
        }

        // Also sync user in local users list
        const localUsers = JSON.parse(localStorage.getItem('apex_local_users') || '[]');
        const updatedUsers = localUsers.map(u => {
          if (u.id === session.user?.id || u.email?.toLowerCase() === session.user?.email?.toLowerCase()) {
            return { ...u, store: updatedStore };
          }
          return u;
        });
        localStorage.setItem('apex_local_users', JSON.stringify(updatedUsers));
      } catch (_) { }
    }
  },

  async updateCurrentUser(userData) {
    const sessionStr = localStorage.getItem('apex_auth_session') || sessionStorage.getItem('apex_auth_session');
    let session = sessionStr ? JSON.parse(sessionStr) : null;
    if (!session) return userData;

    const updatedUser = { ...session.user, ...userData };
    session.user = updatedUser;

    if (localStorage.getItem('apex_auth_session')) {
      localStorage.setItem('apex_auth_session', JSON.stringify(session));
    } else {
      sessionStorage.setItem('apex_auth_session', JSON.stringify(session));
    }

    // Update in local users registry
    const localUsers = JSON.parse(localStorage.getItem('apex_local_users') || '[]');
    const updatedUsers = localUsers.map(u => {
      if (u.id === updatedUser.id || u.email?.toLowerCase() === updatedUser.email?.toLowerCase()) {
        return {
          ...u,
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          email: updatedUser.email,
          ...(userData.newPassword ? { password: userData.newPassword } : {})
        };
      }
      return u;
    });
    localStorage.setItem('apex_local_users', JSON.stringify(updatedUsers));

    return updatedUser;
  },

  // Store helper to scope data per registered store
  getActiveStore() {
    try {
      const saved = localStorage.getItem('apex_auth_session') || sessionStorage.getItem('apex_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.store) return parsed.store;
      }
    } catch (_) { }
    return null;
  },

  getActiveStoreId() {
    const store = this.getActiveStore();
    return store?.id || null;
  },

  // Parties (Customers & Vendors)
  async getParties(search = '') {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      let url = `${API_BASE_URL}/parties`;
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      if (search) params.append('search', search);
      const queryStr = params.toString();
      if (queryStr) url += `?${queryStr}`;

      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) { }

    // Offline / Client store isolation fallback:
    // Only return mock parties if store is the static preview presentation
    const isPreview = Boolean(store?.isPreview);
    const storePartiesKey = companyId ? `apex_parties_${companyId}` : null;
    let localStoreParties = [];
    if (storePartiesKey) {
      localStoreParties = JSON.parse(localStorage.getItem(storePartiesKey) || '[]');
    }

    const source = (localStoreParties.length > 0 || !isPreview)
      ? localStoreParties
      : MOCK_PARTIES;

    return source.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  },

  async createParty(party) {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      const url = companyId ? `${API_BASE_URL}/parties?companyId=${encodeURIComponent(companyId)}` : `${API_BASE_URL}/parties`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(party)
      });
      if (res.ok) return await res.json();
    } catch (_) { }

    const newParty = { ...party, id: 'p-' + Date.now(), currentBalance: 0 };
    if (companyId) {
      const storePartiesKey = `apex_parties_${companyId}`;
      const existing = JSON.parse(localStorage.getItem(storePartiesKey) || '[]');
      existing.push(newParty);
      localStorage.setItem(storePartiesKey, JSON.stringify(existing));
    } else {
      MOCK_PARTIES.push(newParty);
    }
    return newParty;
  },

  // Items & Inventory
  async getItems(search = '') {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      let url = `${API_BASE_URL}/items`;
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      if (search) params.append('search', search);
      const queryStr = params.toString();
      if (queryStr) url += `?${queryStr}`;

      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) { }

    // Only return mock items for static preview; all user stores start 100% empty
    const isPreview = Boolean(store?.isPreview);
    const storeItemsKey = companyId ? `apex_items_${companyId}` : null;
    let localStoreItems = [];
    if (storeItemsKey) {
      localStoreItems = JSON.parse(localStorage.getItem(storeItemsKey) || '[]');
    }

    const source = (localStoreItems.length > 0 || !isPreview)
      ? localStoreItems
      : MOCK_ITEMS;

    return source.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.barcode === search);
  },

  async getItemByBarcode(barcode) {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      const url = companyId
        ? `${API_BASE_URL}/items/barcode/${barcode}?companyId=${encodeURIComponent(companyId)}`
        : `${API_BASE_URL}/items/barcode/${barcode}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) { }

    const items = await this.getItems();
    return items.find(i => i.barcode === barcode) || null;
  },

  async createItem(item) {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      const url = companyId ? `${API_BASE_URL}/items?companyId=${encodeURIComponent(companyId)}` : `${API_BASE_URL}/items`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (_) { }

    const newItem = { ...item, id: 'i-' + Date.now() };
    if (companyId) {
      const storeItemsKey = `apex_items_${companyId}`;
      const existing = JSON.parse(localStorage.getItem(storeItemsKey) || '[]');
      existing.push(newItem);
      localStorage.setItem(storeItemsKey, JSON.stringify(existing));
    } else {
      MOCK_ITEMS.push(newItem);
    }
    return newItem;
  },

  // Invoices
  async getInvoices() {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      const url = companyId ? `${API_BASE_URL}/invoices?companyId=${encodeURIComponent(companyId)}` : `${API_BASE_URL}/invoices`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) { }

    // Only return mock invoices for static preview; all user stores start 100% empty
    const isPreview = Boolean(store?.isPreview);
    const storeInvoicesKey = companyId ? `apex_invoices_${companyId}` : null;
    let localStoreInvoices = [];
    if (storeInvoicesKey) {
      localStoreInvoices = JSON.parse(localStorage.getItem(storeInvoicesKey) || '[]');
    }

    return (localStoreInvoices.length > 0 || !isPreview)
      ? localStoreInvoices
      : MOCK_INVOICES;
  },

  async createInvoice(invoiceData) {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      const payload = companyId ? { ...invoiceData, companyId } : invoiceData;
      const res = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (_) { }

    // Fallback client simulation per store
    const prefix = store?.invoicePrefix || MOCK_COMPANY.invoicePrefix || 'INV/26-27';
    const nextSeq = (store?.nextInvoiceSequence || 101);
    if (store) store.nextInvoiceSequence = nextSeq + 1;

    const invNum = `${prefix}/${String(nextSeq).padStart(4, '0')}`;
    const parties = await this.getParties();
    const newInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: invNum,
      ...invoiceData,
      party: parties.find(p => p.id === invoiceData.partyId) || { name: 'Customer' },
      createdAt: new Date().toISOString()
    };

    if (companyId) {
      const storeInvoicesKey = `apex_invoices_${companyId}`;
      const existing = JSON.parse(localStorage.getItem(storeInvoicesKey) || '[]');
      existing.unshift(newInvoice);
      localStorage.setItem(storeInvoicesKey, JSON.stringify(existing));
    } else {
      MOCK_INVOICES.unshift(newInvoice);
    }
    return newInvoice;
  },

  // GST Verification
  async verifyGstin(gstin) {
    try {
      const res = await fetch(`${API_BASE_URL}/gst/verify/${gstin}`);
      if (res.ok) return await res.json();
    } catch (_) { }

    // Fallback regex & checksum
    const clean = (gstin || '').trim().toUpperCase();
    const valid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clean);
    const stateCode = clean.substring(0, 2);
    return {
      gstin: clean,
      isValid: valid,
      stateCode: stateCode,
      stateName: stateCode === '27' ? 'Maharashtra' : stateCode === '29' ? 'Karnataka' : 'Other State',
      pan: clean.substring(2, 12),
      message: valid ? 'Valid GSTIN structure' : 'Invalid GSTIN checksum or pattern'
    };
  },

  // Reports & Dashboard
  async getDashboardMetrics() {
    const store = this.getActiveStore();
    const companyId = store?.id;
    try {
      const url = companyId ? `${API_BASE_URL}/reports/dashboard?companyId=${encodeURIComponent(companyId)}` : `${API_BASE_URL}/reports/dashboard`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) { }

    const invoices = await this.getInvoices();
    const items = await this.getItems();

    const totalSales = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const cgst = invoices.reduce((sum, inv) => sum + (inv.cgstAmount || 0), 0);
    const sgst = invoices.reduce((sum, inv) => sum + (inv.sgstAmount || 0), 0);
    const igst = invoices.reduce((sum, inv) => sum + (inv.igstAmount || 0), 0);
    const totalRec = invoices.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0);
    const isPreview = Boolean(store?.isPreview);

    return {
      totalSales: totalSales,
      todaySales: totalSales,
      totalTaxCollected: cgst + sgst + igst,
      cgstCollected: cgst,
      sgstCollected: sgst,
      igstCollected: igst,
      totalItcAvailable: isPreview ? 124500.00 : 0.00,
      netTaxPayable: isPreview ? Math.max(0, (cgst + sgst + igst) - 124500.00) : (cgst + sgst + igst),
      totalReceivables: totalRec,
      totalPayables: isPreview ? 45000.00 : 0.00,
      totalInvoicesCount: invoices.length,
      lowStockCount: items.filter(i => i.currentStock <= i.minStockAlert).length
    };
  },

  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid credentials');
    } catch (e) {
      if (e.message && e.message !== 'Failed to fetch' && !e.message.includes('NetworkError')) {
        // If it's a real server error response, re-throw it
        if (!e.message.includes('fetch')) throw e;
      }

      // Real registered user accounts only:
      const localUsers = JSON.parse(localStorage.getItem('apex_local_users') || '[]');
      const allUsers = [...localUsers];

      const cleanEmail = (email || '').trim().toLowerCase();
      const match = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

      if (match && match.password === password) {
        return {
          token: 'apex-local-jwt-' + Date.now(),
          user: {
            id: match.id || 'u-seed-01',
            email: match.email,
            fullName: match.fullName,
            phone: match.phone,
            role: match.role || 'ADMIN'
          },
          store: match.store || MOCK_COMPANY,
          message: 'Login successful'
        };
      }
      throw new Error('Invalid email or password');
    }
  },

  async register(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    } catch (e) {
      if (e.message && e.message !== 'Failed to fetch' && !e.message.includes('NetworkError')) {
        if (!e.message.includes('fetch')) throw e;
      }

      // Offline/local fallback
      const stateObj = GST_STATES.find(s => s.code === (data.stateCode || '27')) || { code: '27', name: 'Maharashtra' };
      const prefix = (data.storeName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4) || 'INV').toUpperCase() + '/26-27';

      const newStore = {
        id: 'store-' + Date.now(),
        legalName: `${data.storeName} Pvt Ltd`,
        tradeName: data.storeName,
        gstin: data.gstin ? data.gstin.trim().toUpperCase() : null,
        stateCode: stateObj.code,
        stateName: stateObj.name,
        addressLine1: data.address || 'Commercial Center, Main Market',
        city: data.city || 'Mumbai',
        pincode: data.pincode || '400001',
        phone: data.phone,
        email: data.email.trim().toLowerCase(),
        upiId: `${data.storeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`,
        bankName: 'HDFC Bank',
        accountNumber: '502000' + Math.floor(10000000 + Math.random() * 90000000),
        ifscCode: 'HDFC0001234',
        branchName: 'Main Branch',
        invoicePrefix: prefix,
        nextInvoiceSequence: 101
      };

      const newUser = {
        id: 'u-' + Date.now(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        role: 'ADMIN',
        store: newStore
      };

      const localUsers = JSON.parse(localStorage.getItem('apex_local_users') || '[]');
      localUsers.push(newUser);
      localStorage.setItem('apex_local_users', JSON.stringify(localUsers));

      return {
        token: 'apex-local-jwt-' + Date.now(),
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          phone: newUser.phone,
          role: newUser.role
        },
        store: newStore,
        message: 'Store registration successful'
      };
    }
  }
};
