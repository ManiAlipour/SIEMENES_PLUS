import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export type HighlightedCategory = {
  id: string;
  slug?: string;
  title: string;
  image?: string | null;
  products: {
    id: string;
    name: string;
    price?: number;
    image: string;
    slug: string;
  }[];
};

export async function getCategoryHighlights(): Promise<HighlightedCategory[]> {
  await connectDB();

  const topCategories = await Category.find({}, "name slug image isFeatured")
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(6)
    .lean();

  return Promise.all(
    topCategories.map(async (category) => {
      const products = await Product.find(
        { category: category.slug },
        "name image slug brand price modelNumber",
      )
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      return {
        id: String(category._id),
        slug: category.slug,
        title: category.name,
        image: category.image || null,
        products: products.map((product) => ({
          id: String(product._id),
          name: product.name,
          price: product.price as number | undefined,
          image: product.image,
          slug: product.slug,
        })),
      };
    }),
  );
}
