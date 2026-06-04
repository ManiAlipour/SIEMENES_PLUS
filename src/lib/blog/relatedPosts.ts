import BlogPost, { sanitizeBlogPostSummary } from "@/models/BlogPost";
import type { RelatedPostSummary } from "@/components/blog/RelatedPosts";

export async function fetchRelatedBlogPosts(
  postId: string,
  tags: string[],
  limit = 3,
): Promise<RelatedPostSummary[]> {
  const baseQuery: Record<string, unknown> = {
    status: "published",
    _id: { $ne: postId },
  };

  let posts: any[] = [];

  if (tags.length > 0) {
    posts = await BlogPost.find({ ...baseQuery, tags: { $in: tags } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  if (posts.length < limit) {
    const excludeIds = [postId, ...posts.map((p) => p._id)];
    const more = await BlogPost.find({
      status: "published",
      _id: { $nin: excludeIds },
    })
      .sort({ createdAt: -1 })
      .limit(limit - posts.length)
      .lean();
    posts = [...posts, ...more];
  }

  return posts.map((p) => {
    const s = sanitizeBlogPostSummary(p);
    return {
      _id: String(s._id),
      title: s.title,
      slug: s.slug,
      excerpt: s.excerpt,
      coverImage: s.coverImage,
      createdAt: String(s.createdAt),
    };
  });
}
