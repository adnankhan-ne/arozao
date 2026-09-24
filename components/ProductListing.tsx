"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { productMatches } from "@/lib/search";

type ListingProps = {
  products: Product[];
  title?: string;
  initialQuery?: string;
  initialCategory?: string;
  initialSubcategory?: string;
};

export function ProductListing({
  products,
  title = "Find something wonderful.",
  initialQuery = "",
  initialCategory = "",
  initialSubcategory = "",
}: ListingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [brand, setBrand] = useState("");
  const [availability, setAvailability] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("relevance");

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))).sort(), [products]);
  const subcategories = useMemo(
    () => Array.from(new Set(products.filter((product) => !category || product.category === category).map((product) => product.subcategory))).sort(),
    [products, category],
  );
  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand))).sort(), [products]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    if (brand) params.set("brand", brand);
    if (availability) params.set("availability", availability);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("rating", minRating);
    if (sort !== "relevance") params.set("sort", sort);
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
    window.dispatchEvent(new Event("arozao-search-state"));
  }, [availability, brand, category, maxPrice, minPrice, minRating, pathname, query, router, sort, subcategory]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY;
    const rating = minRating ? Number(minRating) : 0;
    return products
      .filter((product) => productMatches(product, query, category))
      .filter((product) => !subcategory || product.subcategory === subcategory)
      .filter((product) => !brand || product.brand === brand)
      .filter((product) => !availability || product.availability === availability)
      .filter((product) => (product.salePrice ?? product.price) >= min && (product.salePrice ?? product.price) <= max)
      .filter((product) => product.rating >= rating)
      .sort((a, b) => {
        if (sort === "low") return a.salePrice - b.salePrice;
        if (sort === "high") return b.salePrice - a.salePrice;
        if (sort === "rating") return b.rating - a.rating || b.reviewCount - a.reviewCount;
        if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
        if (sort === "popular") return Number(b.bestseller) - Number(a.bestseller) || b.reviewCount - a.reviewCount;
        return (
          Number(b.availability === "in-stock") - Number(a.availability === "in-stock") ||
          Number(b.featured) - Number(a.featured) ||
          b.reviewCount - a.reviewCount
        );
      });
  }, [availability, brand, category, maxPrice, minPrice, minRating, products, query, sort, subcategory]);

  const hasActiveFilters = Boolean(
    query || category || subcategory || brand || availability || minPrice || maxPrice || minRating || sort !== "relevance"
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setSubcategory("");
    setBrand("");
    setAvailability("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSort("relevance");
  };

  return (
    <div className="product-listing-wrapper">
      <div className="listing-controls-panel">
        <div className="listing-tools-bar">
          <div className="listing-search-filter">
            <input
              aria-label="Filter products"
              placeholder="Search in these results…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="listing-dropdowns">
            <select
              aria-label="Filter category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setSubcategory("");
              }}
            >
              <option value="">All categories</option>
              {categories.map((value) => (
                <option value={value} key={value}>
                  {value.replace(/-/g, " ")}
                </option>
              ))}
            </select>

            {subcategories.length > 0 && (
              <select
                aria-label="Filter subcategory"
                value={subcategory}
                onChange={(event) => setSubcategory(event.target.value)}
              >
                <option value="">All subcategories</option>
                {subcategories.map((value) => (
                  <option value={value} key={value}>
                    {value.replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            )}

            <select
              aria-label="Filter availability"
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
            >
              <option value="">Availability: Any</option>
              <option value="in-stock">In stock only</option>
              <option value="out-of-stock">Out of stock</option>
            </select>

            <select
              aria-label="Minimum rating"
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
            >
              <option value="">Rating: Any</option>
              <option value="4.5">★ 4.5 &amp; up</option>
              <option value="4">★ 4.0 &amp; up</option>
              <option value="3">★ 3.0 &amp; up</option>
            </select>

            <div className="price-inputs">
              <input
                aria-label="Minimum price"
                type="number"
                min="0"
                placeholder="Min ৳"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
              />
              <span className="price-dash">–</span>
              <input
                aria-label="Maximum price"
                type="number"
                min="0"
                placeholder="Max ৳"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
            </div>

            <select
              className="listing-sort-select"
              aria-label="Sort products"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="relevance">Sort: Recommended</option>
              <option value="newest">Sort: Newest arrivals</option>
              <option value="low">Sort: Price low to high</option>
              <option value="high">Sort: Price high to low</option>
              <option value="rating">Sort: Highest rated</option>
              <option value="popular">Sort: Popularity</option>
            </select>
          </div>
        </div>

        {/* Active filter badges & result count */}
        <div className="listing-status-row">
          <div className="listing-count-text">
            Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> items
          </div>

          {hasActiveFilters && (
            <div className="active-filter-pills">
              {query && (
                <button type="button" className="filter-pill" onClick={() => setQuery("")}>
                  Query: “{query}” ✕
                </button>
              )}
              {category && (
                <button type="button" className="filter-pill" onClick={() => setCategory("")}>
                  {category.replace(/-/g, " ")} ✕
                </button>
              )}
              {subcategory && (
                <button type="button" className="filter-pill" onClick={() => setSubcategory("")}>
                  {subcategory.replace(/-/g, " ")} ✕
                </button>
              )}
              {availability && (
                <button type="button" className="filter-pill" onClick={() => setAvailability("")}>
                  {availability === "in-stock" ? "In stock" : "Out of stock"} ✕
                </button>
              )}
              {minRating && (
                <button type="button" className="filter-pill" onClick={() => setMinRating("")}>
                  ★ {minRating}+ ✕
                </button>
              )}
              {(minPrice || maxPrice) && (
                <button
                  type="button"
                  className="filter-pill"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  ৳{minPrice || "0"} – ৳{maxPrice || "∞"} ✕
                </button>
              )}
              <button type="button" className="clear-all-link" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {filtered.length ? (
        <div className="content-grid listing-grid">
          {filtered.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matching products found</h2>
          <p>Try adjusting your search keywords, price filters, or category.</p>
          <div className="empty-state-actions">
            <button className="button" type="button" onClick={clearFilters}>
              Reset all filters
            </button>
            <Link className="button button-secondary" href="/products">
              Browse all items
            </Link>
          </div>
        </div>
      )}
      {title && <span className="sr-only">{title}</span>}
    </div>
  );
}
