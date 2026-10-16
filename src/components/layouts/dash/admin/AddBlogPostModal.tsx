"use client";

import BlogPostEditor from "./BlogPostEditor";

export default function AddBlogPostModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  return <BlogPostEditor onClose={onClose} onSaved={onAdd} />;
}
