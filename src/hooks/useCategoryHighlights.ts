import { useFetch } from "iso-hooks";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface HighlightedCategory {
  id: string;
  slug?: string;
  title: string;
  image?: string | null;
  products: Product[];
}

// Standard API Response Wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface UseCategoryHighlightsReturn {
  categories: HighlightedCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCategoryHighlights(): UseCategoryHighlightsReturn {
  const { data, loading, error, refetch } = useFetch<
    ApiResponse<HighlightedCategory[]>
  >("/api/categories/highlights", {
    initialData: { data: [], success: true, message: "" },
  });

  const categories = data?.success ? data.data : [];

  const apiErrorMessage =
    data && !data.success ? data.message || "API Error" : null;
  const finalError = error ? error.message : apiErrorMessage;

  return {
    categories: categories || [],
    loading,
    error: finalError,
    refetch,
  };
}
