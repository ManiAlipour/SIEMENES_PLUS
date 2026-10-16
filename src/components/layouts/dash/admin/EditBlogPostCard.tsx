"use client";

import BlogPostEditor, { type BlogPostEditorData } from "./BlogPostEditor";

export default function EditBlogPostCard({ post, onClose, onEdit }: { post: BlogPostEditorData; onClose: () => void; onEdit: () => void }) {
  return <BlogPostEditor post={post} onClose={onClose} onSaved={onEdit} />;
}
