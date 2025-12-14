import { useFetch } from "iso-hooks";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface HighlightedCategory {
  id: string;
  title: string;
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
  // Use useFetch with the expected API response structure
  const { data, loading, error, refetch } = useFetch<
    ApiResponse<HighlightedCategory[]>
  >("/api/categories/highlights", {
    initialData: { data: [], success: true, message: "" },
  });

  // Derived state / Transformation logic
  // We extract the actual list from the API wrapper
  const categories = data?.success ? data.data : [];

  // Handle application-level errors (API returns 200 but success: false)
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
