"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { getSessionUser, logoutUser } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/orders";
import { Order } from "@/types";

export default function AccountPage() {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const user = getSessionUser();

  useEffect(() => {
    setOrders(getCustomerOrders());
  }, [user?.id]);

  const handleSignOut = () => {
    logoutUser();
    router.push("/login");
    router.refresh();
  };

  const latestOrder = orders.length > 0 ? orders[0] : null;

  if (!user) {
    return (
      <main className="site-content">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h1>Sign in to access your account</h1>
          <p>Track orders, manage saved items, and review your purchase history from one place.</p>
          <div className="empty-actions">
            <Link href="/login" className="button button-primary">Sign in</Link>
            <Link href="/register" className="button button-secondary">Create account</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="site-content account-page-content">
      <div className="page-intro">
        <span className="eyebrow">Customer Account</span>
        <h1>Welcome back, {user.name}</h1>
        <p>Manage your orders, favorites, addresses, and customer preferences in one place.</p>
        <div className="empty-actions" style={{ justifyContent: "flex-start", marginTop: 12 }}>
          <button type="button" className="button button-secondary" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>

      <div className="account-dashboard">
        {/* Metric Cards Row */}
        <div className="account-metrics-grid">
          <Link href="/orders" className="metric-card">
            <span className="metric-icon">📦</span>
            <div className="metric-info">
              <span className="metric-value">{orders.length}</span>
              <span className="metric-label">Past &amp; Active Orders</span>
            </div>
            <span className="metric-arrow">→</span>
          </Link>

          <Link href="/wishlist" className="metric-card">
            <span className="metric-icon">❤️</span>
            <div className="metric-info">
              <span className="metric-value">{wishlistCount}</span>
              <span className="metric-label">Saved in Wishlist</span>
            </div>
            <span className="metric-arrow">→</span>
          </Link>

          <Link href="/cart" className="metric-card">
            <span className="metric-icon">🛒</span>
            <div className="metric-info">
              <span className="metric-value">{cartCount}</span>
              <span className="metric-label">Items in Shopping Cart</span>
            </div>
            <span className="metric-arrow">→</span>
          </Link>
        </div>

        {/* Latest Order Alert if present */}
        {latestOrder && (
          <div className="content-card latest-order-banner">
            <div className="latest-order-header">
              <div>
                <span className="eyebrow">Recent Activity</span>
                <h3>Latest Order #{latestOrder.id}</h3>
              </div>
              <span className={`status-pill status-${latestOrder.status.toLowerCase()}`}>
                ● {latestOrder.status}
              </span>
            </div>
            <p>
              Estimated Delivery: <strong>{latestOrder.estimatedDelivery}</strong> for{" "}
              <strong>{latestOrder.items.length} items</strong> (৳{latestOrder.total.toLocaleString()}).
            </p>
            <div className="latest-order-actions">
              <Link href={`/order-confirmation?orderId=${latestOrder.id}`} className="button button-primary">
                View Receipt &amp; Tracking
              </Link>
              <Link href="/orders" className="button button-secondary">
                All Orders ({orders.length})
              </Link>
            </div>
          </div>
        )}

        {/* Action Hub */}
        <div className="account-hub-grid">
          <div className="content-card hub-card">
            <div className="hub-card-icon">🛍️</div>
            <h3>Your Orders</h3>
            <p>Track packages, print invoices, request exchanges, or re-order essentials.</p>
            <Link href="/orders" className="button button-primary">
              View All Orders
            </Link>
          </div>

          <div className="content-card hub-card">
            <div className="hub-card-icon">💖</div>
            <h3>Your Wishlist</h3>
            <p>See items you saved while browsing and quickly transfer them to your cart.</p>
            <Link href="/wishlist" className="button button-primary">
              Manage Wishlist
            </Link>
          </div>

          <div className="content-card hub-card">
            <div className="hub-card-icon">🛡️</div>
            <h3>Customer Support</h3>
            <p>Have questions about delivery times, returns, or payment options? We are here to help.</p>
            <Link href="/help" className="button button-secondary">
              Help Center &amp; FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
