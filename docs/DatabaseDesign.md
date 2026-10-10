# Apex GST Suite - Database Design (PostgreSQL)

## 1. Relational Schema Diagram (Entity Relationship)

```
┌──────────────────┐       1:N      ┌──────────────────┐
│    companies     │───────────────<│      users       │
└────────┬─────────┘                └──────────────────┘
         │ 1:N
         ├──────────────────────────┬──────────────────────────┐
         │ 1:N                      │ 1:N                      │ 1:N
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│     parties      │       │      items       │       │  invoice_series  │
│(Customers/Vendor)│       │(Goods & Services)│       └──────────────────┘
└────────┬─────────┘       └────────┬─────────┘
         │ 1:N                      │ 1:N
         ▼                          │
┌──────────────────┐                │
│     invoices     │                │
│(Sales & Billing) │                │
└────────┬─────────┘                │
         │ 1:N                      │
         ▼                          │
┌──────────────────┐                │
│  invoice_items   │>───────────────┘
└──────────────────┘
```

---

## 2. Table Definitions

### 2.1 `companies` (Tenant / Business Profile)
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    gstin VARCHAR(15) UNIQUE NOT NULL,
    pan VARCHAR(10) NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    upi_id VARCHAR(100),
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(15),
    logo_url TEXT,
    signature_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 `parties` (Customers & Vendors)
```sql
CREATE TABLE parties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    party_type VARCHAR(20) NOT NULL CHECK (party_type IN ('CUSTOMER', 'VENDOR', 'BOTH')),
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15),
    pan VARCHAR(10),
    state_code VARCHAR(2) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(150),
    billing_address TEXT NOT NULL,
    shipping_address TEXT,
    credit_period_days INT DEFAULT 30,
    credit_limit NUMERIC(12, 2) DEFAULT 0.00,
    opening_balance NUMERIC(12, 2) DEFAULT 0.00,
    current_balance NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 `items` (Inventory Catalog)
```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    item_type VARCHAR(10) DEFAULT 'GOODS' CHECK (item_type IN ('GOODS', 'SERVICE')),
    hsn_sac_code VARCHAR(10) NOT NULL,
    uom VARCHAR(20) DEFAULT 'PCS',
    purchase_price NUMERIC(12, 2) DEFAULT 0.00,
    selling_price NUMERIC(12, 2) NOT NULL,
    gst_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    cess_rate NUMERIC(5, 2) DEFAULT 0.00,
    current_stock NUMERIC(12, 3) DEFAULT 0.000,
    min_stock_alert NUMERIC(12, 3) DEFAULT 5.000,
    batch_tracking_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 `invoices` (Sales Invoices)
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    party_id UUID REFERENCES parties(id),
    invoice_number VARCHAR(50) NOT NULL,
    invoice_type VARCHAR(20) NOT NULL CHECK (invoice_type IN ('TAX_INVOICE', 'BILL_OF_SUPPLY', 'EXPORT', 'POS')),
    invoice_date DATE NOT NULL,
    due_date DATE,
    place_of_supply VARCHAR(2) NOT NULL,
    is_inter_state BOOLEAN NOT NULL DEFAULT FALSE,
    is_reverse_charge BOOLEAN NOT NULL DEFAULT FALSE,
    subtotal NUMERIC(14, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    taxable_amount NUMERIC(14, 2) NOT NULL,
    cgst_amount NUMERIC(12, 2) DEFAULT 0.00,
    sgst_amount NUMERIC(12, 2) DEFAULT 0.00,
    igst_amount NUMERIC(12, 2) DEFAULT 0.00,
    cess_amount NUMERIC(12, 2) DEFAULT 0.00,
    round_off NUMERIC(5, 2) DEFAULT 0.00,
    grand_total NUMERIC(14, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE')),
    amount_paid NUMERIC(14, 2) DEFAULT 0.00,
    balance_amount NUMERIC(14, 2) NOT NULL,
    notes TEXT,
    terms_and_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (company_id, invoice_number)
);
```

### 2.5 `invoice_items` (Line items)
```sql
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    item_name VARCHAR(255) NOT NULL,
    hsn_sac_code VARCHAR(10) NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL,
    uom VARCHAR(20) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) DEFAULT 0.00,
    taxable_value NUMERIC(14, 2) NOT NULL,
    gst_rate NUMERIC(5, 2) NOT NULL,
    cgst_rate NUMERIC(5, 2) DEFAULT 0.00,
    cgst_amount NUMERIC(12, 2) DEFAULT 0.00,
    sgst_rate NUMERIC(5, 2) DEFAULT 0.00,
    sgst_amount NUMERIC(12, 2) DEFAULT 0.00,
    igst_rate NUMERIC(5, 2) DEFAULT 0.00,
    igst_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(14, 2) NOT NULL
);
```
