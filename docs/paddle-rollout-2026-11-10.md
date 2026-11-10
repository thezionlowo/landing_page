# Paddle USD rollout — 10 November 2026

USD plans use Paddle when explicitly enabled on the backend: Starter $250/year, Business $400/year, automatic annual renewal and Paddle's existing location-based tax. NGN retains Paystack and manual annual renewal. The free Zameria trial is separate. Current production payment routing has not been switched by this source change.

The website opens a server-created Paddle transaction, never a browser-selected price or currency. Client completion redirects to server verification and does not grant access. Signed webhooks verify the provider transaction and keep a stable licence across renewals/retries. Authenticated billing opens the owned customer's Paddle portal. Retain's customer identity is supplied only from the authenticated server session, never a cached profile or posted email. Checkout cannot create a second subscription for a store with an existing Paddle subscription.

Terms and Privacy now describe Paddle, automatic USD renewal, cancellation and transmitted data. /refunds is prerendered, included in the sitemap, and linked in checkout and policies. These source pages require the merchant's website deployment before they are public. /paddle-checkout supports direct navigation and Paddle's `_ptxn` default payment links. The WordPress ZIP is unchanged.

## Validation completed

- Real sandbox Starter and Business purchases activated verified Zameria licences in an isolated Firestore emulator. Starter base $250; New York tax $22.19; charged $272.19. Business base $400; tax $35.50; charged $435.50. No real money was taken.
- A real declined Business test card did not activate access; a valid test card subsequently succeeded. Unpaid verification was rejected. Repeated Starter verification returned the same licence.
- Seven real signed sandbox webhook deliveries, including end-of-term cancellation, were delivered on their first attempt with IP and signature verification enabled.
- The authenticated sandbox portal opened correctly. Anonymous requests were rejected; client-supplied customer IDs did not select the portal account. Canceling the test Starter subscription stopped future renewal while preserving its original paid licence expiry.
- Full Go regression suite passed, including existing Paystack/account/entitlement behavior. Paddle tests cover catalog/currency mismatch, forged/stale signatures, source-header spoofing, duplicate events, renewal idempotency, old-event ordering, full-refund revocation and preservation of newer paid access. Elapsed-year renewal/refund scenarios use isolated API fixtures; they are not claims that a real year elapsed in Paddle.
- Expanded Chrome checkout suite: 35 cases, 37 intercepted payment requests, zero real payments. Includes legacy USD/NGN selection, provider approval gate, annual-renewal disclosure, anonymous and authenticated Paddle identity, direct routes and policy hydration.
- Build, server types, 46 runtime-pricing cases, account session/restore, 19 cross-app pricing cases, account presentation and SEO checks passed. Source review found no embedded actual sandbox API key or webhook secret.

## Outstanding before live checkout

Live MCP access still reports read-only scopes at the latest check. Matching live products/prices/token/destination have not been provisioned. Live runtime API credentials must be stored privately on the backend. Existing live entities/secrets must be reused and never silently changed or rotated.

Paddle account verification and checkout domain approval were pending in the audit. Public /terms, /privacy, /refunds and direct /subscribe were returning 404 before this deployment. The merchant requested GitHub updates and will deploy locally; no production deployment or verification was started here.

The live checkout approval flag remains off. After deployment, verify the actual trusted-proxy chain, signed live delivery/replay and route availability before enabling it. The sandbox destination currently uses a temporary acceptance tunnel; reuse its ID/secret and update its URL to stable sandbox hosting for ongoing testing. Do not use the tunnel in production.

Plan changes for existing Paddle subscriptions currently require support. Portal upgrade/downgrade features must remain disabled until prorated subscription-update fulfillment is implemented and tested. Portal invoices, payment methods and cancellation are available. Existing manual Paystack licences are not automatically converted to recurring subscriptions.

Backend environment names, permissions, webhook events, rollback and deployment sequence: [Zameria Paddle runbook](https://github.com/avour/scoreflip-go/blob/main/ZAMERIA_PADDLE.md).
