"use client";

import Link from "next/link";

const columns = [
  {
    title: "Get to Know Us",
    links: [
      ["About Us", "/about"],
      ["Careers", "/careers"],
      ["Press Releases", "/press"],
      ["Arozao Science", "/science"],
    ],
  },
  {
    title: "Make Money with Us",
    links: [
      ["Sell on Arozao", "/sell"],
      ["Protect and Build Your Brand", "/brand-protection"],
      ["Arozao Global Selling", "/global-selling"],
      ["Become an Affiliate", "/affiliate"],
    ],
  },
  {
    title: "Payment Products",
    links: [
      ["Arozao Business Card", "/business-card"],
      ["Shop with Points", "/points"],
      ["Reload Your Balance", "/balance"],
      ["Currency Converter", "/currency-converter"],
    ],
  },
  {
    title: "Let Us Help You",
    links: [
      ["Your Account", "/account"],
      ["Your Orders", "/orders"],
      ["Shipping Rates", "/shipping-rates"],
      ["Returns & Replacements", "/returns"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Arozao footer">
      <button className="footer-back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        Back to top
      </button>
      <div className="footer-grid">
        {columns.map((column) => (
          <section key={column.title} aria-labelledby={`footer-${column.title}`}>
            <h2 id={`footer-${column.title}`}>{column.title}</h2>
            <nav aria-label={column.title}>
              {column.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </nav>
          </section>
        ))}
      </div>
      <div className="footer-brand-area">
        <Link className="footer-brand" href="/" aria-label="Arozao home">AROZAO</Link>
        <div className="footer-preferences" aria-label="Regional preferences">
          <button type="button">English</button>
          <button type="button">BDT - BDT TAKA</button>
          <button type="button">Bangladesh</button>
        </div>
        <div className="footer-bottom">© 2024–2026, Arozao.com</div>
      </div>
    </footer>
  );
}
