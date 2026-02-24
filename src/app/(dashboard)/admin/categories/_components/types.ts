import * as Yup from "yup";

/**
 * Category entity as returned from API / used in admin list and form.
 * Mirrors the Category model (name, slug, parent, description, image, isFeatured).
 */
export type Category = {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  description?: string;
  image?: string;
  isFeatured?: boolean;
};

/**
 * Form values for creating a new category.
 */
export type CategoryFormValues = {
  name: string;
  slug: string;
  parent: string;
  description: string;
  isFeatured: boolean;
};

/** Yup schema for category form validation (Persian error messages). */
export const categoryFormSchema = Yup.object().shape({
  name: Yup.string().required("نام دسته الزامی است"),
  slug: Yup.string().required("شناسه (slug) لازم است").lowercase(),
  parent: Yup.string().nullable(),
  description: Yup.string().nullable(),
  isFeatured: Yup.boolean().default(false),
});
