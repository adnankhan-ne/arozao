"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCustomerOrders } from "@/lib/orders";
import { getSessionUser } from "@/lib/auth";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/ToastNotification";
import { Order } from "@/types";
import { getProduct } from "@/lib/products";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { add } = useCart();
  const { showToast } = useToast();
  const user = getSessionUser();

  useEffect(() => {
    setOrders(getCustomerOrders());
    setHydrated(true);
  }, [user?.id]);

  const handleBuyAgain = (order: Order) => {
    let addedCount = 0;
    order.items.forEach((item) => {
      const fullProduct = getProduct(item.slug);
      if (fullProduct) {
        add(fullProduct, item.quantity);
        addedCount += item.quantity;
      }
    });

    showToast(`Added ${addedCount} items from order #${order.id} to your cart!`, {
      type: "success",
      actionLabel: "View Cart",
      actionHref: "/cart",
    });
  };

  if (!user) {
    return (
      <main className="site-content">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Sign in to view your orders</h2>
          <p>Your recent purchases and delivery updates will appear here after login.</p>
          <div className="empty-actions">
            <Link href="/login" className="button button-primary">Sign in</Link>
            <Link href="/register" className="button button-secondary">Create account</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!hydrated) {
    return (
      <main className="site-content">
        <div className="empty-state">
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="site-content orders-page-content">
      <div className="page-intro">
        <span className="eyebrow">Customer Dashboard</span>
        <h1>Orders &amp; Returns</h1>
        <p>Track current orders, inspect previous purchases, and easily re-order your favorites.</p>
      </div>

      {orders.length > 0 ? (
        <div className="orders-list-wrapper">
          <div className="orders-header-bar">
            <span>
              Total Orders: <strong>{orders.length}</strong>
            </span>
            <Link href="/products" className="button button-secondary">
              Browse More Products
            </Link>
          </div>

          <div className="orders-cards-list">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <article className="content-card order-history-card" key={order.id}>
                  <div className="order-history-header">
                    <div className="order-meta-group">
                      <div className="meta-col">
                        <small>Order Placed</small>
                        <strong>{formattedDate}</strong>
                      </div>
                      <div className="meta-col">
                        <small>Total</small>
                        <strong className="order-total-text">৳{order.total.toLocaleString()}</strong>
                      </div>
                      <div className="meta-col">
                        <small>Ship To</small>
                        <strong>{order.customer.name}</strong>
                      </div>
                      <div className="meta-col">
                        <small>Payment</small>
                        <span>{order.customer.payment}</span>
                      </div>
                    </div>

                    <div className="order-id-group">
                      <span className={`status-pill status-${order.status.toLowerCase()}`}>
                        ● {order.status}
                      </span>
                      <span className="order-id-text">#{order.id}</span>
                    </div>
                  </div>

                  <div className="order-history-body">
                    <div className="order-delivery-status-banner">
                      <span className="truck-icon">🚚</span>
                      <div>
                        <strong>Estimated Delivery: {order.estimatedDelivery}</strong>
                        <small>Delivering to: {order.customer.address}, {order.customer.city}</small>
                      </div>
                    </div>

                    <div className="order-items-table">
                      {order.items.map((item) => (
                        <div className="order-item-line" key={item.slug}>
                          <Link href={`/product/${item.slug}`}>
                            <img src={item.image} alt={item.name} className="order-item-thumb" />
                          </Link>
                          <div className="order-item-desc">
                            <h4>
                              <Link href={`/product/${item.slug}`}>{item.name}</Link>
                            </h4>
                            <span className="order-item-pricing">
                              ৳{item.price.toLocaleString()} × {item.quantity}
                            </span>
                          </div>
                          <div className="order-item-subtotal">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-history-footer">
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => handleBuyAgain(order)}
                      >
                        🔄 Buy Again
                      </button>
                      <Link
                        href={`/order-confirmation?orderId=${order.id}`}
                        className="button button-secondary"
                      >
                        View Order Details &amp; Receipt
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-state orders-empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders placed yet</h2>
          <p>
            When you complete an order on Arozao, you can track its progress, view receipts, and easily re-order items from this page.
          </p>
          <div className="empty-actions">
            <Link href="/products" className="button button-primary">
              Start Shopping
            </Link>
            <Link href="/wishlist" className="button button-secondary">
              View Wishlist
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
