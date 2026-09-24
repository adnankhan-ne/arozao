import { Product } from "@/types";

const categoryAliases: Record<string, string[]> = {
  "gaming accessories": ["electronics", "gadgets", "phone-accessories", "computer-accessories"],
  electronics: ["electronics", "gadgets", "phone-accessories", "computer-accessories"],
  gadgets: ["electronics", "gadgets"],
  "phone accessories": ["electronics", "phone-accessories"],
  "phone-accessories": ["electronics", "phone-accessories"],
  "computer accessories": ["electronics", "computer-accessories"],
  "computer-accessories": ["electronics", "computer-accessories"],
  fashion: ["fashion", "girls-fashion", "boys-fashion"],
  "fashion trends": ["fashion", "girls-fashion", "boys-fashion"],
  "girls fashion": ["fashion", "girls-fashion"],
  "girls-fashion": ["fashion", "girls-fashion"],
  girls: ["fashion", "girls-fashion"],
  "boys fashion": ["fashion", "boys-fashion"],
  "boys-fashion": ["fashion", "boys-fashion"],
  boys: ["fashion", "boys-fashion"],
  home: ["home", "home-decor", "kitchen", "kitchen-appliances", "lifestyle", "showpieces"],
  "home essentials": ["home", "home-decor", "kitchen", "kitchen-appliances", "lifestyle", "showpieces"],
  "home decor": ["home", "home-decor"],
  "home-decor": ["home", "home-decor"],
  "kitchen applications": ["home", "kitchen", "kitchen-appliances"],
  "kitchen-appliances": ["home", "kitchen", "kitchen-appliances"],
  lifestyle: ["home", "lifestyle"],
  "life style": ["home", "lifestyle"],
  showpieces: ["home", "showpieces"],
  beauty: ["beauty", "girls-fashion"],
};

const normalize = (value: string) =>
  value.normalize("NFKC").toLocaleLowerCase().replace(/[^a-z0-9\u0980-\u09ff]+/gi, " ").trim();

function tokenMatches(token: string, fields: string[]) {
  if (fields.some((field) => field.includes(token))) return true;
  if (token.length < 4) return false;
  return fields.some((field) => field.split(" ").some((word) => word.startsWith(token.slice(0, Math.max(3, token.length - 1)))));
}

export function productMatches(product: Product, query = "", category = "") {
  const normalizedQuery = normalize(query);
  const normalizedCategory = normalize(category);
  const fields = normalize([
    product.name,
    product.sku,
    product.brand,
    product.category,
    product.subcategory,
    product.description,
    product.shortDescription,
    ...product.tags,
    ...product.keywords,
  ].join(" "));
  const fieldTokens = fields.split(/\s+/);
  const aliases = categoryAliases[normalizedQuery] || [];
  const categoryMatches = !normalizedCategory
    || product.category === normalizedCategory.replace(/ /g, "-")
    || (categoryAliases[normalizedCategory] || []).includes(product.category);
  const queryMatches = !normalizedQuery
    || aliases.includes(product.category)
    || normalizedQuery.split(/\s+/).every((token) => tokenMatches(token, fieldTokens));
  return categoryMatches && queryMatches;
}

export function searchProducts(products: Product[], query = "", category = "") {
  return products.filter((product) => productMatches(product, query, category));
}
