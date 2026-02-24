/**
 * Re-export shared category types and form schema for admin UI.
 * Single source of truth: @/types/category
 */
export type { Category, CategoryFormValues } from "@/types/category";
export { categoryFormSchema } from "@/types/category";