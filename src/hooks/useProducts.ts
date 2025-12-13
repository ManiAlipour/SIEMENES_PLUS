"use client";

import { useState, useEffect, useCallback } from "react";

interface UseProductsParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "خطا در دریافت محصولات");
      }

      setProducts(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 0);
    } catch (err: any) {
      setError(err.message || "خطا در دریافت محصولات");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    pages,
    currentPage: page,
    refetch: fetchProducts,
  };
}
