import { products } from "@/lib/products";
import { ProductListing } from "@/components/ProductListing";
export default function Search({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const query = searchParams.q || (searchParams as { query?: string }).query || "";
  return <main className="site-content"><div className="page-intro"><span className="eyebrow">Search results</span><h1>{query ? `Results for “${searchParams.q}”` : "Search Arozao"}</h1></div><ProductListing products={products} initialQuery={query} initialCategory={searchParams.category} /></main>;
}
