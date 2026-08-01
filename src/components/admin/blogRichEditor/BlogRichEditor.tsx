"use client";

import React, { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import {
  RiImageAddLine,
  RiTable2,
  RiFlipHorizontalLine,
  RiBold,
  RiItalic,
  RiUnderline,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiCodeLine,
  RiDoubleQuotesL,
  RiStrikethrough,
  RiHeading,
  RiH2,
  RiH3,
  RiH4,
  RiH5,
  RiH6,
  RiArrowGoBackFill,
  RiArrowGoForwardFill,
  RiParagraph,
} from "react-icons/ri";
import { FaSuperscript, FaSubscript } from "react-icons/fa6";
import BlogProductPickerModal, {
  type ProductOption,
} from "../BlogProductPickerModal";
import { BG, BLUR_OVERLAY, BORDER, ROUNDED, SHADOW } from "./constants";
import type { BlogRichEditorProps } from "./types";

// ======== Add custom styles for rich formatting preview ========
const CustomStyles = () => (
  <style jsx global>{`
    .tiptap-editor-content h1 {
      font-size: 2.2em !important;
      font-weight: 800 !important;
      margin-top: 1.4em;
      margin-bottom: 0.7em;
      line-height: 1.2;
      color: #23272f;
    }
    .tiptap-editor-content h2 {
      font-size: 1.7em !important;
      font-weight: 700 !important;
      margin-top: 1.2em;
      margin-bottom: 0.7em;
      color: #334155;
    }
    .tiptap-editor-content h3 {
      font-size: 1.34em !important;
      font-weight: 700 !important;
      margin-top: 1.1em;
      margin-bottom: 0.6em;
      color: #475569;
    }
    .tiptap-editor-content h4 {
      font-size: 1.12em !important;
      font-weight: 700 !important;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: #64748b;
    }
    .tiptap-editor-content h5 {
      font-size: 1.01em !important;
      font-weight: 600 !important;
      margin-top: 0.9em;
      margin-bottom: 0.5em;
      color: #0e7490;
    }
    .tiptap-editor-content h6 {
      font-size: 0.99em !important;
      font-weight: 600 !important;
      margin-top: 0.9em;
      margin-bottom: 0.5em;
      color: #0891b2;
    }
    .tiptap-editor-content p {
      font-size: 1.05em;
      margin: 0.5em 0;
    }
    .tiptap-editor-content blockquote {
      border-right: 5px solid #06b6d4;
      background: #e0f7fa;
      color: #036672;
      font-size: 1.13em;
      padding: 12px 20px;
      margin: 1em 0;
      border-radius: 8px;
    }
    .tiptap-editor-content pre {
      background: #f5f5f5 !important;
      color: #333;
      padding: 1em !important;
      border-radius: 9px;
      font-family: "Fira Mono", monospace;
      font-size: 0.98em;
      overflow-x: auto;
      line-height: 1.5;
      margin: 1em 0;
    }
    .tiptap-editor-content code:not(pre code) {
      background: #e0e7ef;
      border-radius: 5px;
      padding: 2px 6px;
      color: #2266bb;
      font-size: 1em;
      font-family: "Fira Mono", monospace;
    }
    .tiptap-editor-content ul,
    .tiptap-editor-content ol {
      padding-right: 1.3em;
      margin: 1em 0;
    }
    .tiptap-editor-content ul {
      list-style-type: disc !important;
    }
    .tiptap-editor-content ol {
      list-style-type: decimal !important;
    }
    .tiptap-editor-content li {
      margin-top: 0.2em;
      margin-bottom: 0.2em;
      line-height: 1.75;
      font-size: 1.03em;
    }
    /* Table styles */
    .tiptap-editor-content table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      margin: 1.2em 0 !important;
      background: #f8fafc;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px #06b6d41a;
    }
    .tiptap-editor-content th,
    .tiptap-editor-content td {
      border: 1.5px solid #bae6fd;
      padding: 8px 14px;
      min-width: 50px;
      background: #e0f2fe;
      font-size: 1em;
      vertical-align: middle;
      text-align: right;
      transition: background 0.2s;
    }
    .tiptap-editor-content th {
      background: #7dd3fc;
      color: #0e7490;
      font-weight: 700;
    }
    .tiptap-editor-content tr:nth-child(even) td {
      background: #f1f5f9;
    }
    /* Image */
    .tiptap-editor-content img {
      display: block;
      margin: 1.2em auto;
      border-radius: 13px;
      box-shadow: 0 2px 12px #04b6d4a8;
      max-width: 98%;
      height: auto;
    }
    /* Youtube and iframe preview */
    .tiptap-editor-content iframe {
      display: block;
      margin: 1em auto;
      border: none;
      border-radius: 12px;
      width: 100% !important;
      aspect-ratio: 16/9;
      max-width: 700px;
      box-shadow: 0 3px 12px 0 #06b6d440;
    }
    /* Custom Product Block */
    .tiptap-editor-content .blog-product-embed {
      background: #e0f2fe;
      border-radius: 14px 8px 14px 8px;
      border: 1.5px solid #7dd3fc;
      font-size: 1.13em;
      font-weight: 600;
      color: #036672;
      padding: 18px 16px;
      margin: 18px 0;
      box-shadow: 0 2px 12px #06b6d44a;
      display: flex;
      align-items: center;
      gap: 8px;
      pointer-events: none; /* Prevent accidental editing */
      user-select: none;
    }
    /* Horizontal Rule */
    .tiptap-editor-content hr {
      border: none;
      border-top: 2px dashed #bae6fd;
      margin: 1.5em 0;
      height: 1px;
      background: none;
    }
    /* Focused table cell highlight */
    .tiptap-editor-content .selectedCell {
      background: #bae6fd !important;
      outline: 2.5px solid #38bdf8;
    }
  `}</style>
);

// ============== Menu Bar ==============
const CustomMenuBar = ({
  editor,
  onImageClick,
  onTablePickerClick,
  onProductClick,
  onDividerClick,
}) => {
  if (!editor) {
    return null;
  }

  // Extended: headingLevels
  // برای دکمه های هدینگ نمایش فونت سایز و مثال متنی
  const headingLevels = [
    {
      level: 1,
      icon: <span className="font-extrabold text-2xl">H1</span>,
      title: "عنوان h1 (اصلی)",
      preview: <span className="font-extrabold text-2xl">عنوان H1</span>,
    },
    {
      level: 2,
      icon: <span className="font-bold text-xl">H2</span>,
      title: "عنوان h2",
      preview: <span className="font-bold text-xl">عنوان H2</span>,
    },
    {
      level: 3,
      icon: <span className="font-bold text-lg">H3</span>,
      title: "عنوان h3",
      preview: <span className="font-bold text-lg">عنوان H3</span>,
    },
    {
      level: 4,
      icon: <span className="font-semibold text-base">H4</span>,
      title: "عنوان h4",
      preview: <span className="font-semibold text-base">عنوان H4</span>,
    },
    {
      level: 5,
      icon: <span className="font-semibold text-sm text-cyan-700">H5</span>,
      title: "عنوان h5",
      preview: (
        <span className="font-semibold text-sm text-cyan-700">عنوان H5</span>
      ),
    },
    {
      level: 6,
      icon: <span className="font-semibold text-xs text-cyan-600">H6</span>,
      title: "عنوان h6",
      preview: (
        <span className="font-semibold text-xs text-cyan-600">عنوان H6</span>
      ),
    },
  ];

  // لیبل نمونه بصری برای پاراگراف
  const paragraphPreview = (
    <span className="text-base font-normal">پاراگراف</span>
  );

  return (
    <div
      className="flex items-center gap-2 px-1 sm:px-4 py-2 border-b border-slate-100 sticky top-0 z-10 bg-white/95 backdrop-blur-lg overflow-x-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
      role="toolbar"
      aria-label="ابزار ویرایش متن"
    >
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1 rounded hover:bg-blue-50 text-xl"
        title="بازگشت"
        disabled={!editor.can().undo()}
      >
        <RiArrowGoBackFill />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1 rounded hover:bg-blue-50 text-xl"
        title="دوباره"
        disabled={!editor.can().redo()}
      >
        <RiArrowGoForwardFill />
      </button>

      <span className="border-l mx-2 h-6 border-slate-200" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg flex flex-col items-center min-w-[50px]" +
          (editor.isActive("paragraph") ? " bg-blue-100 text-blue-700" : "")
        }
        title="پاراگراف معمولی"
        type="button"
      >
        {paragraphPreview}
      </button>
      {headingLevels.map((h) => (
        <button
          key={h.level}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: h.level }).run()
          }
          className={
            "p-1 rounded hover:bg-blue-50 text-lg flex flex-col items-center min-w-[50px]" +
            (editor.isActive("heading", { level: h.level })
              ? " bg-blue-100 text-blue-700"
              : "")
          }
          title={h.title}
          type="button"
        >
          {h.icon}
          <span className="text-xs opacity-60">
            {h.title.replace("عنوان ", "")}
          </span>
        </button>
      ))}

      <span className="border-l mx-2 h-6 border-slate-200" />

      {/* Base styles */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg font-bold" +
          (editor.isActive("bold") ? " bg-blue-100 text-blue-700" : "")
        }
        title="بولد"
        type="button"
      >
        <span className="font-extrabold text-lg">B</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg italic" +
          (editor.isActive("italic") ? " bg-blue-100 text-blue-700" : "")
        }
        title="ایتالیک"
        type="button"
      >
        <span className="italic text-lg">I</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg underline decoration-2" +
          (editor.isActive("underline") ? " bg-blue-100 text-blue-700" : "")
        }
        title="زیرخط"
        type="button"
      >
        <span className="underline decoration-2">U</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg line-through" +
          (editor.isActive("strike") ? " bg-blue-100 text-blue-700" : "")
        }
        title="خط خورده"
        type="button"
      >
        <span className="line-through">S</span>
      </button>

      <span className="border-l mx-2 h-6 border-slate-200" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg" +
          (editor.isActive("bulletList") ? " bg-blue-100 text-blue-700" : "")
        }
        title="لیست"
        type="button"
      >
        <span className="text-lg align-middle">• لیست</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg" +
          (editor.isActive("orderedList") ? " bg-blue-100 text-blue-700" : "")
        }
        title="لیست عددی"
        type="button"
      >
        <span className="text-base align-middle">1. لیست عددی</span>
      </button>

      <span className="border-l mx-2 h-6 border-slate-200" />

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg" +
          (editor.isActive("blockquote") ? " bg-blue-100 text-blue-700" : "")
        }
        title="نقل قول"
        type="button"
      >
        <span className="text-sky-500 text-xl font-bold">❝</span>
      </button>

      {/* Code, Code Block */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg" +
          (editor.isActive("code") ? " bg-blue-100 text-blue-700" : "")
        }
        title="کد (تک خطی)"
        type="button"
      >
        <span
          className="bg-slate-200 px-1 rounded text-[1em] font-mono"
          style={{ fontFamily: "Fira Mono, monospace" }}
        >
          {"<code>"}
        </span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg" +
          (editor.isActive("codeBlock") ? " bg-blue-100 text-blue-700" : "")
        }
        title="کد چندخطی"
        type="button"
      >
        <span
          className="bg-slate-200 px-1 rounded text-[1em] font-mono"
          style={{ fontFamily: "Fira Mono, monospace" }}
        >
          {"< >"}
        </span>
      </button>

      {/* Superscript/Subscript 
      <button
        onClick={() => editor.chain().focus().toggleSuperscript?.().run()} // Conditionally use this if Superscript extension is available
        className="p-1 rounded hover:bg-blue-50 text-lg"
        title="بالانویس (Superscript)"
        type="button"
        disabled={!editor.can().toggleSuperscript?.()}
        style={{ opacity: editor.can().toggleSuperscript?.() ? 1 : 0.45 }}
      >
        <FaSuperscript />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSubscript?.().run()}
        className="p-1 rounded hover:bg-blue-50 text-lg"
        title="زیرنویس (Subscript)"
        type="button"
        disabled={!editor.can().toggleSubscript?.()}
        style={{ opacity: editor.can().toggleSubscript?.() ? 1 : 0.45 }}
      >
        <FaSubscript />
      </button>
      */}

      {/* Link */}
      <button
        onClick={() => {
          const url = prompt("آدرس لینک را وارد کنید:", "https://");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={
          "p-1 rounded hover:bg-blue-50 text-lg underline text-blue-600" +
          (editor.isActive("link") ? " bg-blue-100 text-blue-700" : "")
        }
        title="لینک"
        type="button"
      >
        <span className="underline decoration-blue-400">Link</span>
      </button>
      {/* Remove Link */}
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="p-1 rounded hover:bg-blue-50 text-base"
        title="حذف لینک"
        type="button"
        disabled={!editor.isActive("link")}
        style={{ opacity: editor.isActive("link") ? 1 : 0.4 }}
      >
        ❌
      </button>

      <span className="border-l mx-2 h-6 border-slate-200" />

      {/* Image */}
      <button
        onClick={onImageClick}
        className="p-1 rounded hover:bg-blue-50 text-lg"
        title="تصویر"
        type="button"
      >
        <span className="text-lg">🖼️</span>
      </button>
      {/* Divider / HR */}
      <button
        onClick={onDividerClick}
        className="p-1 rounded hover:bg-blue-50 text-lg"
        title="خط افقی"
        type="button"
      >
        <span
          className="inline-block w-7 border-t-2 border-dashed border-cyan-400"
          style={{ height: "7px" }}
        />
      </button>
      {/* Table */}
      <button
        onClick={onTablePickerClick}
        className="p-1 rounded hover:bg-blue-50 text-lg flex flex-col items-center"
        title="جدول"
        type="button"
      >
        <span className="block">
          <svg width="22" height="17" viewBox="0 0 22 17">
            <rect
              x="1"
              y="1"
              width="20"
              height="15"
              rx="3"
              fill="#e0f2fe"
              stroke="#7dd3fc"
              strokeWidth="2"
            />
            <rect x="1" y="1" width="6.5" height="5.7" fill="#7dd3fc" />
            <rect x="7.5" y="1" width="6.5" height="5.7" fill="#bae6fd" />
            <rect x="14" y="1" width="6.9" height="5.7" fill="#7dd3fc" />
            <rect x="1" y="6.6" width="6.5" height="4.9" fill="#bae6fd" />
            <rect x="7.5" y="6.6" width="6.5" height="4.9" fill="#7dd3fc" />
            <rect x="14" y="6.6" width="6.9" height="4.9" fill="#bae6fd" />
            <rect x="1" y="11.7" width="6.5" height="4.3" fill="#7dd3fc" />
            <rect x="7.5" y="11.7" width="6.5" height="4.3" fill="#bae6fd" />
            <rect x="14" y="11.7" width="6.9" height="4.3" fill="#7dd3fc" />
          </svg>
        </span>
        <span className="text-xs mt-1 opacity-60">جدول</span>
      </button>
      {/* Youtube / Aparat */}
      <button
        onClick={() => {
          const url = prompt("آدرس ویدیو آپارات یا یوتیوب را وارد کنید:");
          if (!url) return;

          if (url.includes("aparat.com")) {
            const match = url.match(/\/v\/([a-zA-Z0-9-_]+)/);
            const id = match ? match[1] : undefined;
            if (id) {
              editor
                .chain()
                .focus()
                .insertContent(
                  `<iframe src="https://www.aparat.com/video/video/embed/videohash/${id}/vt/frame" allowFullScreen frameborder="0" style="width:100%;aspect-ratio:16/9;border-radius:12px"></iframe>`,
                )
                .run();
            }
          } else {
            editor
              .chain()
              .focus()
              .setYoutubeVideo({ src: url, width: 640, height: 360 })
              .run();
          }
        }}
        className="p-1 rounded hover:bg-blue-50 text-lg"
        title="ویدیو آپارات/یوتیوب"
        type="button"
      >
        <span className="inline-block rounded bg-[#38bdf8] px-1 pb-0.5 text-xs text-white">
          ▶️
        </span>
        <span className="text-xs opacity-70 pr-1">ویدیو</span>
      </button>

      {/* Product (Custom block) */}
      <button
        onClick={onProductClick}
        className="p-1 rounded hover:bg-blue-50 text-base flex flex-col items-center min-w-[42px]"
        title="افزودن محصول"
        type="button"
      >
        <span className="text-2xl">📦</span>
        <span className="text-xs opacity-60">محصول</span>
      </button>
    </div>
  );
};

// ============= Editor Component =============

export default function BlogRichEditor({
  value,
  onChange,
  placeholder = "متن مطلب را بنویسید...",
  minHeight = "280px",
  disabled = false,
}: BlogRichEditorProps) {
  const [showProductPicker, setShowProductPicker] = useState(false);

  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({
        controls: true,
        allowFullscreen: true,
      }),
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: [
          "blog-rich-editor-empty",
          "tiptap-editor-content",
          "p-3 sm:p-5 md:p-8",
          "outline-none",
          "prose prose-slate prose-img:rounded-xl prose-img:shadow-xl",
          "max-w-none min-w-0 min-h-[200px]",
          "focus:ring-2 focus:ring-cyan-400/60 focus:ring-inset",
          "rounded-b-2xl transition-shadow bg-white text-[1.02em] sm:text-[1.06em] leading-7",
          "custom-scrollbar",
        ].join(" "),
        style: `min-height: ${minHeight}; direction: auto;`,
        spellCheck: "true",
        tabIndex: "0",
        "aria-label": placeholder,
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== (value || "")) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  const handleImageClick = useCallback(() => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/admin/upload/blog-image", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data?.url) {
        editor.chain().focus().setImage({ src: data.url, alt: "" }).run();
      }
    };
    input.click();
  }, [editor]);

  const handleProductClick = useCallback(() => {
    setShowProductPicker(true);
  }, []);

  const handleInsertProduct = useCallback(
    (product: ProductOption) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent(
          `<div class="blog-product-embed" contenteditable="false" data-product-id="${product._id}" data-product-slug="${product.slug}">
            <span class="text-2xl mr-2">📦</span> محصول: <span class="font-bold">${product.name}</span>
          </div>`,
        )
        .run();
      setShowProductPicker(false);
    },
    [editor],
  );

  const handleTablePickerClick = useCallback(() => {
    setShowTablePicker(true);
  }, []);

  const handleTableInsert = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
      .run();
    setShowTablePicker(false);
  }, [editor, tableRows, tableCols]);

  const handleDividerClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const clampTableRows = (value: string | number) =>
    Math.max(2, Math.min(10, Number(value) || 2));

  const clampTableCols = (value: string | number) =>
    Math.max(2, Math.min(10, Number(value) || 2));

  return (
    <div className={`${BG} ${BORDER} ${ROUNDED} ${SHADOW} relative`}>
      <CustomStyles />
      <CustomMenuBar
        editor={editor}
        onImageClick={handleImageClick}
        onTablePickerClick={handleTablePickerClick}
        onProductClick={handleProductClick}
        onDividerClick={handleDividerClick}
      />

      {/* Editor */}
      <div>
        <EditorContent editor={editor} />
      </div>

      {/* Table Picker Modal */}
      {showTablePicker && (
        <>
          <div
            className={BLUR_OVERLAY}
            onClick={() => setShowTablePicker(false)}
          />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[330px] flex flex-col items-center">
              <div className="text-slate-600 mb-4 text-base font-bold">
                افزودن جدول
              </div>
              <div className="flex gap-3 mb-5">
                <label className="flex flex-col items-center gap-1 text-xs">
                  ردیف:
                  <input
                    type="number"
                    min={2}
                    max={10}
                    className="border rounded p-1 w-14 text-center text-base"
                    value={tableRows}
                    onChange={(e) =>
                      setTableRows(clampTableRows(e.target.value))
                    }
                  />
                </label>
                <label className="flex flex-col items-center gap-1 text-xs">
                  ستون:
                  <input
                    type="number"
                    min={2}
                    max={10}
                    className="border rounded p-1 w-14 text-center text-base"
                    value={tableCols}
                    onChange={(e) =>
                      setTableCols(clampTableCols(e.target.value))
                    }
                  />
                </label>
              </div>
              {/* نمایش دمو جدول */}
              <div className="mb-4 w-full flex justify-center">
                <table
                  className="border rounded"
                  style={{
                    borderCollapse: "collapse",
                    maxWidth: "180px",
                    fontSize: "0.95em",
                  }}
                >
                  <tbody>
                    {[...Array(tableRows)].map((_, r) => (
                      <tr key={r}>
                        {[...Array(tableCols)].map((_, c) => (
                          <td
                            key={c}
                            className={
                              "border border-cyan-200 bg-cyan-50 px-2 py-1 text-center" +
                              (r === 0
                                ? " font-bold bg-cyan-200 text-cyan-900"
                                : "")
                            }
                          >
                            {r === 0 ? `سرستون` : `سلول`}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded px-6 py-2 text-base font-bold"
                onClick={handleTableInsert}
              >
                افزودن جدول
              </button>
            </div>
          </div>
        </>
      )}

      {/* Product Picker Modal */}
      {showProductPicker && (
        <>
          <div
            className={BLUR_OVERLAY}
            onClick={() => setShowProductPicker(false)}
          />
          <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4">
            <BlogProductPickerModal
              onClose={() => setShowProductPicker(false)}
              onSelect={handleInsertProduct}
            />
          </div>
        </>
      )}
    </div>
  );
}
