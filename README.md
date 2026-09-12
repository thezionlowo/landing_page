# ZAMERIA Customer Account & Landing Page

The official customer-facing web portal and single source of truth for the **ZAMERIA Unified Retail Ecosystem**.

## Overview

This application manages:
* **Customer Registration & Authentication**: Secure merchant sign-up and login portal.
* **Subscription Plans & Pricing**: Authoritative plan tiers:
  * **Starter**: 7-Day Free Trial / Evaluation, 1 store, 500 products, 2 staff/cashiers.
  * **Business**: ₦30,000/month (₦25,000/mo billed annually), 1 store, unlimited products, 5 staff/cashiers.
  * **Business Plus**: ₦50,000/month, multi-store, unlimited products, unlimited staff.
* **Trial Lifecycle**: Single-use `ZMR-TRL-XXXX-XXXX` activation code issuance and automatic 7-day expiration gating.
* **Software License Issuance**: Authoritative issuance of paid license keys (`ZMR-XXXX-XXXX-XXXX`) upon plan upgrade.
* **Store Domain Authorization**: Dynamic binding of licenses to verified WooCommerce store domains.

---

## Ecosystem Integration

The ZAMERIA ecosystem consists of three synchronized client applications communicating with the authoritative cloud backend:

1. **Customer Account & Portal** (This repository): `http://localhost:5174`
2. **WooCommerce Plugin Dashboard (`ZMPLUGIN`)**: `http://localhost:5182`
3. **Sales / POS Dashboard (`ZMPOS`)**: `http://localhost:5176`
4. **Authoritative Cloud API**: `http://localhost:5190`

---

## Key Routes

* `/` or `/#pricing` — Marketing landing page with transparent plan pricing
* `/get-started` — Merchant registration and trial code generation
* `/login` — Clean, production-ready merchant login
* `/account` — Centralized customer account, billing, license, and connected store management

---

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```
Runs the development server on `http://localhost:5174` bound to `0.0.0.0`.

### Production Build

```bash
npm run build
```

### End-to-End Regression Testing

```bash
npm run test:e2e
```
Executes the comprehensive cross-system integration and synchronization test suite (`src/__tests__/e2e-sync-test.ts`).
