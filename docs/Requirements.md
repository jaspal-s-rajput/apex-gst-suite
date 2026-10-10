# Apex GST Suite - Product Requirements & Functional Specification

## 1. Project Overview
**Apex GST Suite** is a modern, high-performance Enterprise GST Billing, Invoicing, and Inventory Management System tailored for Indian SMEs, retail counters, distributors, and enterprises. 

### Core Value Proposition
- Instant GST-compliant tax invoicing (B2B & B2C) with auto CGST/SGST/IGST computation based on Place of Supply.
- Real-time inventory tracking with stock-in/stock-out ledgers, batch & expiry monitoring, and reorder alerts.
- Compliance-ready reports (GSTR-1, GSTR-3B, HSN summary, Tax Liability vs Input Tax Credit).
- Modern innovations: Dynamic NPCI UPI QR codes, instant WhatsApp sharing, smart HSN lookup, and high-speed POS billing mode.

---

## 2. Module & Page Architecture

```
apex-gst-suite/
├── Dashboard (Business Cockpit & Financial Overview)
├── Invoicing & Sales (Billing Engine)
│   ├── Create Invoice (Standard B2B / B2C)
│   ├── Quick POS Counter (High-speed barcode & keyboard mode)
│   ├── Invoice History & Status (Draft, Paid, Partial, Overdue, Cancelled)
│   ├── Quotations / Estimates & Proforma Invoices
│   └── Credit & Debit Notes
├── Inventory & Stock Management
│   ├── Items & Services Catalog (HSN, Barcode, UOM, Pricing)
│   ├── Stock Adjustments & Movement History
│   ├── Batch & Expiry Tracker
│   └── Barcode Generator & Print Station
├── Purchases & Vendors
│   ├── Purchase Invoices (with Input Tax Credit / ITC capture)
│   ├── Purchase Orders (PO) & GRN
│   └── Vendor Directory & Payables Ledger
├── Parties / Customers & Vendors
│   ├── Customer Directory (GSTIN, State Code, Credit Limits)
│   ├── Vendor Directory
│   └── Party Ledger & Statement Generator
├── GST Compliance & Tax Reports
│   ├── GSTR-1 Prep (Tables 4, 5, 7, 12 HSN Summary, 13 Doc Summary)
│   ├── GSTR-3B Worksheet (Tax Payable vs Eligible ITC)
│   ├── HSN / SAC Summary Report
│   └── Sales & Profitability Analytics
└── Settings & Organization Profile
    ├── Company Profile (GSTIN, PAN, Address, Logo, Signature)
    ├── Invoice Numbering & Prefix Sequences
    ├── Bank Accounts & Dynamic UPI Configuration
    └── Multi-Template Invoice Designer
```

---

## 3. Detailed Page-by-Page Specifications

### Page 1: Dashboard (`/dashboard`)
* **Key Metrics Cards:**
  - Today's Sales & Month-to-Date (MTD) Turnover.
  - Net GST Collected (CGST + SGST + IGST Breakdown).
  - Input Tax Credit (ITC) Available from Purchases.
  - Outstanding Receivables & Payables.
* **Operational Widgets:**
  - Low Stock Alert List (items under minimum threshold).
  - Recent Invoices table with quick download/view.
  - Monthly Sales vs Purchase trend chart.
* **Quick Action FAB (Floating Action Bar):**
  - "New Invoice", "Quick POS Sale", "Add Product", "Record Purchase".

### Page 2: Tax Invoice Generator (`/invoices/new`)
* **Header Information:**
  - Auto-generated sequential Invoice No. (e.g. `INV/2026-27/0042`).
  - Invoice Date, Due Date, Place of Supply (State Code selector).
  - Reverse Charge Mechanism (RCM) toggle.
* **Party Selection:**
  - Customer Search / Add New modal.
  - GSTIN Auto-checksum validation (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`).
  - Auto-detect Inter-state (IGST) vs Intra-state (CGST + SGST) based on Company State vs Customer State.
* **Item Line-Item Table:**
  - Item selector (Typeahead search by Name, SKU, or Barcode).
  - HSN / SAC Code (auto-filled, editable).
  - Quantity & Unit of Measurement (UOM: PCS, KGS, BOX, MTR, etc.).
  - Rate / Unit Price (Tax Exclusive or Tax Inclusive toggle).
  - Discount (% or Flat ₹).
  - Tax Rate Selector (0%, 5%, 12%, 18%, 28%, Cess).
  - Computed Taxable Value, CGST ₹, SGST ₹, IGST ₹, Total ₹.
* **Footer & Payment Terms:**
  - Subtotal, Total Tax, Auto Round-off (to nearest ₹), Grand Total in figures and words.
  - Payment Mode (Cash, UPI, NEFT/RTGS, Credit, Cheque).
  - Amount Paid & Balance Due.
  - Dynamic UPI QR Code preview on invoice.
  - Terms & Conditions and Bank Details display.
* **Output Formats:**
  - Live Print Preview.
  - PDF Export (Standard A4 Corporate, Clean Modern, Classic CA Format).
  - POS Thermal 80mm/58mm slip format.
  - Direct WhatsApp share link with pre-filled message and payment details.

### Page 3: Quick POS Counter Billing (`/pos`)
* **Optimized for Retail / High-Volume Counters:**
  - Barcode scanner input listener (auto item lookup & add).
  - 100% Keyboard-friendly shortcuts (`F2`: Focus search, `F4`: Tender/Pay, `Enter`: Complete & Print).
  - Fast cash calculator (Tendered amount -> Change due).
  - Instant thermal receipt trigger.

### Page 4: Inventory & Items Management (`/inventory`)
* **Item Directory:**
  - Type (Goods vs Services).
  - Item Name, SKU, Barcode, Category, Brand.
  - HSN/SAC Code lookup with tax slab.
  - Purchase Price (Cost) & Selling Price (MRP / Wholesale).
  - Opening Stock, Current Stock, Reorder Minimum Level.
* **Batch & Expiry Tracking:**
  - Batch Number, Manufacturing Date, Expiry Date.
  - Expiry warning indicator (< 30 days, Expired).
* **Stock Operations:**
  - Stock Adjustment (Reason: Damaged, Lost, Physical Audit).
  - Stock Inward / Outward ledger.
  - Barcode label generator & bulk print utility.

### Page 5: Purchases & Expenses (`/purchases`)
* **Purchase Bill Entry:**
  - Vendor invoice number & bill date.
  - Vendor GSTIN & State.
  - Capture eligible Input Tax Credit (ITC - All Other ITC, Ineligible).
  - Automatic inventory addition upon invoice saving.
* **Vendor Directory & Ledger:**
  - Statement of accounts (debits, credits, closing balance).

### Page 6: GST Compliance & Returns Hub (`/gst-reports`)
* **GSTR-1 Summary Generator:**
  - Table 4A, 4B, 4C: B2B Invoices (registered buyers).
  - Table 5: B2C Large (inter-state > ₹2.5 Lakhs).
  - Table 7: B2C Small (intra-state or inter-state < ₹2.5 Lakhs).
  - Table 9B: Credit / Debit Notes.
  - Table 12: HSN-wise summary of outward supplies.
  - Table 13: Documents issued summary (Serial number tracking).
  - Export to CSV / JSON format for GST Offline Tool.
* **GSTR-3B Reconciliation:**
  - Summary of Outward Taxable Supplies.
  - Summary of Eligible ITC (from Purchase Bills).
  - Net Tax Payable = Output Tax - Input Tax Credit.

### Page 7: Settings & Customization (`/settings`)
* **Business Master:**
  - Company Legal Name, Trade Name, GSTIN, PAN.
  - Registered Address, Contact, Email, Website.
  - Logo upload & Authorized Signature upload.
* **Financial & Banking:**
  - Bank Name, Account Number, IFSC, Branch.
  - UPI ID (VPA) for dynamic QR code generation.
* **Customization:**
  - Invoice prefix configuration (`FY/INV/001`).
  - Invoice theme customizer (Accent color, layout style, header fonts).

---

## 4. Innovation & Modern Feature Additions ("What's New")

1. **Dynamic NPCI UPI QR Code on Invoices:**
   - Embeds standard `upi://pay?pa={vpa}&pn={name}&am={amount}&tr={inv_id}&cu=INR` QR code directly on both digital and printed invoices.
   - Customers can scan with Google Pay, PhonePe, or Paytm and pay the exact billed amount immediately.
2. **GSTIN Checksum & State Decoding:**
   - Real-time client-side verification of 15-character GSTIN structure, identifying state jurisdiction and alerting invalid checksums before saving.
3. **Smart HSN / SAC Finder:**
   - Search by common keywords (e.g., "shoe", "laptop repair", "consulting") with recommended GST tax slabs.
4. **Multi-Layout Invoice Designer:**
   - Switch between **Corporate Modern**, **Minimalist Indigo**, **Classic CA Tax Invoice**, and **Compact Thermal Receipt** in 1 click.
5. **Instant WhatsApp Billing:**
   - Generate automated WhatsApp text format with invoice download link, breakdown, and payment link for one-click dispatch to customer mobile numbers.
6. **E-Way Bill Threshold Warning:**
   - Intelligent detection of consignments with taxable value exceeding ₹50,000 for inter-state movement, providing an E-Way bill checklist.
7. **Offline-Resilient POS Mode:**
   - LocalStorage/IndexedDB backup for uninterrupted billing even during network drops.
