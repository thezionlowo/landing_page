/** Rendered-markup checks. Browser/device layout and interactions are a separate QA layer. */
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CustomerAuthProvider } from '../context/CustomerAuthContext';
import { RouterProvider } from '../router/Router';
import { LoginPage } from '../pages/auth/LoginPage';
import { GetStartedPage } from '../pages/auth/GetStartedPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

const render = (Component: React.ComponentType, path: string) => renderToStaticMarkup(React.createElement(CustomerAuthProvider, null, React.createElement(RouterProvider, { initialPath: path, children: React.createElement(Component) })));
for (const [Component, path, expectedInputs] of [[LoginPage, '/login', 2], [GetStartedPage, '/get-started', 3], [ForgotPasswordPage, '/forgot-password', 1]] as const) {
  const html = render(Component, path);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one main heading`);
  assert.equal((html.match(/<img\b/g) || []).length, 1, `${path}: one brand logo`);
  assert.equal((html.match(/<form\b/g) || []).length, 1, `${path}: one focused form`);
  assert.equal((html.match(/<input\b/g) || []).length, expectedInputs, `${path}: only the required fields`);
  const form = html.match(/<form\b[\s\S]*?<\/form>/)?.[0] || '';
  assert(!form.includes('<img'), `${path}: no repeated logo inside form`);
  assert(/<button[^>]*type="submit"/.test(form), `${path}: real form submit button`);
  assert(/type="email"[^>]*required|type="email"[^>]*autoComplete="email"[^>]*required/.test(form), `${path}: required email field`);
  assert(html.includes('class="site-auth-simple"'), `${path}: shared card layout`);
}
const login = render(LoginPage, '/login');
assert(login.includes('autoComplete="current-password"'));
assert(login.includes('href="/forgot-password"') && login.includes('href="/get-started"'));
assert(login.includes('aria-label="Show password"'));
const signup = render(GetStartedPage, '/get-started');
assert(signup.includes('autoComplete="organization"'));
assert(signup.includes('autoComplete="new-password"') && signup.includes('minLength="8"'));
assert(!signup.includes('type="checkbox"') && !signup.includes('I agree to'), 'Signup does not require the removed agreement');
assert(!signup.includes('type="url"'), 'Store URL is collected when connecting the store, after signup');
assert(signup.includes('href="/login"'));
console.log('PASS: rendered login, signup and recovery forms; one heading/logo/form, required fields, password autocomplete and recovery/account links. Responsive pixel layout not certified by this test.');
