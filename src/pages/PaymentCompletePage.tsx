import { AuthHeader } from "./auth/AuthHeader";
import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { useRouter } from "../router/Router";
import {
  verifyZameriaCheckout,
  VerifiedCheckout,
} from "../lib/zameriaCheckout";
import { useCustomerAuth } from "../context/CustomerAuthContext";

export const PaymentCompletePage: React.FC = () => {
  const { search, navigate } = useRouter();
  const { recordVerifiedPayment } = useCustomerAuth();
  const [result, setResult] = useState<VerifiedCheckout | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const reference = new URLSearchParams(search).get("reference") || "";

  useEffect(() => {
    if (!reference) {
      setError("Missing payment reference.");
      return;
    }
    verifyZameriaCheckout(reference)
      .then((receipt) => {
        recordVerifiedPayment(receipt);
        setResult(receipt);
        sessionStorage.removeItem("zameria_pending_checkout");
      })
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not verify this payment.",
        ),
      );
  }, [reference, recordVerifiedPayment]);

  return (
    <div className="site-checkout">
      <AuthHeader
        buttonText="Your account"
        buttonAction={() => navigate("/account")}
      />
      <main className="site-payment-main">
        <section className="site-payment-card" aria-live="polite">
          <span className="site-payment-icon">
            {result ? <CheckCircle2 size={27} /> : <ShieldCheck size={27} />}
          </span>
          <h1>
            {result
              ? "Payment verified."
              : error
                ? "Let’s check that payment."
                : "Checking your payment…"}
          </h1>
          <p role={error ? "alert" : undefined}>
            {result
              ? "Your plan and licence are ready in your account."
              : error ||
                "We’re checking your payment before activating your plan."}
          </p>
          {result && (
            <div className="site-payment-license">
              <span>YOUR ZAMERIA LICENCE KEY</span>
              <div>
                <strong>{result.license_key}</strong>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(result.license_key);
                      setCopied(true);
                    } catch {
                      setCopied(false);
                    }
                  }}
                  aria-label="Copy license key"
                >
                  <Copy size={16} />
                </button>
              </div>
              {copied && <p role="status">Copied to your clipboard.</p>}
              <p>
                {result.plan === "starter" ? "Starter" : "Business"} plan ·
                expires {new Date(result.expires_at).toLocaleDateString()}
              </p>
            </div>
          )}
          {result ? (
            <button
              className="hm-button"
              onClick={() => navigate("/account?tab=overview")}
            >
              Open your dashboard <ArrowRight size={16} />
            </button>
          ) : error ? (
            <button
              className="hm-button"
              onClick={() => navigate("/subscribe")}
            >
              Return to checkout <ArrowRight size={16} />
            </button>
          ) : null}
        </section>
      </main>
      <footer className="zameria-auth-footer">
        © {new Date().getFullYear()} ZAMERIA. Secure checkout. Connected
        commerce.
      </footer>
    </div>
  );
};
