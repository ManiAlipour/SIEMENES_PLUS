import * as Yup from "yup";

/**
 * Category entity — aligned with Mongoose Category model.
 * Used across API responses, admin UI, and frontend components.
 */
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  description?: string;
  image?: string;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Form payload for creating/updating a category.
 */
export interface CategoryFormValues {
  name: string;
  slug: string;
  parent: string;
  description: string;
  isFeatured: boolean;
}

/** Yup schema for category form validation (Persian messages). */
export const categoryFormSchema = Yup.object().shape({
  name: Yup.string().required("نام دسته الزامی است"),
  slug: Yup.string().required("شناسه (slug) لازم است").lowercase(),
  parent: Yup.string().nullable(),
  description: Yup.string().nullable(),
  isFeatured: Yup.boolean().default(false),
});

/**
 * Serialize a category document from DB to API/UI shape (e.g. parent ObjectId → string).
 */
export function toCategoryDTO(doc: {
  _id: unknown;
  name: string;
  slug: string;
  parent?: unknown;
  description?: string;
  image?: string;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}): Category {
  return {
    _id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    parent: doc.parent != null ? String(doc.parent) : null,
    description: doc.description,
    image: doc.image,
    isFeatured: doc.isFeatured ?? false,
    ...(doc.createdAt && { createdAt: doc.createdAt.toISOString() }),
    ...(doc.updatedAt && { updatedAt: doc.updatedAt.toISOString() }),
  };
}
