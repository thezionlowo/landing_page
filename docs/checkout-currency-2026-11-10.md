# Checkout currency investigation — 10 November 2026

There was a confirmed checkout bug. A selected USD quote could become NGN when a Nigerian account session was restored. Earlier regression results did not certify this browser flow: the old test explicitly expected saved account settings to override the marketing selection. That expectation was incorrect for the pricing-page purchase flow.

## Reproduction and cause

The public website served `/assets/index-D289vnK7.js` during this investigation. Its checkout resolver prioritised `customer.country`, billing-address country and account currency over the explicit checkout URL.

Using the live public frontend in a fresh browser, with fictional account and geolocation responses intercepted locally:

| Account state | Clicked link | Checkout before fix |
| --- | --- | --- |
| Anonymous | `/subscribe?plan=starter&country=US&currency=USD` | $250/year |
| Restored Nigerian account | Same USD link | ₦200,000/year |

No real account was accessed, changed or charged. The conflicting resolver and its old test came from website commit `17e233b`, dated 4 November 2026. This was present before the recent WordPress ReactDOM/checker release; the checker results did not detect it.

## Change

An explicit checkout region/currency now takes priority, followed by saved account settings and then detected location. This preserves the quote selected on the pricing page, including after account restoration, geolocation, a refresh or changing plans. Purchases started without an explicit quote still default to the saved billing region. This resolver does not update existing subscriptions, licences, invoices or payment records.

The fixed annual prices remain Starter $250 / Business $400 in USD and Starter ₦200,000 / Business ₦300,000 in NGN. There is no exchange-rate conversion. The existing backend still calculates authoritative amounts and rejects mismatched country/currency; no backend payment logic was changed.

The expanded browser check also exposed a separate React hydration error on direct checkout loads. Vercel serves the homepage HTML as the `/subscribe` SPA shell. The prerenderer now marks which route produced the HTML; the browser only hydrates matching routes and mounts other routes normally.

## Validation

- The new explicit-quote regression failed against the original resolver (`NGN !== USD`) and passes with the fix. It covers both plans, both currencies, seven account/profile shapes and both detected regions.
- The production TypeScript/server build and 31-page prerender pass.
- `npm run test:checkout:browser`: **30 scenarios pass**, with **35 payment requests intercepted** and **zero real payments**. Covers anonymous, NGN and USD accounts; desktop/mobile; both plans/currencies; comparison selection; refresh/back; currency-only links; saved-region fallback; delayed account and geolocation responses; expired cached sessions; and hydration of homepage, auth, policy and marketing routes. No uncaught browser errors in the completed run.
- Compiled pricing runtime: **46 cases pass**, including cache, fallback, timeout, explicit overrides and production server imports.
- Cross-application fixed-price/lifecycle suite: **19 tests pass**.
- Account session restoration, credential-cache migration, server sessions, CSRF/expiry/password change, licence state and account presentation regressions pass.
- SEO: 27 canonical pages, 1,171 internal targets, 24 redirects and indexing/schema checks pass.
- Website plugin download verification passes; plugin ZIP and receipt are unchanged.

Reproduce after `npm ci` with Chrome installed (or set `CHROME_EXECUTABLE_PATH`):

```sh
npm run build
node --import tsx src/__tests__/checkout-comparison-regression.tsx
npm run test:pricing
npm run test:checkout:browser
```

Full local investigation logs are in the shared workspace at `regression-artifacts/pricing-choice-2026-11-10/`.

## Deployment and remaining limits

Deploy the updated **landing_page main** revision, including `dist` generated from the matching source and the existing API functions. Do not mix new JavaScript with old prerendered HTML. The plugin remains version 0.2.15 and does not need repackaging for this website fix.

GitHub publication is not deployment. Repeat the reported flow after deployment with a signed-in Nigerian account and check both USD plans, then NGN. Use the provider's test environment to confirm USD support, provider checkout, verification and webhook handling. Browser QA intercepted the payment boundary and does not certify live provider configuration. The backend Go tests were not rerun for this website-only fix because the local Go toolchain is unavailable.

These results establish the tested source behavior. They do not establish that the whole platform is production-ready or that every prior change is regression-free.
