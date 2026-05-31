"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { CiRedo, CiUndo } from "react-icons/ci";

import BlogProductPickerModal, {
  type ProductOption,
} from "../BlogProductPickerModal";

import {
  BG,
  BLUR_OVERLAY,
  BORDER,
  INITIAL_FORMAT_STATE,
  ROUNDED,
  SHADOW,
  TOOLBAR_BTN,
  TOOLBAR_BTN_ACTIVE,
  TOOLBAR_BTN_ICON,
  TOOLBAR_SCROLL,
  TOOLBAR_SEPARATOR,
  TOOLBAR_GROUP,
  TABLE_COLS_MAX,
  TABLE_COLS_MIN,
  TABLE_ROWS_MAX,
  TABLE_ROWS_MIN,
} from "./constants";

import { useCloseOnClickOutside } from "@/hooks/useCloseOnClickOutside";
import type { BlogRichEditorProps, FormatState } from "./types";
import { getFormatState, sanitizeHtml, wrapInsertedMedia } from "./utils";

// groups
import TextFormatGroup from ".//groups/TextFormatGroup";
import BlockFormatGroup from ".//groups/BlockFormatGroup";
import AlignGroup from ".//groups/AlignGroup";
import ListGroup from ".//groups/ListGroup";
import TableGroup from ".//groups/TableGroup";
import InsertGroup from ".//groups/InsertGroup";
import ToolbarButton from ".//ToolbarButton";

export default function BlogRichEditor({
  value,
  onChange,
  placeholder = "متن مطلب را بنویسید...",
  minHeight = "280px",
  disabled = false,
}: BlogRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const tablePickerRef = useRef<HTMLDivElement>(null);
  const linkPopoverRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const [formatState, setFormatState] =
    useState<FormatState>(INITIAL_FORMAT_STATE);

  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  const [linkUrl, setLinkUrl] = useState("");

  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [uploadingImage, setUploadingImage] = useState(false);

  // ============== Change emitter ==============
  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange(sanitizeHtml(el.innerHTML));
  }, [onChange]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    function handleRemoveClick(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return;
      const btn = e.target.closest(".blog-media-remove-btn");
      if (!btn) return;

      const wrapper = btn.closest(".blog-media-wrapper");
      if (wrapper && el.contains(wrapper)) {
        wrapper.remove();
        emitChange();
      }
    }

    el.addEventListener("click", handleRemoveClick);
    return () => el.removeEventListener("click", handleRemoveClick);
  }, [emitChange]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    function handleMouseDown(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return;
      const wrapper = e.target.closest(".blog-media-wrapper");
      if (wrapper && el.contains(wrapper)) {
        e.preventDefault();
        wrapper.classList.add("blog-media-selected");
        setTimeout(() => wrapper.classList.remove("blog-media-selected"), 140);
      }
    }

    el.addEventListener("mousedown", handleMouseDown);
    return () => el.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const updateFormatState = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const active = document.activeElement;
    if (!active || !el.contains(active)) return;

    setFormatState(getFormatState(editorRef));
  }, []);

  useCloseOnClickOutside(showTablePicker, tablePickerRef, () =>
    setShowTablePicker(false),
  );
  useCloseOnClickOutside(showLinkPopover, linkPopoverRef, () =>
    setShowLinkPopover(false),
  );

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const onSelectionChange = () => {
      if (el.contains(document.getSelection()?.anchorNode ?? null)) {
        updateFormatState();
      }
    };

    document.addEventListener("selectionchange", onSelectionChange);
    el.addEventListener("focus", updateFormatState);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      el.removeEventListener("focus", updateFormatState);
    };
  }, [updateFormatState]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (isInitialMount.current) {
      el.innerHTML = value || "";
      isInitialMount.current = false;
    }
  }, []); 

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === el.innerHTML) return;
    el.innerHTML = value || "";
  }, [value]);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    el.addEventListener("input", emitChange);

    const handlePaste = (e: Event) => {
      const ev = e as ClipboardEvent;
      ev.preventDefault();
      const text = ev.clipboardData?.getData("text/plain") ?? "";
      document.execCommand("insertText", false, text);
      emitChange();
    };

    el.addEventListener("paste", handlePaste);

    return () => {
      el.removeEventListener("input", emitChange);
      el.removeEventListener("paste", handlePaste);
    };
  }, [emitChange]);

  // ============== exec wrapper ==============
  const exec = useCallback(
    (cmd: string, v?: string) => {
      document.execCommand(cmd, false, v ?? undefined);
      editorRef.current?.focus();
      updateFormatState();
      emitChange();
    },
    [updateFormatState, emitChange],
  );

  // ============== Actions ==============
  const undo = useCallback(() => {
    document.execCommand("undo");
    updateFormatState();
    emitChange();
  }, [updateFormatState, emitChange]);

  const redo = useCallback(() => {
    document.execCommand("redo");
    updateFormatState();
    emitChange();
  }, [updateFormatState, emitChange]);

  const insertDivider = useCallback(() => {
    document.execCommand(
      "insertHTML",
      false,
      '<hr style="margin: 20px 0; border: none; border-top: 1.5px solid #38bdf8;">',
    );
    updateFormatState();
    emitChange();
  }, [updateFormatState, emitChange]);

  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/admin/upload/blog-image", {
          method: "POST",
          body: form,
        });

        const data = await res.json();
        if (data?.url) {
          const imageTag = `<img src="${data.url}" alt="" style="max-width:100%;height:auto;display:block;border-radius:9px;box-shadow:0 3px 8px #0001;" />`;
          document.execCommand(
            "insertHTML",
            false,
            wrapInsertedMedia(imageTag, "image"),
          );
          emitChange();
          updateFormatState();
        }
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  }, [emitChange, updateFormatState]);

  const insertVideo = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/admin/upload/blog-video", {
          method: "POST",
          body: form,
        });

        const data = await res.json();
        if (data?.url) {
          const videoTag = `<video src="${data.url}" controls style="max-width:100%;height:auto;display:block;border-radius:8px;box-shadow:0 2px 7px #0002;" />`;
          document.execCommand(
            "insertHTML",
            false,
            wrapInsertedMedia(videoTag, "video"),
          );
          emitChange();
          updateFormatState();
        }
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  }, [emitChange, updateFormatState]);
  const insertProduct = useCallback(
    (product: ProductOption) => {
      const blockId = `product-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      const div = document.createElement("div");
      div.className = "blog-product-embed";
      div.setAttribute("data-product-id", product._id);
      div.setAttribute("data-product-slug", product.slug);
      div.setAttribute("data-block-id", blockId);
      div.setAttribute("contenteditable", "false");
      div.style.cssText =
        "padding:18px 16px;margin:15px 0;background:#e0f2fe;border-radius:14px 8px 14px 8px;border:1.5px solid #7dd3fc;font-size:1.08em;font-weight:600;box-shadow:0 2px 12px #06b6d44a;";
      div.textContent = `📦 محصول: ${product.name}`;

      editorRef.current?.focus();
      document.execCommand("insertHTML", false, div.outerHTML);
      emitChange();
    },
    [emitChange],
  );

  const insertTable = useCallback(
    (rows: number, cols: number) => {
      const r = Math.max(TABLE_ROWS_MIN, Math.min(TABLE_ROWS_MAX, rows));
      const c = Math.max(TABLE_COLS_MIN, Math.min(TABLE_COLS_MAX, cols));

      const theadRow = "<tr>" + "<th></th>".repeat(c) + "</tr>";
      const tbodyRows = Array(r - 1)
        .fill(null)
        .map(() => "<tr>" + "<td></td>".repeat(c) + "</tr>")
        .join("");

      const tableHtml = `<table class="blog-post-table prose-table" style="margin-block:22px;width:100%;border-radius:8px;box-shadow:0 0 5px #0297a012;background:#f0fcff;"><thead>${theadRow}</thead><tbody>${tbodyRows}</tbody></table>`;

      editorRef.current?.focus();
      document.execCommand("insertHTML", false, tableHtml);

      setShowTablePicker(false);
      updateFormatState();
      emitChange();
    },
    [updateFormatState, emitChange],
  );

  const applyLink = useCallback(() => {
    const url = linkUrl.trim();
    if (url) exec("createLink", url);
    setLinkUrl("");
    setShowLinkPopover(false);
    editorRef.current?.focus();
  }, [linkUrl, exec]);

  const clampTableRows = (n: number) =>
    Math.max(
      TABLE_ROWS_MIN,
      Math.min(TABLE_ROWS_MAX, Number(n) || TABLE_ROWS_MIN),
    );

  const clampTableCols = (n: number) =>
    Math.max(
      TABLE_COLS_MIN,
      Math.min(TABLE_COLS_MAX, Number(n) || TABLE_COLS_MIN),
    );

  const btn = (active: boolean, extraClasses: string = "") =>
    [TOOLBAR_BTN, active ? TOOLBAR_BTN_ACTIVE : "", extraClasses].join(" ");

  return (
    <div className={`${BG} ${BORDER} ${ROUNDED} ${SHADOW} relative`}>
      {/* Toolbar */}
      <div
        className={`flex flex-nowrap overflow-x-auto scrollbar-none items-center gap-1 sm:gap-2 px-1 sm:px-4 py-1.5 sm:py-2 border-b border-slate-100 sticky top-0 z-10 bg-white/95 backdrop-blur-lg ${TOOLBAR_SCROLL}`}
        style={{ WebkitOverflowScrolling: "touch" }}
        role="toolbar"
        aria-label="ابزار ویرایش متن"
      >
        <div className={TOOLBAR_GROUP}>
          <ToolbarButton
            onClick={undo}
            active={false}
            title="بازگشت"
            btn={btn}
            icon={<CiUndo className={TOOLBAR_BTN_ICON} />}
          />
          <ToolbarButton
            onClick={redo}
            active={false}
            title="دوباره"
            btn={btn}
            icon={<CiRedo className={TOOLBAR_BTN_ICON} />}
          />
        </div>

        <div className={TOOLBAR_SEPARATOR} />

        <TextFormatGroup
          formatState={formatState}
          showLinkPopover={showLinkPopover}
          setShowLinkPopover={setShowLinkPopover}
          linkUrl={linkUrl}
          setLinkUrl={setLinkUrl}
          linkPopoverRef={linkPopoverRef}
          exec={exec}
          onApplyLink={applyLink}
          btn={btn}
        />

        <div className={TOOLBAR_SEPARATOR} />

        <BlockFormatGroup formatState={formatState} exec={exec} btn={btn} />

        <div className={TOOLBAR_SEPARATOR} />

        <AlignGroup formatState={formatState} exec={exec} btn={btn} />

        <div className={TOOLBAR_SEPARATOR} />

        <ListGroup formatState={formatState} exec={exec} btn={btn} />

        <div className={TOOLBAR_SEPARATOR} />

        <TableGroup
          tablePickerRef={tablePickerRef}
          showTablePicker={showTablePicker}
          setShowTablePicker={setShowTablePicker}
          tableRows={tableRows}
          tableCols={tableCols}
          setTableRows={setTableRows}
          setTableCols={setTableCols}
          insertTable={insertTable}
          clampTableRows={clampTableRows}
          clampTableCols={clampTableCols}
          btn={btn}
        />

        <div className={TOOLBAR_SEPARATOR} />

        <InsertGroup
          uploadingImage={uploadingImage}
          insertImage={insertImage}
          insertVideo={insertVideo}
          setShowProductPicker={setShowProductPicker}
          insertDivider={insertDivider}
          btn={btn}
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        data-placeholder={placeholder}
        className={[
          "blog-rich-editor-empty",
          "p-3 sm:p-5 md:p-8",
          "outline-none",
          "prose prose-slate prose-img:rounded-xl prose-img:shadow-xl",
          "max-w-none min-w-0 min-h-[200px]",
          "focus:ring-2 focus:ring-cyan-400/60 focus:ring-inset",
          "rounded-b-2xl transition-shadow bg-white text-[1.02em] sm:text-[1.06em] leading-7",
          "custom-scrollbar",
        ].join(" ")}
        style={{ minHeight }}
        onBlur={emitChange}
        suppressContentEditableWarning
        spellCheck
        dir="auto"
        tabIndex={0}
        aria-label={placeholder}
      />

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
              onSelect={insertProduct}
            />
          </div>
        </>
      )}
    </div>
  );
}
