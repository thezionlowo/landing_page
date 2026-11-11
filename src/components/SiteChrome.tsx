import { useClientReady } from '../lib/useClientReady';
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="/" aria-label="ZAMERIA home" className="hm-logo">
      <img
        src={light ? "/zameria-logo-white.png" : "/zameria-logo-header.png"}
        alt="ZAMERIA"
        width="156"
        height="34"
      />
    </a>
  );
}

export function SiteHeader() {
  const { isAuthenticated: sessionAuthenticated } = useCustomerAuth();
  const clientReady = useClientReady();
  const isAuthenticated = clientReady && sessionAuthenticated;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <header
        className="hm-header"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            menuRef.current?.focus();
          }
        }}
      >
        <div className="hm-wrap hm-nav">
          <BrandMark />
          <nav aria-label="Main navigation" className="hm-desktop-nav">
            <a href="/#product">Product</a>
            <a href="/#industries">Solutions</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/pricing">Pricing</a>
          </nav>
          <div className="hm-nav-actions">
            <a
              href={isAuthenticated ? "/account" : "/login"}
              className="hm-login"
            >
              {isAuthenticated ? "Your account" : "Log in"}{" "}
              <ArrowUpRight size={14} />
            </a>
            <a
              href={isAuthenticated ? "/account" : "/get-started"}
              className="hm-button hm-button-small"
            >
              {isAuthenticated ? "Open workspace" : "Start free trial"}{" "}
              <ArrowRight size={15} />
            </a>
          </div>
          <button
            className="hm-menu-toggle"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="hm-mobile-navigation"
            ref={menuRef}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="hm-mobile-navigation"
            className="hm-mobile-nav"
            aria-label="Mobile navigation"
          >
            {[
              ["Product", "/#product"],
              ["Solutions", "/#industries"],
              ["How it works", "/#how-it-works"],
              ["Pricing", "/pricing"],
              [
                isAuthenticated ? "Your account" : "Log in",
                isAuthenticated ? "/account" : "/login",
              ],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
            <a
              href={isAuthenticated ? "/account" : "/get-started"}
              className="hm-button"
              onClick={() => setOpen(false)}
            >
              {isAuthenticated
                ? "Open your workspace"
                : "Start your free trial"}{" "}
              <ArrowRight size={16} />
            </a>
          </nav>
        )}
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="hm-footer">
      <div className="hm-wrap">
        <div className="hm-footer-top">
          <div>
            <BrandMark light />
            <p>
              Your shop and WooCommerce.
              <br />
              Working together.
            </p>
            <a href="mailto:hello@zameria.co">
              hello@zameria.co <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <span>THE PRODUCT</span>
            <a href="/woocommerce-pos">Point of sale</a>
            <a href="/woocommerce-inventory-sync">Inventory sync</a>
            <a href="/woocommerce-retail-pos">Connected retail</a>
            <a href="/hardware-compatibility">Hardware compatibility</a>
          </div>
          <div>
            <span>EXPLORE</span>
            <a href="/#industries">Your industry</a>
            <a href="/pricing">Pricing</a>
            <a href="/#how-it-works">Getting started</a>
            <a href="/#faq">Common questions</a>
            <a href="/alternatives">Compare your options</a>
          </div>
          <div>
            <span>YOUR NEXT STEP</span>
            <a href="/get-started">
              Start your free trial <ArrowUpRight size={13} />
            </a>
            <a href="/login">Merchant login</a>
            <a
              href="https://pos.zameria.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open your POS <ArrowUpRight size={13} />
            </a>
            <a href="/downloads/zameria.zip" download="zameria.zip">
              Download the plugin <ArrowDown size={13} />
            </a>
          </div>
        </div>
        <div className="hm-footer-bottom">
          <span>
            © {new Date().getFullYear()} ZAMERIA. Your store, connected.
          </span>
          <div>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/refunds">Refunds</a>
            <a
              href="https://instagram.com/zameriahq"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <ArrowUpRight size={12} />
            </a>
            <a
              href="https://linkedin.com/company/zameria"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <ArrowUpRight size={12} />
            </a>
            <a href="mailto:hello@zameria.co">
              Get in touch <ArrowUpRight size={12} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
