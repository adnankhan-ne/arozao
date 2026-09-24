import { notFound } from "next/navigation";
import { categories, products, getCategory } from "@/lib/products";
import { ProductListing } from "@/components/ProductListing";
export function generateStaticParams() { return categories.map(({ slug }) => ({ slug })); }
export default function Category({ params }: { params: { slug: string } }) { const category = getCategory(params.slug); if (!category) notFound(); return <main className="site-content"><div className="page-intro"><span className="eyebrow">Category</span><h1>{category.name}</h1><p>Discover our {category.name.toLowerCase()} collection.</p></div><ProductListing products={products} initialCategory={params.slug} /></main>; }
