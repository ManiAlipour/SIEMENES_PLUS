import type React from "react";
import { INITIAL_FORMAT_STATE } from "./constants";
import type { FormatState } from "./types";

export function isInEditor(
  node: Node | null,
  editor: HTMLElement | null,
): boolean {
  return !!(editor && node && editor.contains(node));
}

export function getListState(editor: HTMLElement | null): {
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

export function getAlign(
  editor: HTMLElement | null,
): "left" | "center" | "right" {
  if (!editor) return "left";

  const sel = document.getSelection();
  const node = sel?.anchorNode;
  if (!node || !isInEditor(node, editor)) return "left";

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

export function getFormatState(
  editorRef: React.RefObject<HTMLDivElement | null>,
): FormatState {
  if (typeof document === "undefined") return INITIAL_FORMAT_STATE;

  let formatBlock = (document.queryCommandValue("formatBlock") || "p")
    .toLowerCase()
    .replace(/<|>/g, "");

  if (!["h2", "h3", "blockquote", "pre"].includes(formatBlock)) {
    formatBlock = "p";
  }

  const listState = getListState(editorRef.current);

  return {
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    formatBlock,
    unorderedList: listState.unordered,
    orderedList: listState.ordered,
    align: getAlign(editorRef.current),
  };
}

export function sanitizeHtml(html: string): string {
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

    if (productId && slug && blockId) {
      out.push({ productId, slug, blockId });
    }
  });

  return out;
}

export function isMediaWrapper(el: HTMLElement | null) {
  return el?.classList?.contains("blog-media-wrapper");
}

export function wrapInsertedMedia(
  html: string,
  type: "image" | "video",
): string {
  return `<span class="blog-media-wrapper group" contenteditable="false" data-type="${type}" style="display:inline-block;vertical-align:middle;position:relative;margin:14px 0;">
    ${html}
    <button type="button" class="blog-media-remove-btn transition-opacity opacity-70 group-hover:opacity-100 group-focus:opacity-100" aria-label="حذف ${type === "image" ? "تصویر" : "ویدیو"}"
      style="outline:none;border:none;background:rgba(40,40,40,0.85);color:#fff;position:absolute;top:7px;right:7px;border-radius:50%;width:32px;height:32px;z-index:3;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;box-shadow:0 2px 8px #0001;">
      <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="5" x2="15" y2="15" />
        <line x1="15" y1="5" x2="5" y2="15" />
      </svg>
    </button>
  </span>`;
}


