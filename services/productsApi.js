const BASE_URL = "https://dummyjson.com/products";
const PRODUCTS_LIMIT = 30;

const CATEGORY_ICON_MAP = {
  smartphones: "phone-android",
  "mobile-accessories": "devices",
  laptops: "laptop",
  tablets: "tablet-mac",
  beauty: "spa",
  fragrances: "local-florist",
  skin: "face",
  groceries: "shopping-basket",
  furniture: "weekend",
  "home-decoration": "home",
  "kitchen-accessories": "kitchen",
  tops: "checkroom",
  "womens-dresses": "checkroom",
  "womens-shoes": "directions-run",
  "mens-shirts": "checkroom",
  "mens-shoes": "directions-run",
  "mens-watches": "watch",
  "womens-watches": "watch",
  "womens-bags": "shopping-bag",
  "womens-jewellery": "diamond",
  sunglasses: "visibility",
  automotive: "directions-car",
  motorcycle: "two-wheeler",
  lighting: "lightbulb",
  sports: "sports-soccer",
};

const CATEGORY_COLORS = [
  "#FF6B35",
  "#4ECDC4",
  "#18413a",
  "#5d2222",
  "#231545",
  "#ff88b6",
  "#d0d058",
  "#63bcdc",
  "#f89898",
  "#7493a9",
  "#efc10a",
  "#52d764",
];

const formatNaira = (amount) => `₦ ${Number(amount || 0).toLocaleString()}`;

const toTitleCase = (value = "") =>
  value
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const mapProduct = (item) => {
  const price = Number(item?.price || 0);
  const discountPercentage = Number(item?.discountPercentage || 0);
  const basePrice =
    discountPercentage > 0
      ? Math.round(price / (1 - discountPercentage / 100))
      : null;

  return {
    id: String(item?.id),
    name: item?.title || "Product",
    price: formatNaira(price),
    originalPrice: basePrice ? formatNaira(basePrice) : null,
    discount: discountPercentage ? `${Math.round(discountPercentage)}% OFF` : null,
    image: { uri: item?.thumbnail || item?.images?.[0] || "" },
    description: item?.description || "",
    category: item?.category || "",
    rating: item?.rating ?? null,
  };
};

const mapCategory = (slug, index = 0) => ({
  id: String(index + 1),
  slug,
  name: toTitleCase(slug),
  icon: CATEGORY_ICON_MAP[slug] || "category",
  color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
});

export const getAllProducts = async () => {
  let allProducts = [];
  let skip = 0;
  let total = 0;

  do {
    const response = await fetch(
      `${BASE_URL}?limit=${PRODUCTS_LIMIT}&skip=${skip}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const pageProducts = Array.isArray(data?.products) ? data.products : [];
    allProducts = [...allProducts, ...pageProducts];
    total = Number(data?.total || pageProducts.length || 0);
    skip += PRODUCTS_LIMIT;
  } while (skip < total);

  return allProducts.map(mapProduct);
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/category-list`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  const categories = Array.isArray(data) ? data : [];
  return categories.map((slug, index) => mapCategory(slug, index));
};

export const searchProducts = async (query) => {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) return [];

  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(trimmedQuery)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products : [];
  return products.map(mapProduct);
};

export const getProductsByCategory = async (categorySlug) => {
  const response = await fetch(
    `${BASE_URL}/category/${encodeURIComponent(categorySlug)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products : [];
  return products.map(mapProduct);
};

export const addProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return response.json();
};

export const updateProduct = async (productId, updates, method = "PUT") => {
  const response = await fetch(`${BASE_URL}/${productId}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`${BASE_URL}/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
};
