import Product from "@/models/Product";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";
import { escapeRegex } from "@/lib/analytics/search";

export type ProductQueryParams = {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  modelNumber?: string;
  isFeatured?: boolean;
};

export type ProductQueryResult = {
  items: ProductObject[];
  total: number;
  page: number;
  pages: number;
};

/** Flexible regex for part numbers typed with/without separators (e.g. 6ES7214-1AG40). */
export function buildFlexibleModelNumberRegex(raw: string): RegExp | null {
  const compact = raw.replace(/[\s\-._/\\]/g, "");
  if (compact.length < 3 || !/^[a-zA-Z0-9]+$/i.test(compact)) {
    return null;
  }

  const pattern = compact
    .split("")
    .map((char) => escapeRegex(char))
    .join("[\\s\\-._/\\\\]*");

  return new RegExp(pattern, "i");
}

export async function buildProductFilter(params: ProductQueryParams) {
  const { search = "", modelNumber, isFeatured } = params;
  let { category = "" } = params;

  const filter: Record<string, unknown> = {};

  if (category && /^[a-f\d]{24}$/i.test(category.trim())) {
    await connectDB();
    const catDoc = (await Category.findById(category.trim()).lean()) as
      | { slug?: string }
      | null;
    if (catDoc?.slug) {
      category = catDoc.slug;
    }
  }

  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    const orConditions: Record<string, unknown>[] = [
      { name: { $regex: searchRegex } },
      { slug: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { modelNumber: { $regex: searchRegex } },
      { "specifications.key": { $regex: searchRegex } },
      { "specifications.value": { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ];

    const flexModelRegex = buildFlexibleModelNumberRegex(trimmedSearch);
    if (flexModelRegex) {
      orConditions.push({ modelNumber: { $regex: flexModelRegex } });
    }

    if (/^[a-f\d]{24}$/i.test(trimmedSearch)) {
      orConditions.push({ _id: trimmedSearch });
    }
    orConditions.push({ slug: trimmedSearch });

    filter.$or = orConditions;
  }

  if (modelNumber) {
    filter.modelNumber = { $regex: escapeRegex(modelNumber), $options: "i" };
  }

  if (category) {
    filter.category = { $regex: category, $options: "i" };
  }

  if (isFeatured) {
    filter.isFeatured = true;
  }

  return filter;
}

export async function queryProducts(
  params: ProductQueryParams = {},
): Promise<ProductQueryResult> {
  await connectDB();

  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 12));
  const sort = params.sort ?? "-createdAt";
  const safeSort = /^[\w\-\s]+$/.test(sort) ? sort : "-createdAt";

  const filter = await buildProductFilter(params);

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(safeSort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items: items as ProductObject[],
    total,
    page,
    pages: Math.ceil(total / limit) || 0,
  };
}
