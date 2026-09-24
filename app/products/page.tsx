import { products } from "@/lib/products";
import { ProductListing } from "@/components/ProductListing";
export default function Products({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const query = searchParams.query || searchParams.q || "";
  return <main className="site-content"><div className="page-intro"><span className="eyebrow">Shop all</span><h1>{query ? `Results for “${query}”` : "Find something wonderful."}</h1><p>Browse everyday essentials across electronics, fashion, home, and more.</p></div><ProductListing products={products} initialQuery={query} initialCategory={searchParams.category} initialSubcategory={searchParams.subcategory} /></main>;
}
