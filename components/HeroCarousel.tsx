"use client";

import { useEffect, useState } from "react";

const slides = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const move = (offset: number) => {
    setActive((current) => (current + offset + slides.length) % slides.length);
  };

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-kicker">Great prices on top categories</p>
        <h1>Shop the latest deals and everyday essentials</h1>
        <p>Discover products across electronics, home, fashion, beauty, and more.</p>
        <a href="/products" className="hero-cta">Shop now</a>
      </div>
      <div className="hero-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous slide">‹</button>
        <button type="button" onClick={() => move(1)} aria-label="Next slide">›</button>
      </div>
      <div className="hero-slides" aria-label="Featured promotions">
        {slides.map((slide, index) => (
          <div
            className={`hero-slide${index === active ? " active" : ""}`}
            key={slide}
            style={{ backgroundImage: `url('${slide}')` }}
          />
        ))}
      </div>
    </section>
  );
}
