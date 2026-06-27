import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

function normalizeSpecifications(
  specs: unknown,
): Record<string, string> {
  if (!specs || typeof specs !== "object") return {};
  if (specs instanceof Map) {
    return Object.fromEntries(specs.entries()) as Record<string, string>;
  }
  return specs as Record<string, string>;
}

async function getSimilarProducts(
  product: { _id: unknown; brand?: string; category?: string },
  limit = 10,
) {
  const filter: Record<string, unknown> = {
    _id: { $ne: product._id },
    $or: [] as Record<string, unknown>[],
  };

  if (product.brand) (filter.$or as Record<string, unknown>[]).push({ brand: product.brand });
  if (product.category) (filter.$or as Record<string, unknown>[]).push({ category: product.category });

  const query =
    (filter.$or as unknown[]).length > 0
      ? Product.find(filter).sort({ createdAt: -1 }).limit(limit).lean()
      : Product.find({ _id: { $ne: product._id } })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();

  return query;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectDB();

  const decoded = decodeURIComponent(slug);
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(decoded);
  const query = isMongoId ? { _id: decoded } : { slug: decoded };

  const doc = (await Product.findOne(query).lean()) as Record<
    string,
    unknown
  > | null;
  if (!doc) return null;

  const similarRaw = await getSimilarProducts({
    _id: doc._id,
    brand: doc.brand as string | undefined,
    category: doc.category as string | undefined,
  });

  const similarProducts = similarRaw.map((p) => ({
    ...p,
    _id: String(p._id),
    specifications: normalizeSpecifications(
      (p as { specifications?: unknown }).specifications,
    ),
  }));

  return {
    ...doc,
    _id: String(doc._id),
    specifications: normalizeSpecifications(doc.specifications),
    similarProducts,
  } as Product;
}
