# Apex GST Suite - System Architecture

## 1. High-Level Architecture Overview

Apex GST Suite is structured as a decoupled, enterprise-grade multi-tier web application:

```
[ Client Layer (Vite + React 19) ]
           │
           │  HTTPS / REST APIs / JSON
           ▼
[ API Gateway & Security (Spring Boot Security + JWT) ]
           │
    ┌──────┴──────────────────────────┐
    ▼                                 ▼
[ Core Billing & Inventory ]     [ GST Compliance & Reports ]
  - Invoicing Engine               - GSTR-1 & 3B Aggregator
  - POS Counter Engine             - HSN/SAC Engine
  - Stock & Movement Tracker       - Dynamic UPI QR Engine
    │                                 │
    └──────────────┬──────────────────┘
                   ▼
[ Data Layer: PostgreSQL 16 ]
  - ACID transactions for billing & stock decrement
  - Foreign key constraints & audit history
```

---

## 2. Frontend Architecture (`apex-frontend`)

### Technology Choices
* **Framework:** React 19 + Vite (Fast HMR, lightweight bundle).
* **Styling & Design System:** Tailored modern CSS design tokens (responsive, dark/light theme ready, glassmorphic UI cards, accessible contrast, vibrant accents).
* **State Management:** React Context + Custom Hooks for Invoicing, Cart/POS state, and Offline cache.
* **Icons & Visuals:** Lucide icons / SVG icon system for crisp rendering.
* **Printing & PDF Generation:** Built-in CSS Print Media Queries (`@media print`) + dynamic client-side canvas/PDF generator for pixel-perfect A4 & 80mm thermal receipts.
* **Testing:** Playwright Automation for end-to-end billing tests, invoice calculations, and POS keyboard shortcut workflows.

### Directory Structure
```
apex-frontend/apex-gst-suite-frontend/src/
├── assets/                  # Logos, icons, branding assets
├── components/              # Reusable UI components
│   ├── common/              # Button, Input, Modal, Table, Badge, Card, Toast
│   ├── layout/              # Sidebar, Topbar, AppLayout, PageHeader
│   ├── invoice/             # InvoicePreview, InvoiceForm, UPIScanModal, LineItemRow
│   ├── inventory/           # ItemModal, StockAdjustmentModal, BarcodeCard
│   └── pos/                 # POSHeader, POSNumpad, POSCart, POSItemGrid
├── context/                 # AuthContext, CompanyContext, ToastContext
├── hooks/                   # useInvoiceCalculation, useGSTINValidator, useBarcodeScanner
├── pages/                   # Route-level views
│   ├── DashboardPage.jsx
│   ├── InvoicesPage.jsx
│   ├── CreateInvoicePage.jsx
│   ├── POSPage.jsx
│   ├── InventoryPage.jsx
│   ├── PurchasesPage.jsx
│   ├── PartiesPage.jsx
│   ├── GSTReportsPage.jsx
│   └── SettingsPage.jsx
├── services/                # API client, LocalStorage sync, GST mock/live client
├── utils/                   # GST tax math, numberToWords converter, date formatters, validation
├── App.jsx                  # Router setup & layout wrapper
└── main.jsx                 # Entry point
```

---

## 3. GST Calculation & Rule Engine

### Intra-State vs Inter-State Rule
- **Supplier State Code:** Extracted from Company Profile GSTIN (first 2 digits, e.g., `27` for Maharashtra).
- **Place of Supply (POS):** Extracted from Customer GSTIN or manually selected destination state.
- **Computation:**
  - If `Supplier State == Place of Supply`:
    - `CGST Rate = Total GST Rate / 2`
    - `SGST Rate = Total GST Rate / 2`
    - `IGST Rate = 0%`
  - If `Supplier State != Place of Supply`:
    - `CGST Rate = 0%`
    - `SGST Rate = 0%`
    - `IGST Rate = Total GST Rate`
- **Reverse Charge Mechanism (RCM):**
  - When enabled, tax amount is shown on the invoice for liability documentation, but not added to the customer receivable total.

---

## 4. Backend Architecture (Spring Boot & PostgreSQL)

### API Endpoints Overview
* `/api/v1/auth`: JWT Login, Registration, Refresh Tokens.
* `/api/v1/company`: Profile, Bank & UPI details, Tax settings.
* `/api/v1/invoices`: CRUD, Sequential number generator, Status updates, PDF stream.
* `/api/v1/items`: Product & Service directory, Stock levels, HSN code query.
* `/api/v1/purchases`: Purchase bills, Vendor credit tracking, Stock replenishment.
* `/api/v1/parties`: Customer and Vendor CRM, balance ledger.
* `/api/v1/reports/gstr1`: Table 4, 5, 7, 12, 13 data extracts.
* `/api/v1/reports/gstr3b`: Net summary for monthly return filing.

---

## 5. Zero-Cost Architecture Principle (Strict Zero Recurring Cost)

Apex GST Suite is strictly architected to operate at **100% free of cost with zero recurring charges, zero paid API dependencies, and zero subscriptions**:

1. **In-House GST Logic & Verification:** All tax split calculations and GSTIN checksum verifications are executed via in-house algorithms (Luhn mod-36), eliminating the need for paid GSTN/GSP APIs.
2. **Direct Peer-to-Peer UPI:** Employs the open NPCI URI standard (`upi://pay?...`) with dynamic QR generation, bypassing payment gateway merchant fees (0% transaction surcharge).
3. **Government Portal File Generation:** Produces official Government-compliant JSON and Excel formats that users can directly upload into the free GST Offline Tool, bypassing paid filing intermediary SaaS platforms.
4. **Zero-Cost Communications:** Leverages free client-side deep links (`wa.me` for WhatsApp and native `mailto:` for Email), completely avoiding paid WhatsApp Business Cloud or SMS gateway fees.
5. **Self-Hosted & Open-Source:** Backend (Spring Boot), Frontend (React/Vite), and Database (PostgreSQL) are 100% open-source and run locally or on self-managed infrastructure without licensing fees.

