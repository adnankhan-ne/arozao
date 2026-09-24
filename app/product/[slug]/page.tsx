import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailActions } from "./ProductDetailActions";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  return product
    ? {
        title: `${product.name} | Arozao`,
        description: product.shortDescription,
        openGraph: {
          title: product.name,
          description: product.shortDescription,
          images: [product.thumbnail || product.image],
        },
      }
    : { title: "Product | Arozao" };
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const price = product.salePrice ?? product.price;
  const regularPrice = product.price;
  const hasDiscount = product.discount && product.discount > 0;
  const savings = regularPrice - price;

  // Find related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="site-content pdp-content">
      {/* Breadcrumbs */}
      <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="crumb-sep">›</span>
        <Link href={`/products?category=${product.category}`}>
          {product.category.replace(/-/g, " ")}
        </Link>
        {product.subcategory && (
          <>
            <span className="crumb-sep">›</span>
            <Link href={`/products?category=${product.category}&subcategory=${product.subcategory}`}>
              {product.subcategory.replace(/-/g, " ")}
            </Link>
          </>
        )}
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{product.name}</span>
      </nav>

      <div className="pdp-grid">
        {/* Left Column: Image Media */}
        <div className="pdp-media-column">
          <div className="pdp-main-image-wrapper">
            <img
              src={product.image || product.thumbnail}
              alt={product.name}
              className="pdp-main-image"
            />
            {hasDiscount && (
              <span className="pdp-discount-tag">-{product.discount}% OFF</span>
            )}
          </div>

          <div className="pdp-trust-highlights">
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <div>
                <strong>Fast Express Delivery</strong>
                <small>2–4 business days all over Bangladesh</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💵</span>
              <div>
                <strong>Cash on Delivery</strong>
                <small>Pay with cash right at your doorstep</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔄</span>
              <div>
                <strong>7-Day Easy Returns</strong>
                <small>Hassle-free replacement guarantee</small>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <strong>100% Genuine Quality</strong>
                <small>Directly sourced and quality-checked</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="pdp-info-column">
          <div className="pdp-header">
            <div className="pdp-brand-cat">
              <span className="eyebrow">{product.brand || "Arozao"}</span>
              <span className="pdp-cat-badge">{product.category.replace(/-/g, " ")}</span>
            </div>
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-ratings-line">
              <span className="stars">★★★★☆</span>
              <strong>{product.rating || 4.6}</strong>
              <span className="review-count">({product.reviewCount || 38} customer reviews)</span>
              <span className="sku-code">SKU: {product.sku || product.id}</span>
            </div>
          </div>

          <div className="pdp-pricing-box">
            <div className="pdp-price-row">
              <span className="pdp-current-price">৳{price.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <s className="pdp-regular-price">৳{regularPrice.toLocaleString()}</s>
                  <span className="pdp-savings-badge">Save ৳{savings.toLocaleString()}</span>
                </>
              )}
            </div>
            <div className="pdp-availability-badge">
              {product.stock > 0 ? (
                <span className="badge-instock">✓ In Stock &amp; Ready to Ship</span>
              ) : (
                <span className="badge-outstock">✕ Currently Out of Stock</span>
              )}
            </div>
          </div>

          <p className="pdp-description">{product.description || product.shortDescription}</p>

          {product.features && product.features.length > 0 && (
            <div className="pdp-features-box">
              <h3>Key Highlights</h3>
              <ul className="pdp-features-list">
                {product.features.map((feature) => (
                  <li key={feature}>
                    <span className="check-bullet">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Interactive Stepper, Add to Cart, Buy Now, and Wishlist */}
          <ProductDetailActions product={product} />

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pdp-specs-card">
              <h3>Product Specifications</h3>
              <dl className="pdp-specs-table">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div className="spec-row" key={key}>
                    <dt>{key}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Related / You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <div className="section-head">
            <h2>You May Also Like</h2>
            <Link href={`/products?category=${product.category}`}>See all in {product.category.replace(/-/g, " ")}</Link>
          </div>
          <div className="content-grid">
            {relatedProducts.map((rel) => (
              <ProductCard product={rel} key={rel.slug} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
