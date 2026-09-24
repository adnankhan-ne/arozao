import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";

const categoryCards = [
  {
    title: "Gaming accessories",
    href: "/search?q=Gaming%20accessories",
    label: "Shop gaming",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    title: "Fashion trends",
    href: "/search?q=Fashion%20trends",
    label: "See all deals",
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    title: "Home essentials",
    href: "/search?q=Home%20essentials",
    label: "Explore home",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"],
  },
  {
    title: "Beauty picks",
    href: "/search?q=Beauty",
    label: "Discover beauty",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=400&q=80",
    ],
  },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <main className="page-shell">
        <section className="card-grid" aria-label="Featured categories">
          <div className="featured-category-group">
            {categoryCards.slice(0, 2).map((card) => (
              <article className="category-card category-card-featured" key={card.title}>
                <h2><Link href={card.href}>{card.title}</Link></h2>
                <div className={`image-grid ${card.images.length === 1 ? "single" : "four"}`}>
                  {card.images.map((image) => <Link href={card.href} key={image} aria-label={`Search ${card.title}`}><img src={image} alt="" /></Link>)}
                </div>
                <Link href={card.href}>{card.label}</Link>
              </article>
            ))}
          </div>
          {categoryCards.slice(2).map((card) => (
            <article className="category-card" key={card.title}>
              <h2><Link href={card.href}>{card.title}</Link></h2>
              <div className={`image-grid ${card.images.length === 1 ? "single" : "four"}`}>
                {card.images.map((image) => <Link href={card.href} key={image} aria-label={`Search ${card.title}`}><img src={image} alt="" /></Link>)}
              </div>
              <Link href={card.href}>{card.label}</Link>
            </article>
          ))}
        </section>
        <section className="carousel-section">
          <div className="section-head">
            <h2>Featured products</h2>
            <Link href="/products">View all</Link>
          </div>
          <div className="content-grid">{products.slice(0, 6).map((product) => <ProductCard key={product.slug} product={product} />)}</div>
        </section>
      </main>
    </>
  );
}
