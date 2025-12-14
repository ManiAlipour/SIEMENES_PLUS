"use client";

import { useMemo } from "react";
import { useFetch } from "iso-hooks";

// --- Interfaces ---
interface Product {
  id: string;
  name: string; // و سایر فیلدها...
  // ...
}

interface UseProductsParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductsApiResponse {
  success: boolean;
  message?: string;
  items: Product[];
  total: number;
  pages: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  pages: number;
  currentPage: number;
  refetch: () => void;
}

export function useProducts({
  search = "",
  category = "",
  sort = "-createdAt",
  page = 1,
  limit = 12,
}: UseProductsParams = {}): UseProductsReturn {
  // 1. Constructing the URL dynamically
  // We use useMemo to create the query string.
  // This ensures the URL string only changes when actual params change.
  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    return `/api/products?${params.toString()}`;
  }, [search, category, sort, page, limit]);

  // 2. Using useFetch
  // Whenever 'url' changes, useFetch (if implemented correctly with dependency array) will auto-refetch.
  const { data, loading, error, refetch } = useFetch<ProductsApiResponse>(url);

  // 3. Data Extraction & Safety Checks
  const products = data?.success ? data.items : [];
  const total = data?.success ? data.total : 0;
  const pages = data?.success ? data.pages : 0;

  // Handle errors: If fetch failed OR API returned success:false
  const finalError = error
    ? error.message
    : data && !data.success
    ? data.message || "خطا در دریافت محصولات"
    : null;

  return {
    products: products || [],
    loading,
    error: finalError,
    total,
    pages,
    currentPage: page,
    refetch,
  };
}
