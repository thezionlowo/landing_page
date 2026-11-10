import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { checkoutPricing, planCheckoutUrl } from '../lib/checkoutPricing';
import { NIGERIA_PRICING, INTERNATIONAL_PRICING } from '../lib/geoPricing';
import { startZameriaCheckout } from '../lib/zameriaCheckout';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import { RouterProvider } from '../router/Router';
import { PlanComparisonProvider, PlanComparisonDialog } from '../components/PlanComparison';
import { SubscribePage } from '../pages/SubscribePage';

async function run() {
  // Explicit regional choices survive navigation and override a different detected region.
  for (const [country, currency, starter, business, fallback] of [
    ['NG', 'NGN', 200000, 300000, INTERNATIONAL_PRICING],
    ['US', 'USD', 250, 400, NIGERIA_PRICING],
  ] as const) {
    const pricing = checkoutPricing(null, country, currency, fallback);
    assert.equal(pricing.currency, currency);
    for (const [plan, amount] of [['starter', starter], ['business', business]] as const) {
      const url = new URL(planCheckoutUrl(plan, pricing), 'http://localhost');
      assert.equal(url.searchParams.get('plan'), plan);
      assert.equal(url.searchParams.get('currency'), currency);
      const restored = checkoutPricing(null, url.searchParams.get('country'), url.searchParams.get('currency'), fallback);
      assert.equal(restored.plans[plan].amount, amount);
      const html = renderToStaticMarkup(<CustomerAuthProvider><RouterProvider initialPath="/subscribe" initialSearch={url.search}><PlanComparisonProvider><SubscribePage /></PlanComparisonProvider></RouterProvider></CustomerAuthProvider>);
      assert(html.includes(restored.plans[plan].displayPrice));
      assert(html.includes(`<strong>${restored.plans[plan].plan}</strong>`));
      assert.equal((html.match(/<input\b/g) || []).length, 3, 'Checkout requests only the three required details');
      assert(!html.includes('<select'), 'A selected plan must not require another selection step');
      assert(!html.includes('A little less admin'));
      assert(html.includes('Compare plans'));

      let submitted: Record<string, unknown> | undefined;
      globalThis.fetch = async (_url, init) => {
        submitted = JSON.parse(String(init?.body));
        return new Response(JSON.stringify({ authorization_url: 'https://checkout.example.invalid/test', reference: 'test-reference' }), { status: 200 });
      };
      const result = await startZameriaCheckout({ plan, amount, currency, country: restored.country, email: 'demo@example.invalid', businessName: 'Demo Shop', storeUrl: 'https://shop.example.invalid', callbackUrl: 'http://localhost/payment/complete' });
      assert.equal(submitted?.plan, plan);
      assert.equal(submitted?.currency, currency);
      assert.equal(submitted?.amount, amount);
      assert.equal(submitted?.business_name, 'Demo Shop');
      assert.equal(result.reference, 'test-reference');
    }
    const comparison = renderToStaticMarkup(<PlanComparisonDialog open pricing={pricing} selectedPlan="starter" onClose={() => {}} onSelect={() => {}} />);
    assert(comparison.includes(pricing.plans.starter.displayPrice));
    assert(comparison.includes(pricing.plans.business.displayPrice));
    assert(!comparison.includes(currency === 'NGN' ? '$250' : '₦200,000'));
    assert(comparison.includes('Keep Starter'));
    assert(comparison.includes('Choose Business'));
    assert(comparison.includes('Unlimited'));
    assert(comparison.includes('scope="col"'));
    assert(comparison.includes('Close plan comparison'));
  }
  // A quote selected on the pricing page survives account restoration and geolocation.
  for (const customer of [
    null,
    { country: 'Nigeria', currency: 'NGN' },
    { country: 'US', currency: 'USD' },
    { billingAddress: { country: 'Nigeria' } },
    { billingAddress: { country: 'GB' } },
    { currency: 'NGN' },
    { currency: 'USD' },
  ]) {
    for (const pricing of [INTERNATIONAL_PRICING, NIGERIA_PRICING]) {
      for (const plan of ['starter', 'business'] as const) {
        const url = new URL(planCheckoutUrl(plan, pricing), 'http://localhost');
        for (const fallback of [NIGERIA_PRICING, INTERNATIONAL_PRICING]) {
          const selected = checkoutPricing(customer, url.searchParams.get('country'), url.searchParams.get('currency'), fallback);
          assert.equal(selected.currency, pricing.currency, 'An account must not silently replace the selected checkout currency');
          assert.equal(selected.plans[plan].amount, pricing.plans[plan].amount);
          assert.equal(checkoutPricing(customer, null, pricing.currency, fallback).currency, pricing.currency);
        }
      }
    }
  }
  // Account purchases without an explicit quote still default to the saved billing region.
  assert.equal(checkoutPricing({ country: 'Nigeria' }, null, null, INTERNATIONAL_PRICING).currency, 'NGN');
  assert.equal(checkoutPricing({ currency: 'USD' }, null, null, NIGERIA_PRICING).currency, 'USD');
  assert.equal(checkoutPricing({ billingAddress: { country: 'GB' } }, null, null, NIGERIA_PRICING).currency, 'USD');
  globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Checkout unavailable' }), { status: 503 });
  await assert.rejects(startZameriaCheckout({ plan: 'starter', email: 'demo@example.invalid', businessName: 'Demo', storeUrl: 'https://shop.example.invalid', callbackUrl: 'http://localhost/payment/complete' }), /Checkout unavailable/);
  console.log('Checkout comparison passed: NGN/USD × both plans, explicit quotes across account restoration, saved-region fallback, minimal forms, comparison choices, payment payloads and errors. No real payment was initiated.');
}
void run();
