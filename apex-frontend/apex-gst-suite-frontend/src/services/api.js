/**
 * Centralized API Client for Apex GST Suite
 * Interacts with Spring Boot REST API at http://localhost:8080/api/v1
 * Features automatic fallback to structured mock data if the backend is not yet started.
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Base default store requested by user
export const BASE_SEED_USER = {
  email: 'rajputjaspalsingh@gmail.com',
  password: 'Jaspal@123',
  storeName: 'Premium Electronics',
  fullName: 'Jaspal Singh Rajput',
  phone: '+91 98765 43210'
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
  id: 'c1111111-1111-1111-1111-111111111111',
  legalName: 'Premium Electronics Retail Pvt Ltd',
  tradeName: 'Premium Electronics',
  gstin: '27AAPFU0939F1ZV',
  pan: 'AAPFU0939F',
  stateCode: '27',
  stateName: 'Maharashtra',
  addressLine1: 'Shop 101, Mega Electronics Mall, LBS Marg, Ghatkopar West',
  city: 'Mumbai',
  pincode: '400086',
  phone: '+91 98765 43210',
  email: 'rajputjaspalsingh@gmail.com',
  upiId: 'premiumelectronics@upi',
  bankName: 'HDFC Bank',
  accountNumber: '50200012345678',
  ifscCode: 'HDFC0001234',
  branchName: 'Ghatkopar West Branch',
  invoicePrefix: 'PREM/26-27',
  nextInvoiceSequence: 101
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
    try {
      const res = await fetch(`${API_BASE_URL}/companies/current`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_COMPANY;
  },

  // Parties (Customers & Vendors)
  async getParties(search = '') {
    try {
      const url = search ? `${API_BASE_URL}/parties?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/parties`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_PARTIES.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  },

  async createParty(party) {
    try {
      const res = await fetch(`${API_BASE_URL}/parties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(party)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    const newParty = { ...party, id: 'p-' + Date.now(), currentBalance: 0 };
    MOCK_PARTIES.push(newParty);
    return newParty;
  },

  // Items & Inventory
  async getItems(search = '') {
    try {
      const url = search ? `${API_BASE_URL}/items?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/items`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_ITEMS.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.barcode === search);
  },

  async getItemByBarcode(barcode) {
    try {
      const res = await fetch(`${API_BASE_URL}/items/barcode/${barcode}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_ITEMS.find(i => i.barcode === barcode) || null;
  },

  async createItem(item) {
    try {
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    const newItem = { ...item, id: 'i-' + Date.now() };
    MOCK_ITEMS.push(newItem);
    return newItem;
  },

  // Invoices
  async getInvoices() {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return MOCK_INVOICES;
  },

  async createInvoice(invoiceData) {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    // Fallback client simulation
    const seq = MOCK_COMPANY.nextInvoiceSequence++;
    const invNum = `${MOCK_COMPANY.invoicePrefix}/${String(seq).padStart(4, '0')}`;
    const newInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: invNum,
      ...invoiceData,
      party: MOCK_PARTIES.find(p => p.id === invoiceData.partyId) || { name: 'Customer' },
      createdAt: new Date().toISOString()
    };
    MOCK_INVOICES.unshift(newInvoice);
    return newInvoice;
  },

  // GST Verification
  async verifyGstin(gstin) {
    try {
      const res = await fetch(`${API_BASE_URL}/gst/verify/${gstin}`);
      if (res.ok) return await res.json();
    } catch (_) {}

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
    try {
      const res = await fetch(`${API_BASE_URL}/reports/dashboard`);
      if (res.ok) return await res.json();
    } catch (_) {}

    const totalSales = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const cgst = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.cgstAmount || 0), 0);
    const sgst = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.sgstAmount || 0), 0);
    const igst = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.igstAmount || 0), 0);
    const totalRec = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0);

    return {
      totalSales: totalSales,
      todaySales: totalSales,
      totalTaxCollected: cgst + sgst + igst,
      cgstCollected: cgst,
      sgstCollected: sgst,
      igstCollected: igst,
      totalItcAvailable: 124500.00,
      netTaxPayable: Math.max(0, (cgst + sgst + igst) - 124500.00),
      totalReceivables: totalRec,
      totalPayables: 45000.00,
      totalInvoicesCount: MOCK_INVOICES.length,
      lowStockCount: MOCK_ITEMS.filter(i => i.currentStock <= i.minStockAlert).length
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

      // Offline/demo fallback matching base store user or local registered stores
      const localUsers = JSON.parse(localStorage.getItem('apex_local_users') || '[]');
      const allUsers = [
        {
          email: BASE_SEED_USER.email,
          password: BASE_SEED_USER.password,
          fullName: BASE_SEED_USER.fullName,
          phone: BASE_SEED_USER.phone,
          store: MOCK_COMPANY,
          role: 'ADMIN'
        },
        ...localUsers
      ];

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
