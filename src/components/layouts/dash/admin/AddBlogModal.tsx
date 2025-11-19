"use client";
import { useState, useRef } from "react";
import { FiX, FiCamera, FiLink, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const glass =
  "bg-white/40 backdrop-blur-lg border border-white/30 shadow-cyan-500/20";
const inputBase =
  "w-full px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/30 focus:ring-2 focus:ring-cyan-500 outline-none transition-all";

interface AddBlogModalProps {
  onClose: () => void;
  onAdd: () => void;
}

export default function AddBlogModal({ onClose, onAdd }: AddBlogModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [coverImage, setCoverImage] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handle File Upload ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview("");
    setCoverImage("");
  };

  // --- Submit Blog ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaType === "image" && !coverImage)
      return toast.error("تصویر الزامی است 📸");
    if (mediaType === "video" && !coverImage)
      return toast.error("لینک آپارات الزامی است 🎬");

    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          mediaType,
          coverImage,
          status,
        }),
      });

      if (res.ok) {
        await fetch("/api/admin/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: "مانی ایمانی",
            action: "ADD_BLOG",
            entity: "blog",
            entityName: title,
          }),
        });
        toast.success("بلاگ افزوده شد ✨");
        onAdd();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "خطا در افزودن بلاگ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* --- Modal Container --- */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl sm:max-w-2xl mx-auto px-4 sm:px-6 rounded-2xl overflow-visible animate-slideUp"
      >
        {/* --- Header --- */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-700 p-4 text-white font-bold text-lg flex justify-between items-center">
          <span>افزودن بلاگ جدید</span>
          <button onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* --- Body --- */}
        <div
          className={`${glass} p-6 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/40 scrollbar-track-transparent`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Each field with small delay animation */}
            <div className="animate-fadeIn [animation-delay:0.05s]">
              <input
                className={inputBase}
                placeholder="عنوان بلاگ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="animate-fadeIn [animation-delay:0.1s]">
              <input
                className={inputBase}
                placeholder="نویسنده"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div className="animate-fadeIn [animation-delay:0.15s]">
              <textarea
                className={`${inputBase} min-h-[120px]`}
                placeholder="محتوای بلاگ"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="animate-fadeIn [animation-delay:0.2s]">
              <input
                className={inputBase}
                placeholder="تگ‌ها (با کاما جدا کنید)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* --- Media Type --- */}
            <div className="flex gap-6 mt-2 text-slate-700 animate-fadeIn [animation-delay:0.25s]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={mediaType === "image"}
                  onChange={() => setMediaType("image")}
                />
                <span>عکس</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={mediaType === "video"}
                  onChange={() => {
                    setMediaType("video");
                    clearImage();
                  }}
                />
                <span>ویدیو (آپارات)</span>
              </label>
            </div>

            {/* --- Dropzone or Aparat Link --- */}
            <div className="animate-fadeIn [animation-delay:0.3s]">
              {mediaType === "image" ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group cursor-pointer rounded-xl border-2 border-dashed border-cyan-400/50 ${glass} h-44 flex flex-col items-center justify-center relative transition-all hover:scale-[1.02]`}
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full h-full object-cover rounded-xl animate-fadeIn"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="absolute top-2 right-2 bg-white/70 hover:bg-white/90 text-red-500 p-1 rounded-full"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-700">
                      <FiCamera className="text-cyan-600 text-2xl" />
                      <span className="text-sm">کلیک یا درگ و دراپ</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <FiLink className="text-cyan-600" />
                    <span className="text-sm">لینک ویدیوی آپارات</span>
                  </div>
                  <input
                    className={`${inputBase} mt-2`}
                    placeholder="https://www.aparat.com/v/..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* --- Status --- */}
            <div className="flex gap-4 mt-4 text-slate-700 animate-fadeIn [animation-delay:0.35s]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                />
                <span>پیش‌نویس</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                />
                <span>منتشر شود</span>
              </label>
            </div>

            {/* --- Submit --- */}
            <button
              disabled={loading}
              type="submit"
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-inner shadow-cyan-500/30 hover:shadow-cyan-500 transition-all active:scale-95 animate-fadeIn [animation-delay:0.4s]"
            >
              {loading ? "در حال ارسال..." : "افزودن بلاگ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
