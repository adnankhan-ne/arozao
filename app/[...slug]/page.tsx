import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<string, { title: string; intro: string }> = {
  about: { title: "About Arozao", intro: "We make it easier to find dependable, delightful everyday products." },
  "account-details": { title: "Account details", intro: "Update your account information securely." },
  help: { title: "Help center", intro: "Find answers about delivery, payments, returns, and your account." },
  contact: { title: "Contact us", intro: "Our customer care team is happy to help." },
  faq: { title: "Frequently asked questions", intro: "Quick answers to common questions." },
  returns: { title: "Returns", intro: "Enjoy easy returns on eligible purchases." },
  shipping: { title: "Shipping rates", intro: "Dependable delivery across Bangladesh." },
  "shipping-rates": { title: "Shipping rates", intro: "Dependable delivery across Bangladesh." },
  privacy: { title: "Privacy policy", intro: "We respect your privacy and protect your information." },
  terms: { title: "Terms & conditions", intro: "The terms that govern using Arozao." },
  login: { title: "Sign in", intro: "Sign in to view your orders and saved products." },
  register: { title: "Create an account", intro: "Join Arozao for a faster checkout experience." }
};

export default function LegacyPage({ params }: { params: { slug: string[] } }) {
  const raw = params.slug.join("/");
  const key = params.slug.length > 1 && params.slug[0] === "categories" ? params.slug[1].replace(/\.html$/, "") : params.slug[0].replace(/\.html$/, "");
  const page = pages[key] || (params.slug.length > 1 ? { title: key.replace(/-/g, " "), intro: "Explore the Arozao collection." } : null);
  if (!page) notFound();
  return <main className="site-content"><div className="page-intro"><span className="eyebrow">Arozao</span><h1>{page.title}</h1><p>{page.intro}</p></div><section className="form-card"><h2>Welcome</h2><p>{page.intro}</p><Link href="/products" className="button">Continue shopping</Link></section></main>;
}
