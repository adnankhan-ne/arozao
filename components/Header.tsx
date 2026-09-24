"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useWishlist } from "./WishlistProvider";
import { products } from "@/lib/products";
import { productMatches } from "@/lib/search";

const drawerGroups = [
  {
    title: "Electronics",
    items: [
      ["Phone Accessories", "phone-accessories"],
      ["Computer Accessories", "computer-accessories"],
      ["Gadgets", "gadgets"],
    ],
  },
  {
    title: "Home & Kitchen",
    items: [
      ["Home Decor", "home-decor"],
      ["Kitchen Applications", "kitchen-appliances"],
      ["Life Style", "lifestyle"],
      ["Showpieces", "showpieces"],
    ],
  },
  {
    title: "Clothings & Fashions",
    items: [
      ["Girls", "girls-fashion"],
      ["Boys", "boys-fashion"],
    ],
  },
] as const;

export function Header() {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const suggestions = searchQuery.trim()
    ? products.filter((product) => productMatches(product, searchQuery)).slice(0, 6)
    : [];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("query") || params.get("q") || "");
      setSearchCategory(params.get("category") || "");
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("arozao-search-state", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("arozao-search-state", syncFromUrl);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="arozao-header">
        <button
          className="header-menu"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? "Close all categories" : "Open all categories"}
          aria-expanded={open}
        >
          <span aria-hidden="true">☰</span> All
        </button>
        <Link className="header-logo" href="/" aria-label="Arozao home">
          arozao
        </Link>
        <div className="header-delivery" title="Delivery location">
          <span className="header-location-icon" aria-hidden="true">📍</span>
          <span><small>Deliver to</small><strong>Bangladesh</strong></span>
        </div>
        <form className="header-search" action="/products" role="search">
          <select
            name="category"
            aria-label="Choose category"
            value={searchCategory}
            onChange={(event) => setSearchCategory(event.target.value)}
          >
            <option value="">All</option>
            <option value="gadgets">Electronics</option>
            <option value="girls-fashion">Fashion</option>
            <option value="home-decor">Home</option>
          </select>
          <input
            name="query"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products, brands and essentials…"
            aria-label="Search arozao"
            autoComplete="off"
          />
          <button type="submit" aria-label="Submit search">⌕</button>
          {suggestions.length > 0 && (
            <div className="search-suggestions" role="listbox" aria-label="Search suggestions">
              {suggestions.map((product) => (
                <Link
                  href={`/product/${product.slug}`}
                  className="search-suggestion"
                  role="option"
                  key={product.id}
                  onClick={() => setSearchQuery(product.name)}
                >
                  <img src={product.thumbnail} alt="" />
                  <span>
                    <strong>{product.name}</strong>
                    <small>৳{product.salePrice.toLocaleString()}</small>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </form>

        <Link className="header-wishlist" href="/wishlist" aria-label={`Wishlist with ${wishlistCount} items`}>
          <span className="header-wishlist-icon" aria-hidden="true">
            ♡{wishlistCount > 0 && <b>{wishlistCount}</b>}
          </span>
          <span className="header-nav-text">
            <small>Favorites</small>
            <strong>Wishlist</strong>
          </span>
        </Link>

        <Link className="header-orders" href="/orders" aria-label="Orders & Returns">
          <span className="header-orders-icon" aria-hidden="true">📦</span>
          <span className="header-nav-text">
            <small>Track</small>
            <strong>Orders</strong>
          </span>
        </Link>

        <Link className="header-account" href="/account">
          <small>My Profile</small>
          <strong>Account</strong>
        </Link>

        <Link className="header-cart" href="/cart" aria-label={`Cart with ${cartCount} items`}>
          <span className="header-cart-icon" aria-hidden="true">
            🛒<b>{cartCount}</b>
          </span>
          <span className="header-nav-text">
            <small>Subtotal</small>
            <strong>Cart</strong>
          </span>
        </Link>
      </div>

      {open && (
        <>
          <div className="drawer-overlay is-visible" onClick={() => setOpen(false)} />
          <aside className="category-drawer is-open" aria-label="All Categories">
            <div className="drawer-header">
              <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close categories">✕</button>
              <strong>All Categories &amp; Quick Links</strong>
            </div>
            <div className="drawer-content">
              <section className="drawer-section">
                <h3>Quick Shortcuts</h3>
                <Link className="drawer-section-link" href="/products" onClick={() => setOpen(false)}>
                  🔥 All Products &amp; Deals
                </Link>
                <Link className="drawer-section-link" href="/wishlist" onClick={() => setOpen(false)}>
                  ❤️ My Wishlist ({wishlistCount})
                </Link>
                <Link className="drawer-section-link" href="/orders" onClick={() => setOpen(false)}>
                  📦 Order History &amp; Tracking
                </Link>
                <Link className="drawer-section-link" href="/cart" onClick={() => setOpen(false)}>
                  🛒 Shopping Cart ({cartCount})
                </Link>
              </section>

              <h2>Shop by Category</h2>
              {drawerGroups.map((group) => (
                <section className="drawer-section" key={group.title}>
                  <h3>{group.title}</h3>
                  {group.items.map(([label, slug]) => (
                    <Link
                      className="drawer-section-link drawer-category-link"
                      key={slug}
                      href={`/products?category=${slug}`}
                      onClick={() => setOpen(false)}
                    >
                      {label}
                      <span aria-hidden="true">›</span>
                    </Link>
                  ))}
                </section>
              ))}

              <section className="drawer-section drawer-help">
                <h3>Customer Care &amp; Account</h3>
                <Link className="drawer-section-link" href="/account" onClick={() => setOpen(false)}>Your Account</Link>
                <Link className="drawer-section-link" href="/orders" onClick={() => setOpen(false)}>Returns &amp; Refunds</Link>
                <Link className="drawer-section-link" href="/help" onClick={() => setOpen(false)}>Customer Service</Link>
              </section>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}

