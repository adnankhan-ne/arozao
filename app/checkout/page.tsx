"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { getSessionUser } from "@/lib/auth";
import { saveOrder } from "@/lib/orders";
import { Order } from "@/types";

const DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const sessionUser = getSessionUser();

  const [name, setName] = useState(sessionUser?.name || "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("Cash on delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!sessionUser) {
    return (
      <main className="site-content">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h1>Please sign in to continue</h1>
          <p>Log in to save your order and view it in your customer account later.</p>
          <div className="empty-actions">
            <Link href="/login" className="button button-primary">
              Sign in
            </Link>
            <Link href="/register" className="button button-secondary">
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="site-content">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h1>Your cart is currently empty</h1>
          <p>Please add products to your cart before proceeding to checkout.</p>
          <Link href="/products" className="button button-primary">
            Explore products &amp; deals
          </Link>
        </div>
      </main>
    );
  }

  const deliveryFee = total >= 1500 ? 0 : 60;
  const grandTotal = total + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    setIsSubmitting(true);

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ARZ-2026-${randomDigits}`;

    // Estimated delivery in 3 business days
    const estDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const estimatedDelivery = estDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newOrder: Order = {
      id: orderId,
      customerId: sessionUser.id,
      customerEmail: sessionUser.email,
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.salePrice ?? item.price,
        quantity: item.quantity,
        image: item.thumbnail || item.image,
      })),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        city,
        address: address.trim(),
        notes: notes.trim(),
        payment,
      },
      subtotal: total,
      deliveryFee,
      discount: 0,
      total: grandTotal,
      status: "Processing",
      createdAt: new Date().toISOString(),
      estimatedDelivery,
    };

    // 1. Save order to persistent store
    saveOrder(newOrder);

    // 2. Clear customer cart
    clear();

    // 3. Redirect to order confirmation receipt
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  return (
    <main className="site-content checkout-content">
      <div className="page-intro">
        <span className="eyebrow">Secure Checkout</span>
        <h1>Complete Your Order</h1>
        <p>Please provide your shipping and contact information for dependable delivery.</p>
      </div>

      <div className="checkout-layout">
        {/* Left Column: Checkout Form */}
        <div className="checkout-form-column">
          <form className="checkout-form" onSubmit={handleSubmitOrder}>
            <section className="form-section">
              <h2 className="section-title">
                <span className="section-step">1</span> Contact &amp; Delivery Details
              </h2>

              <div className="form-row form-row-two">
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required-star">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="city">
                  District / Division <span className="required-star">*</span>
                </label>
                <select id="city" value={city} onChange={(e) => setCity(e.target.value)}>
                  {DIVISIONS.map((d) => (
                    <option value={d} key={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Full Street Address <span className="required-star">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  placeholder="House number, road number, area / thana, landmark..."
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Delivery Instructions (Optional)</label>
                <input
                  id="notes"
                  type="text"
                  placeholder="e.g. Call before delivery, deliver after 2 PM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </section>

            <section className="form-section">
              <h2 className="section-title">
                <span className="section-step">2</span> Payment Method
              </h2>

              <div className="payment-options-grid">
                <label className={`payment-card-option ${payment === "Cash on delivery" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on delivery"
                    checked={payment === "Cash on delivery"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <div className="payment-opt-content">
                    <div className="payment-opt-title">
                      <span className="opt-icon">💵</span> Cash on Delivery
                    </div>
                    <small className="payment-opt-desc">Pay cash when you inspect and receive your package</small>
                  </div>
                </label>

                <label className={`payment-card-option ${payment === "bKash / Nagad / Mobile Banking" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bKash / Nagad / Mobile Banking"
                    checked={payment === "bKash / Nagad / Mobile Banking"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <div className="payment-opt-content">
                    <div className="payment-opt-title">
                      <span className="opt-icon">📱</span> bKash / Nagad / Rocket
                    </div>
                    <small className="payment-opt-desc">Fast payment via your favorite mobile financial wallet</small>
                  </div>
                </label>

                <label className={`payment-card-option ${payment === "Debit / Credit Card" ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Debit / Credit Card"
                    checked={payment === "Debit / Credit Card"}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <div className="payment-opt-content">
                    <div className="payment-opt-title">
                      <span className="opt-icon">💳</span> Debit / Credit Card
                    </div>
                    <small className="payment-opt-desc">Visa, Mastercard, or local bank card</small>
                  </div>
                </label>
              </div>
            </section>

            <button
              type="submit"
              className="button button-primary button-place-order"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing your order..." : `Place Order · ৳${grandTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Review Sidebar */}
        <aside className="checkout-summary-column">
          <div className="content-card checkout-summary-card">
            <h2>Order Review</h2>

            <div className="checkout-items-mini-list">
              {items.map((item) => {
                const itemPrice = (item.salePrice ?? item.price) * item.quantity;
                return (
                  <div className="mini-item-row" key={item.slug}>
                    <img src={item.thumbnail || item.image} alt={item.name} className="mini-item-img" />
                    <div className="mini-item-meta">
                      <span className="mini-item-name">{item.name}</span>
                      <small className="mini-item-qty">Qty: {item.quantity}</small>
                    </div>
                    <span className="mini-item-price">৳{itemPrice.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <hr className="summary-divider" />

            <div className="summary-line">
              <span>Subtotal</span>
              <strong>৳{total.toLocaleString()}</strong>
            </div>

            <div className="summary-line">
              <span>Delivery Fee</span>
              <strong>{deliveryFee === 0 ? "FREE" : `৳${deliveryFee}`}</strong>
            </div>

            <hr className="summary-divider" />

            <div className="summary-line total-line">
              <span>Total to Pay</span>
              <strong className="grand-total">৳{grandTotal.toLocaleString()}</strong>
            </div>

            <div className="checkout-reassurance-box">
              <div>✓ Easy 7-day returns &amp; refund policy</div>
              <div>✓ Order tracking available in your account</div>
              <div>✓ Verified authentic products</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
