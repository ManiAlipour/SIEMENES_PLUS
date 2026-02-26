"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { FiBold, FiItalic, FiLink, FiImage, FiPackage, FiGrid } from "react-icons/fi";
import BlogProductPickerModal, {
  type ProductOption,
} from "./BlogProductPickerModal";

// ============== Types ==============

interface FormatState {
  bold: boolean;
  italic: boolean;
  formatBlock: string;
  unorderedList: boolean;
  orderedList: boolean;
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
  formatBlock: "p",
  unorderedList: false,
  orderedList: false,
};

const TABLE_PRESETS: [number, number][] = [
  [2, 2],
  [3, 3],
  [4, 3],
  [4, 4],
];

const TABLE_ROWS_MIN = 2;
const TABLE_ROWS_MAX = 15;
const TABLE_COLS_MIN = 2;
const TABLE_COLS_MAX = 10;

const TOOLBAR_GROUP_CLASS =
  "flex items-center gap-0.5 rounded-xl bg-white/80 p-1 shadow-sm border border-slate-200/60 shrink-0";

const TOOLBAR_SEPARATOR_CLASS =
  "w-px h-8 bg-slate-300 mx-0.5 sm:mx-1 opacity-60 shrink-0 hidden sm:inline";

const BTN_BASE =
  "min-h-[44px] min-w-[44px] sm:min-w-0 flex items-center justify-center p-2 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1 active:scale-95 disabled:active:scale-100 touch-manipulation";

const BTN_ACTIVE = "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200/80";
const BTN_INACTIVE = "text-slate-600 hover:bg-slate-200/80 hover:text-slate-800";

const POPOVER_MOBILE =
  "fixed left-4 right-4 bottom-4 z-20 max-h-[85vh] overflow-y-auto";
const POPOVER_DESKTOP = "sm:absolute sm:left-0 sm:right-auto sm:bottom-auto sm:top-full sm:mt-1.5 sm:max-h-none";

// ============== Pure helpers ==============

function isInEditor(node: Node | null, editor: HTMLElement | null): boolean {
  return !!(editor && node && editor.contains(node));
}

function getListState(
  editor: HTMLElement | null
): { unordered: boolean; ordered: boolean } {
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

function getFormatState(
  editorRef: React.RefObject<HTMLDivElement | null>
): FormatState {
  if (typeof document === "undefined") return INITIAL_FORMAT_STATE;
  const editor = editorRef.current;
  let formatBlock = (document.queryCommandValue("formatBlock") || "p")
    .toLowerCase()
    .replace(/<|>/g, "");
  if (formatBlock !== "h2" && formatBlock !== "h3") formatBlock = "p";
  const listState = getListState(editor);
  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    formatBlock,
    unorderedList: listState.unordered,
    orderedList: listState.ordered,
  };
}

function sanitizeHtml(html: string): string {
  if (typeof html !== "string" || !html.trim()) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

export function extractEmbeddedProductsFromHtml(
  html: string
): { productId: string; slug: string; blockId: string }[] {
  if (typeof document === "undefined") return [];
  const str = typeof html === "string" ? html : "";
  if (!str.trim()) return [];
  const doc = new DOMParser().parseFromString(str, "text/html");
  const divs = doc.querySelectorAll(
    ".blog-product-embed[data-product-id][data-product-slug][data-block-id]"
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
  onClose: () => void
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

  const [formatState, setFormatState] = useState<FormatState>(INITIAL_FORMAT_STATE);
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
    setShowTablePicker(false)
  );
  useCloseOnClickOutside(showLinkPopover, linkPopoverRef, () =>
    setShowLinkPopover(false)
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
    [updateFormatState, emitChange]
  );

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
    [emitChange]
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
      const tableHtml = `<table class="blog-post-table"><thead>${theadRow}</thead><tbody>${tbodyRows}</tbody></table>`;
      editorRef.current?.focus();
      document.execCommand("insertHTML", false, tableHtml);
      setShowTablePicker(false);
      updateFormatState();
      emitChange();
    },
    [updateFormatState, emitChange]
  );

  const applyLink = useCallback(() => {
    const url = linkUrl.trim();
    if (url) exec("createLink", url);
    setLinkUrl("");
    setShowLinkPopover(false);
    editorRef.current?.focus();
  }, [linkUrl, exec]);

  const clampTableRows = (n: number) =>
    Math.max(TABLE_ROWS_MIN, Math.min(TABLE_ROWS_MAX, Number(n) || TABLE_ROWS_MIN));
  const clampTableCols = (n: number) =>
    Math.max(TABLE_COLS_MIN, Math.min(TABLE_COLS_MAX, Number(n) || TABLE_COLS_MIN));

  const btn = (active: boolean) =>
    `${BTN_BASE} ${active ? BTN_ACTIVE : BTN_INACTIVE}`;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div
        className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-2 sm:p-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 overflow-x-auto"
        role="toolbar"
        aria-label="ابزار ویرایش متن"
      >
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

        <BlockFormatGroup formatState={formatState} exec={exec} btn={btn} />

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

        <ListGroup formatState={formatState} exec={exec} btn={btn} />

        <span className={TOOLBAR_SEPARATOR_CLASS} aria-hidden />

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
          btn={btn}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable={!disabled}
        data-placeholder={placeholder}
        className="blog-rich-editor-empty p-4 sm:p-6 outline-none prose prose-slate max-w-none min-w-0 focus:ring-2 focus:ring-cyan-500/30 focus:ring-inset rounded-b-2xl transition-shadow"
        style={{ minHeight }}
        onBlur={emitChange}
        suppressContentEditableWarning
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
      className={`${POPOVER_MOBILE} p-4 bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col gap-3 max-h-[50vh] overflow-y-auto sm:absolute sm:left-0 sm:right-auto sm:bottom-auto sm:top-full sm:mt-1.5 sm:max-h-none sm:min-w-[240px] sm:p-3`}
      role="dialog"
      aria-label="آدرس لینک"
    >
      <p className="text-sm font-semibold text-slate-700 sm:hidden">درج لینک</p>
      <input
        type="url"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://..."
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none text-base sm:text-sm"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowLinkPopover(false)}
          className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 touch-manipulation"
        >
          انصراف
        </button>
        <button
          type="button"
          onClick={onApplyLink}
          className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 touch-manipulation"
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
      <ToolbarButton
        onClick={() => exec("formatBlock", formatState.formatBlock === "h2" ? "p" : "h2")}
        active={formatState.formatBlock === "h2"}
        title="عنوان سطح ۲"
        ariaPressed={formatState.formatBlock === "h2"}
        btn={btn}
        className="px-2.5 sm:px-2.5 py-1.5 rounded-lg text-sm font-bold"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec("formatBlock", formatState.formatBlock === "h3" ? "p" : "h3")}
        active={formatState.formatBlock === "h3"}
        title="عنوان سطح ۳"
        ariaPressed={formatState.formatBlock === "h3"}
        btn={btn}
        className="px-2.5 sm:px-2.5 py-1.5 rounded-lg text-sm font-bold"
      >
        H3
      </ToolbarButton>
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
      <span
        className="px-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-wide hidden md:inline"
        aria-hidden
      >
        لیست
      </span>
      <ToolbarButton
        onClick={() => exec("insertUnorderedList")}
        active={formatState.unorderedList}
        title="لیست نقطه‌ای"
        ariaPressed={formatState.unorderedList}
        btn={btn}
        className="gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-sm"
      >
        <span className="text-base leading-none" aria-hidden>•</span>
        <span className="hidden sm:inline">نقطه‌ای</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => exec("insertOrderedList")}
        active={formatState.orderedList}
        title="لیست شماره‌دار"
        ariaPressed={formatState.orderedList}
        btn={btn}
        className="gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-sm"
      >
        <span className="text-xs font-bold font-mono" aria-hidden>۱</span>
        <span className="hidden sm:inline">شماره‌دار</span>
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
        title="درج جدول"
        ariaExpanded={showTablePicker}
        btn={btn}
        className="gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-sm"
      >
        <FiGrid size={18} aria-hidden />
        <span className="hidden sm:inline">جدول</span>
      </ToolbarButton>
      {showTablePicker && (
        <div
          className={`${POPOVER_MOBILE} p-4 bg-white border border-slate-200 rounded-xl shadow-xl ${POPOVER_DESKTOP} sm:w-[280px] sm:p-4`}
          role="dialog"
          aria-label="درج جدول"
        >
          <p className="text-sm font-semibold text-slate-700 mb-2">درج جدول</p>
          <p className="text-xs text-slate-500 mb-3">
            سریع: یک اندازه انتخاب کنید یا زیر آن عدد دلخواه بزنید.
          </p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {TABLE_PRESETS.map(([r, c]) => (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => insertTable(r, c)}
                className="min-h-[44px] py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 touch-manipulation"
              >
                {r}×{c}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-2">اندازه دلخواه</p>
          <div className="flex gap-3 mb-3">
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-slate-600">ردیف</span>
              <input
                type="number"
                min={TABLE_ROWS_MIN}
                max={TABLE_ROWS_MAX}
                value={tableRows}
                onChange={(e) => setTableRows(clampTableRows(Number(e.target.value)))}
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
                onChange={(e) => setTableCols(clampTableCols(Number(e.target.value)))}
                className="w-full px-2 py-2.5 rounded-lg border border-slate-200 text-center text-base sm:text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => insertTable(tableRows, tableCols)}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1 transition-colors touch-manipulation"
          >
            درج جدول {tableRows}×{tableCols}
          </button>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            جدول زیر کرسر درج می‌شود. در هر سلول می‌توانید تایپ کنید.
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
  btn,
}: {
  uploadingImage: boolean;
  insertImage: () => void;
  setShowProductPicker: (v: boolean) => void;
  btn: (active: boolean) => string;
}) {
  return (
    <div className={TOOLBAR_GROUP_CLASS}>
      <button
        type="button"
        onClick={insertImage}
        disabled={uploadingImage}
        className={`${BTN_BASE} ${BTN_INACTIVE} disabled:opacity-50 disabled:cursor-not-allowed`}
        title="درج تصویر"
      >
        {uploadingImage ? (
          <span className="inline-block w-[18px] h-[18px] border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <FiImage size={18} />
        )}
      </button>
      <button
        type="button"
        onClick={() => setShowProductPicker(true)}
        className={`${BTN_BASE} text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-1`}
        title="درج محصول"
      >
        <FiPackage size={18} />
      </button>
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
    >
      {children}
    </button>
  );
}
