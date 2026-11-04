# ZAMERIA website design system

The homepage, public content pages, authentication, checkout, assessments and merchant portal use one connected-commerce identity: white surfaces, deep navy product environments, cobalt actions, restrained borders and clear typography. All public footers use the shared navy surface and the white logo. The landing page puts the interactive product ahead of decorative cards.

## Shared sources

- `public/brand-foundations.css`: the colour, font, border and radius primitives. It is also loaded by the standalone assessment HTML files.
- `src/components/SiteChrome.tsx`: brand mark, public header, responsive navigation and footer. `Navbar` and `Footer` re-export these shared components for existing pages.
- `src/styles/home.css`: base workspace and shared navigation/footer layouts.
- `src/styles/landing.css`: the product-first landing page, responsive composition.
- `src/components/InteractiveWorkspace.tsx`: the actual POS iframe, with its native navigation.
- `src/styles/site.css`: shared header/footer, primary controls, subpages, auth forms, checkout, portal and support styling.
- `src/content/marketingPages.ts` and `src/pages/MarketingPage.tsx`: plain-English content and one responsive layout for product, industry and guide pages.
- `src/styles/content.css` and `src/styles/account.css`: readable public page and merchant account layouts.
- `src/components/DeviceShowcase.tsx` and `DeviceScreen.tsx`: device frames displaying the real app, loaded only near the viewport.
- `public/assessment-theme.css`: the same identity for both React assessment flows and all standalone assessment HTML variants.

## Conventions

Use the `--site-*` primitives for new brand styling. Keep marketing headings spacious and medium-weight; use smaller, practical typography for working screens. Use `--site-primary` for primary actions and selected states; use `--site-dark` for footers, product panels and the merchant sidebar, and preserve distinct success, warning and error colours.

Keep the public header/footer shared. Link to homepage sections with `/#section-id` so navigation works from subpages. Downloads must have a filename in their `download` attribute to avoid interception by the SPA router.

Use `site-responsive-columns` for two-column groups that must stack below 640px. The footer logo uses `BrandMark light`. Simplified auth/checkout footers use the same dark tokens. Form labels and input focus states stay visible. Respect reduced-motion preferences.

The POS deliberately retains its original Inter, navy (#071A31) and light blue (#60A5FA) design. Marketing tokens must not be copied into the POS. The landing demo compiles the real App, including sale, analytics, orders, customers, products and settings. It uses a separate IndexedDB database, skincare sample products and history, no real auth session or sync loop, and CSP blocks API calls. Demo sales and CRUD persist locally; settings, printing preferences and logos use a namespaced storage adapter. Support is explicitly simulated. No external frame, duplicated navigation or read-only overlay surrounds the app. Run `npm run refresh:product-preview` after POS source changes; prebuild verifies source and asset checksums to catch stale previews. This does not publish or update a downloadable plugin release.

Landing sections alternate pale blue, white and navy surfaces. Keep the copy concise and let the actual product demonstrate its interface. Auth forms sit inside a white bordered card on a pale blue page.
The production build prerenders 25 canonical public pages, three auth pages and a custom 404. Duplicate pages are merged with permanent redirects. Private forms and account routes are excluded from the sitemap and carry noindex rules. Metadata and FAQ structured data come from the same content that is displayed. Run `npm run build`, `npm run test:seo`, and the existing merchant-state regression suite after a shared visual change. Browser verification remains necessary for responsive layouts and real interactions.

Login and signup use `site-auth-simple`: a centred form, no marketing sidebar, and one primary action. Signup requests business name, email and password; store connection follows account creation. The mobile public header contains only the logo and menu, with account actions inside the menu.

Checkout uses `site-checkout-simple`: selected plan and annual total, business name, email, store URL, and the payment button. Use one short sentence to explain the next step. `PlanComparison.tsx` is the shared native dialog for public pricing links, checkout and the account plan chooser; it keeps both plans side by side at mobile widths. Business has a quiet column highlight and a stronger action. Never change the selected plan without a choice. Resolve prices through `checkoutPricing` and preserve country/currency in plan links. A signed-in customer's billing region takes precedence; payment verification remains authoritative. Run `npm run test:checkout` to check both currencies, plan amounts, regional navigation and mocked payment payloads.

The four device mockups show different real screens: desktop sales dashboard, laptop checkout, iPad products and mobile orders. The frames are decorative and inert; the large hero demo retains full navigation and local demo workflows. All use skincare demo data. Separate frames serialize initial data seeding with Web Locks.

Account pages use one heading and focused white cards on a pale background. Connection checks report server-confirmed store connection, not a fabricated catalogue sync result. Display actual access state and saved expiry dates; never invent a future expiry or show expired accounts as active trials. Billing retains verified receipt downloads and editable addresses.
