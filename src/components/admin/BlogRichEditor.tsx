"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiImage,
  FiPackage,
  FiGrid,
  FiCode,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiMinus,
} from "react-icons/fi";
import BlogProductPickerModal, {
  type ProductOption,
} from "./BlogProductPickerModal";

import { BsListOl, BsQuote } from "react-icons/bs";
import { CiUndo, CiRedo } from "react-icons/ci";
// ============== Types ==============

interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  formatBlock: string;
  unorderedList: boolean;
  orderedList: boolean;
  align: "left" | "center" | "right";
}

interface BlogRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

// ============== Constants ==============

const INITIAL_FORMAT_STATE: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  formatBlock: "p",
  unorderedList: false,
  orderedList: false,
  align: "left",
};

const TABLE_PRESETS: [number, number][] = [
  [2, 2],
  [3, 3],
  [4, 3],
  [4, 4],
  [5, 2],
  [5, 3],
  [5, 4],
];

const TABLE_ROWS_MIN = 2;
const TABLE_ROWS_MAX = 15;
const TABLE_COLS_MIN = 2;
const TABLE_COLS_MAX = 10;

const TOOLBAR_GROUP_CLASS =
  "flex items-center gap-1 rounded-xl bg-white/70 p-1 shadow border border-slate-200/70 shrink-0";

const TOOLBAR_SEPARATOR_CLASS =
  "w-px h-7 bg-slate-300 mx-1 opacity-70 shrink-0 hidden sm:inline";

const BTN_BASE =
  "min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1 active:scale-95 disabled:active:scale-100 disabled:opacity-50 touch-manipulation text-base";

const BTN_ACTIVE =
  "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200/80 font-bold";
const BTN_INACTIVE = "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800";

const POPOVER_MOBILE =
  "fixed left-4 right-4 bottom-4 z-20 max-h-[83vh] overflow-y-auto";
const POPOVER_DESKTOP =
  "sm:absolute sm:left-0 sm:right-auto sm:bottom-auto sm:top-full sm:mt-1.5 sm:max-h-none";

const BLOCK_TYPES = [
  { key: "h2", label: "H2", title: "عنوان ۲" },
  { key: "h3", label: "H3", title: "عنوان ۳" },
  { key: "blockquote", label: <BsQuote />, title: "نقل قول" },
  { key: "pre", label: <FiCode />, title: "کد" },
  { key: "p", label: "متن", title: "پاراگراف معمولی" },
];

const ALIGNMENTS = [
  { key: "left", icon: <FiAlignLeft />, title: "چپ‌چین" },
  { key: "center", icon: <FiAlignCenter />, title: "وسط‌چین" },
  { key: "right", icon: <FiAlignRight />, title: "راست‌چین" },
];

// ============== Pure helpers ==============

function isInEditor(node: Node | null, editor: HTMLElement | null): boolean {
  return !!(editor && node && editor.contains(node));
}

function getListState(editor: HTMLElement | null): {
  unordered: boolean;
  ordered: boolean;
} {
  const sel = document.getSelection();
  const node = sel?.anchorNode;
  if (!node || !editor || !isInEditor(node, editor))
    return { unordered: false, ordered: false };
  const el =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
  if (!el) return { unordered: false, ordered: false };
  const ul = el.closest?.("ul");
  const ol = el.closest?.("ol");
  return {
    unordered: !!ul && editor.contains(ul),
    ordered: !!ol && editor.contains(ol),
  };
}

function getAlign(editor: HTMLElement | null): "left" | "center" | "right" {
  if (!editor) return "left";
  const sel = document.getSelection();
  const node = sel?.anchorNode;
  if (!node || !editor || !isInEditor(node, editor)) return "left";
  const el =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
  if (!el) return "left";
  const blockEl: HTMLElement | null = el.closest("p,h2,h3,pre,blockquote,div");
  if (!blockEl) return "left";
  const align =
    blockEl.style.textAlign || window.getComputedStyle(blockEl).textAlign;
  if (align?.includes("center")) return "center";
  if (align?.includes("right")) return "right";
  return "left";
}

function getFormatState(
  editorRef: React.RefObject<HTMLDivElement | null>,
): FormatState {
  if (typeof document === "undefined") return INITIAL_FORMAT_STATE;
  const editor = editorRef.current;
  let formatBlock = (document.queryCommandValue("formatBlock") || "p")
    .toLowerCase()
    .replace(/<|>/g, "");
  if (!["h2", "h3", "blockquote", "pre"].includes(formatBlock))
    formatBlock = "p";
  const listState = getListState(editor);
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    formatBlock,
    unorderedList: listState.unordered,
    orderedList: listState.ordered,
    align: getAlign(editor),
  };
}

function sanitizeHtml(html: string): string {
  if (typeof html !== "string" || !html.trim()) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

export function extractEmbeddedProductsFromHtml(
  html: string,
): { productId: string; slug: string; blockId: string }[] {
  if (typeof document === "undefined") return [];
  const str = typeof html === "string" ? html : "";
  if (!str.trim()) return [];
  const doc = new DOMParser().parseFromString(str, "text/html");
  const divs = doc.querySelectorAll(
    ".blog-product-embed[data-product-id][data-product-slug][data-block-id]",
  );
  const out: { productId: string; slug: string; blockId: string }[] = [];
  divs.forEach((div) => {
    const productId = div.getAttribute("data-product-id");
    const slug = div.getAttribute("data-product-slug");
    const blockId = div.getAttribute("data-block-id");
    if (productId && slug && blockId) out.push({ productId, slug, blockId });
  });
  return out;
}

// ============== Hook: close popover on click outside ==============

function useCloseOnClickOutside(
  isOpen: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, ref, onClose]);
}

// ============== Main component ==============

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

  const updateFormatState = useCallback(() => {
    const el = editorRef.current;
    if (!el || !document.activeElement || !el.contains(document.activeElement))
      return;
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
      if (el.contains(document.getSelection()?.anchorNode ?? null))
        updateFormatState();
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
    if (!el || value === el.innerHTML) return;
    el.innerHTML = value || "";
  }, [value]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    onChange(sanitizeHtml(el.innerHTML));
  }, [onChange]);

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

  const exec = useCallback(
    (cmd: string, value?: string) => {
      document.execCommand(cmd, false, value ?? undefined);
      editorRef.current?.focus();
      updateFormatState();
      emitChange();
    },
    [updateFormatState, emitChange],
  );

  // Additional actions
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
      '<hr style="margin: 20px 0; border: none; border-top: 1px solid #d1d5db;">',
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
        if (data?.url) exec("insertImage", data.url);
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  }, [exec]);

  const insertProduct = useCallback(
    (product: ProductOption) => {
      const blockId = `product-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const div = document.createElement("div");
      div.className = "blog-product-embed";
      div.setAttribute("data-product-id", product._id);
      div.setAttribute("data-product-slug", product.slug);
      div.setAttribute("data-block-id", blockId);
      div.setAttribute("contenteditable", "false");
      div.style.cssText =
        "padding:12px;margin:12px 0;background:#e0f2fe;border-radius:12px;border:1px solid #7dd3fc;";
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
      const tableHtml = `<table class="blog-post-table prose-table"><thead>${theadRow}</thead><tbody>${tbodyRows}</tbody></table>`;
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

  const btn = (active: boolean) =>
    `${BTN_BASE} ${active ? BTN_ACTIVE : BTN_INACTIVE}`;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow">
      <div
        className="flex flex-wrap items-center gap-1.5 p-2 sm:p-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/70 overflow-x-auto sticky top-0 z-10"
        role="toolbar"
        aria-label="ابزار ویرایش متن"
      >
        {/* Undo/Redo Group */}
        <div className={TOOLBAR_GROUP_CLASS}>
          <ToolbarButton onClick={undo} active={false} title="بازگشت" btn={btn}>
            <CiUndo size={18} />
          </ToolbarButton>
          <ToolbarButton onClick={redo} active={false} title="دوباره" btn={btn}>
            <CiRedo size={18} />
          </ToolbarButton>
        </div>

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />
        {/* Formatting */}
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

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

        {/* Block Formats */}
        <BlockFormatGroup formatState={formatState} exec={exec} btn={btn} />

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

        {/* Alignment */}
        <AlignGroup formatState={formatState} exec={exec} btn={btn} />

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

        {/* List */}
        <ListGroup formatState={formatState} exec={exec} btn={btn} />

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

        {/* More: Table, product, divider, image */}
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

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

        <InsertGroup
          uploadingImage={uploadingImage}
          insertImage={insertImage}
          setShowProductPicker={setShowProductPicker}
          insertDivider={insertDivider}
          btn={btn}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable={!disabled}
        data-placeholder={placeholder}
        className="blog-rich-editor-empty p-4 sm:p-6 outline-none prose prose-slate max-w-none min-w-0 min-h-[180px] focus:ring-2 focus:ring-cyan-500/30 focus:ring-inset rounded-b-2xl transition-shadow bg-white text-[1.05em]"
        style={{ minHeight }}
        onBlur={emitChange}
        suppressContentEditableWarning
        spellCheck
        dir="auto"
        tabIndex={0}
        aria-label={placeholder}
      />

      {showProductPicker && (
        <BlogProductPickerModal
          onClose={() => setShowProductPicker(false)}
          onSelect={insertProduct}
        />
      )}
    </div>
  );
}

// ============== Toolbar subcomponents ==============

function TextFormatGroup({
  formatState,
  showLinkPopover,
  setShowLinkPopover,
  linkUrl,
  setLinkUrl,
  linkPopoverRef,
  exec,
  onApplyLink,
  btn,
}: {
  formatState: FormatState;
  showLinkPopover: boolean;
  setShowLinkPopover: (v: boolean | ((prev: boolean) => boolean)) => void;
  linkUrl: string;
  setLinkUrl: (v: string) => void;
  linkPopoverRef: React.RefObject<HTMLDivElement | null>;
  exec: (cmd: string, value?: string) => void;
  onApplyLink: () => void;
  btn: (active: boolean) => string;
}) {
  return (
    <div className={TOOLBAR_GROUP_CLASS}>
      <ToolbarButton
        onClick={() => exec("bold")}
        active={formatState.bold}
        title="پررنگ"
        ariaPressed={formatState.bold}
        btn={btn}
      >
        <FiBold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec("italic")}
        active={formatState.italic}
        title="ایتالیک"
        ariaPressed={formatState.italic}
        btn={btn}
      >
        <FiItalic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec("underline")}
        active={formatState.underline}
        title="زیرخط"
        ariaPressed={formatState.underline}
        btn={btn}
      >
        <FiUnderline size={18} />
      </ToolbarButton>
      <div className="relative inline-block" ref={linkPopoverRef}>
        <ToolbarButton
          onClick={() => setShowLinkPopover((v) => !v)}
          active={showLinkPopover}
          title="لینک"
          ariaExpanded={showLinkPopover}
          btn={btn}
        >
          <FiLink size={18} />
        </ToolbarButton>
        {showLinkPopover && (
          <LinkPopover
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            setShowLinkPopover={setShowLinkPopover}
            onApplyLink={onApplyLink}
          />
        )}
      </div>
    </div>
  );
}

function LinkPopover({
  linkUrl,
  setLinkUrl,
  setShowLinkPopover,
  onApplyLink,
}: {
  linkUrl: string;
  setLinkUrl: (v: string) => void;
  setShowLinkPopover: (v: boolean) => void;
  onApplyLink: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onApplyLink();
    }
    if (e.key === "Escape") setShowLinkPopover(false);
  };

  return (
    <div
      className={`${POPOVER_MOBILE} p-4 bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col gap-3 max-h-[50vh] overflow-y-auto sm:absolute sm:left-0 sm:right-auto sm:bottom-auto sm:top-full sm:mt-1.5 sm:max-h-none sm:min-w-[250px] sm:p-3`}
      role="dialog"
      aria-label="آدرس لینک"
    >
      <p className="text-sm font-semibold text-slate-700">درج لینک</p>
      <input
        type="url"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://..."
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none text-base sm:text-sm"
        autoFocus
        dir="ltr"
        spellCheck
      />
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={() => setShowLinkPopover(false)}
          className="flex-1 min-h-[40px] py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 touch-manipulation"
        >
          انصراف
        </button>
        <button
          type="button"
          onClick={onApplyLink}
          className="flex-1 min-h-[40px] py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 touch-manipulation"
        >
          درج لینک
        </button>
      </div>
    </div>
  );
}

function BlockFormatGroup({
  formatState,
  exec,
  btn,
}: {
  formatState: FormatState;
  exec: (cmd: string, value?: string) => void;
  btn: (active: boolean) => string;
}) {
  return (
    <div className={TOOLBAR_GROUP_CLASS}>
      {BLOCK_TYPES.map((type) => (
        <ToolbarButton
          key={type.key}
          onClick={() => exec("formatBlock", type.key)}
          active={formatState.formatBlock === type.key}
          title={typeof type.label === "string" ? type.title : ""}
          ariaPressed={formatState.formatBlock === type.key}
          btn={btn}
          className="px-2 py-1.5 rounded-lg text-sm font-bold"
        >
          {type.label}
        </ToolbarButton>
      ))}
    </div>
  );
}

function AlignGroup({
  formatState,
  exec,
  btn,
}: {
  formatState: FormatState;
  exec: (cmd: string, value?: string) => void;
  btn: (active: boolean) => string;
}) {
  // textAlign only applies to blocks
  return (
    <div className={TOOLBAR_GROUP_CLASS}>
      {ALIGNMENTS.map((a) => (
        <ToolbarButton
          key={a.key}
          onClick={() =>
            exec("justify" + a.key.charAt(0).toUpperCase() + a.key.slice(1))
          }
          active={formatState.align === a.key}
          title={a.title}
          ariaPressed={formatState.align === a.key}
          btn={btn}
        >
          {a.icon}
        </ToolbarButton>
      ))}
    </div>
  );
}

function ListGroup({
  formatState,
  exec,
  btn,
}: {
  formatState: FormatState;
  exec: (cmd: string, value?: string) => void;
  btn: (active: boolean) => string;
}) {
  return (
    <div className={TOOLBAR_GROUP_CLASS}>
      <ToolbarButton
        onClick={() => exec("insertUnorderedList")}
        active={formatState.unorderedList}
        title="لیست نقطه‌ای"
        ariaPressed={formatState.unorderedList}
        btn={btn}
      >
        <FiList size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec("insertOrderedList")}
        active={formatState.orderedList}
        title="لیست شماره‌دار"
        ariaPressed={formatState.orderedList}
        btn={btn}
      >
        <BsListOl size={18} />
      </ToolbarButton>
    </div>
  );
}

function TableGroup({
  tablePickerRef,
  showTablePicker,
  setShowTablePicker,
  tableRows,
  tableCols,
  setTableRows,
  setTableCols,
  insertTable,
  clampTableRows,
  clampTableCols,
  btn,
}: {
  tablePickerRef: React.RefObject<HTMLDivElement | null>;
  showTablePicker: boolean;
  setShowTablePicker: (v: boolean | ((prev: boolean) => boolean)) => void;
  tableRows: number;
  tableCols: number;
  setTableRows: (v: number) => void;
  setTableCols: (v: number) => void;
  insertTable: (r: number, c: number) => void;
  clampTableRows: (n: number) => number;
  clampTableCols: (n: number) => number;
  btn: (active: boolean) => string;
}) {
  return (
    <div className="relative inline-block shrink-0" ref={tablePickerRef}>
      <ToolbarButton
        onClick={() => setShowTablePicker((v) => !v)}
        active={showTablePicker}
        title="جدول"
        ariaExpanded={showTablePicker}
        btn={btn}
      >
        <FiGrid size={19} aria-hidden />
      </ToolbarButton>
      {showTablePicker && (
        <div
          className={`${POPOVER_MOBILE} p-4 bg-white border border-slate-200 rounded-xl shadow-xl ${POPOVER_DESKTOP} sm:w-[295px] sm:p-4`}
          role="dialog"
          aria-label="درج جدول"
        >
          <p className="text-sm font-semibold text-slate-700 mb-2">
            درج جدول در محتوا
          </p>
          <p className="text-xs text-slate-500 mb-3">
            یک اندازه سریع یا اندازه دلخواه وارد کنید.
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {TABLE_PRESETS.map(([r, c]) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => insertTable(r, c)}
                className="min-h-[36px] py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-100 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 touch-manipulation"
              >
                {r}×{c}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mb-3">
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-slate-600">ردیف</span>
              <input
                type="number"
                min={TABLE_ROWS_MIN}
                max={TABLE_ROWS_MAX}
                value={tableRows}
                onChange={(e) =>
                  setTableRows(clampTableRows(Number(e.target.value)))
                }
                className="w-full px-2 py-2.5 rounded-lg border border-slate-200 text-center text-base sm:text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </label>
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-slate-600">ستون</span>
              <input
                type="number"
                min={TABLE_COLS_MIN}
                max={TABLE_COLS_MAX}
                value={tableCols}
                onChange={(e) =>
                  setTableCols(clampTableCols(Number(e.target.value)))
                }
                className="w-full px-2 py-2.5 rounded-lg border border-slate-200 text-center text-base sm:text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => insertTable(tableRows, tableCols)}
            className="w-full min-h-[40px] py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors touch-manipulation"
          >
            درج جدول {tableRows}×{tableCols}
          </button>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            جدول زیر کرسر درج می‌شود و قابل ویرایش است.
          </p>
        </div>
      )}
    </div>
  );
}

function InsertGroup({
  uploadingImage,
  insertImage,
  setShowProductPicker,
  insertDivider,
  btn,
}: {
  uploadingImage: boolean;
  insertImage: () => void;
  setShowProductPicker: (v: boolean) => void;
  insertDivider: () => void;
  btn: (active: boolean) => string;
}) {
  return (
    <div className={TOOLBAR_GROUP_CLASS}>
      <ToolbarButton
        onClick={insertImage}
        active={false}
        title="درج تصویر"
        btn={btn}
      >
        {uploadingImage ? (
          <span className="inline-block w-[18px] h-[18px] border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <FiImage size={18} />
        )}
      </ToolbarButton>
      <ToolbarButton
        onClick={() => setShowProductPicker(true)}
        active={false}
        title="درج محصول"
        btn={btn}
      >
        <FiPackage size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={insertDivider}
        active={false}
        title="افزودن جداکننده"
        btn={btn}
      >
        <FiMinus size={18} />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  title,
  ariaPressed,
  ariaExpanded,
  btn,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  title: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  btn: (active: boolean) => string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${btn(active)} ${className}`}
      title={title}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      tabIndex={0}
    >
      {children}
    </button>
  );
}
