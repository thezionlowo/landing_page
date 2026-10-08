# ZAMERIA Customer Account & Landing Page

The official customer-facing web portal and single source of truth for the **ZAMERIA Standalone SaaS Ecosystem**.

## Overview

This application manages:
* **Customer Registration & Authentication**: Secure merchant sign-up and login portal.
* **Subscription Plans & Pricing**: Authoritative annual plan tiers:
  * **Starter**: ₦200,000/year (Nigeria) / $200/year (Global). Includes up to 2 active registers and 500 catalog products.
  * **Business**: ₦300,000/year (Nigeria) / $300/year (Global). Includes unlimited active registers and unlimited catalog products.
* **Store Connection**: Direct WooCommerce store linkage enabling the POS software to seamlessly communicate with the merchant's online store via the ZAMERIA plugin bridge.

---

## Ecosystem Integration

The ZAMERIA ecosystem operates as a modern Software-as-a-Service (SaaS) platform, completely decoupled from the WordPress admin panel:

1. **ZAMERIA Web / SaaS App** (The core POS interface where sales happen)
2. **ZAMERIA Mobile App** (Capacitor wrappers for Android and iOS)
3. **ZAMERIA WooCommerce Plugin** (The silent background bridge installed on the merchant's WordPress site)
4. **ZAMERIA Admin Control Center** (Internal support and operations dashboard)
5. **ZAMERIA Cloud API** (Authoritative licensing, billing, and routing backend)

The customer journey is simple: *Download the ZAMERIA App -> Create an Account -> Connect your Store -> Start Selling.*

---

## Key Routes

* `/` — Marketing landing page with transparent plan pricing
* `/get-started` — Merchant registration
* `/login` — Clean, production-ready merchant login
* `/account` — Centralized customer account, billing, entitlement, and connected store management

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

### Production Build

```bash
npm run build
```
