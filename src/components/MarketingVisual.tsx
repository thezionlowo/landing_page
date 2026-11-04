import {
  ArrowDownUp,
  Check,
  Globe2,
  Package,
  ReceiptText,
  Store,
  Users,
  WifiOff,
} from "lucide-react";

const industryImages: Record<string, [string, string]> = {
  BeautyPosPage: [
    "beauty",
    "For the everyday essentials. And the little luxuries.",
  ],
  FashionPosPage: ["fashion", "Every size. Every colour. Every sale."],
  ClothingBoutiquePosPage: ["fashion", "A good fit for the way you sell."],
  ElectronicsPosPage: [
    "electronics",
    "Keep every product detail in the right place.",
  ],
  ElectronicsPosDeepPage: [
    "electronics",
    "Connected from the shelf to the checkout.",
  ],
  SupermarketPosPage: ["grocery", "Made for your everyday busy."],
  PharmacyPosPage: ["pharmacy", "More clarity for your daily retail routine."],
  JewelryPosPage: ["jewelry", "A little more care for the details."],
  LagosRetailPosPage: ["fashion", "For the ambition behind your shop."],
};

export function MarketingVisual({ page }: { page: string }) {
  const industry = industryImages[page];
  if (industry)
    return (
      <figure className="site-industry-visual">
        <img
          src={`/categories/${industry[0]}.webp`}
          alt={`${industry[0]} retail setting`}
          width="600"
          height="700"
        />
        <figcaption>
          <span>YOUR KIND OF SHOP.</span>
          <strong>{industry[1]}</strong>
          <span className="site-photo-tag">
            <Store size={14} /> In-store <span>+</span>
            <Globe2 size={14} /> Online
          </span>
        </figcaption>
      </figure>
    );
  const offline = /Offline|Overselling|RushHours/.test(page);
  const inventory = /Inventory|Stock|Sync/.test(page);
  return (
    <div
      className={`site-product-visual ${offline ? "site-product-visual-dark" : ""}`}
    >
      <div className="site-visual-top">
        <img src="/zameria-icon.png" alt="" width="27" height="27" />
        <span>YOUR CONNECTED WORKSPACE</span>
        <ArrowDownUp size={15} />
      </div>
      <div className="site-visual-title">
        <span>
          {offline ? (
            <WifiOff size={26} />
          ) : inventory ? (
            <Package size={26} />
          ) : (
            <Store size={26} />
          )}
        </span>
        <h2>
          {offline ? (
            <>
              A little resilience.
              <br />A calmer counter.
            </>
          ) : inventory ? (
            <>
              Your shelves.
              <br />
              The same story, everywhere.
            </>
          ) : (
            <>
              Every channel.
              <br />
              One retail rhythm.
            </>
          )}
        </h2>
      </div>
      <div className="site-visual-channels">
        <span>
          <Store size={18} />
          Your shop
        </span>
        <i />
        <img src="/zameria-icon.png" width="32" height="32" alt="ZAMERIA" />
        <i />
        <span>
          <Globe2 size={18} />
          WooCommerce
        </span>
      </div>
      <div className="site-visual-ledger">
        <div>
          <span>OLIVE & CO.</span>
          <span>ILLUSTRATIVE WORKSPACE</span>
        </div>
        {[
          {
            image: "cleanser",
            name: "Daily face cleanser",
            stock: "24 in stock",
            amount: "₦8,500",
          },
          {
            image: "vitaminc",
            name: "Vitamin C serum",
            stock: "16 in stock",
            amount: "₦16,500",
          },
          {
            image: "lotion",
            name: "Hydrating body lotion",
            stock: "4 in stock",
            amount: "₦22,500",
          },
        ].map((item) => (
          <div key={item.name}>
            <img
              src={`/products/${item.image}.jpg`}
              alt=""
              width="36"
              height="40"
            />
            <p>
              <strong>{item.name}</strong>
              <small>{inventory ? item.stock : "Sample product"}</small>
            </p>
            <b>{item.amount}</b>
          </div>
        ))}
      </div>
      <div className="site-visual-bottom">
        <Check size={13} />
        <span>
          {offline
            ? "Eligible sales saved locally. Ready to sync on reconnect."
            : "Products, stock, orders and customers. Together."}
        </span>
      </div>
    </div>
  );
}

export function AuthStory({ mode }: { mode: "login" | "signup" | "recovery" }) {
  return (
    <aside className="site-auth-story">
      <span className="hm-eyebrow">
        <span />
        {mode === "signup"
          ? "THE NEXT CHAPTER STARTS HERE"
          : mode === "recovery"
            ? "A LITTLE HELP GETTING BACK IN"
            : "GOOD TO HAVE YOU BACK"}
      </span>
      <p className="site-auth-headline">
        Your shop.
        <br />
        Your website.
        <br />
        <em>{mode === "recovery" ? "Still connected." : "One place."}</em>
      </p>
      <p className="site-auth-description">
        {mode === "signup"
          ? "Make room for a better retail routine. Connect the shop you love to the WooCommerce store you already run."
          : mode === "recovery"
            ? "Recover access to your ZAMERIA account and get back to the business of running your store."
            : "A little less busywork. A lot more clarity. Pick up where you left off with your connected retail workspace."}
      </p>
      <div className="site-auth-connections">
        <span>
          <Store size={18} />
          Your shop
        </span>
        <span>+</span>
        <span>
          <Globe2 size={18} />
          Your website
        </span>
      </div>
      <div className="site-auth-details">
        {[
          [Package, "A connected product catalogue"],
          [ReceiptText, "Shop and website orders, together"],
          [Users, "A fuller customer story"],
        ].map(([Icon, label]) => {
          const DetailIcon = Icon as typeof Store;
          return (
            <span key={String(label)}>
              <DetailIcon size={15} />
              {String(label)}
            </span>
          );
        })}
      </div>
    </aside>
  );
}
