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

const REMOVE_BTN_PATTERN =
  /<button[^>]*class="[^"]*blog-media-remove-btn[^"]*"[^>]*>[\s\S]*?<\/button>/gi;

/** Strip editor-only chrome before persisting or rendering on the storefront. */
export function stripEditorChrome(html: string): string {
  if (typeof html !== "string" || !html.trim()) return "";
  return html
    .replace(REMOVE_BTN_PATTERN, "")
    .replace(/\scontenteditable="false"/gi, "")
    .replace(/\sdata-type="(?:image|video|product|aparat)"/gi, "");
}

export function sanitizeHtml(html: string): string {
  if (typeof html !== "string" || !html.trim()) return "";
  return stripEditorChrome(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

/** Re-attach removable wrappers when loading saved HTML into the editor. */
export function prepareHtmlForEditor(html: string): string {
  if (typeof document === "undefined") return html || "";
  const str = typeof html === "string" ? html : "";
  if (!str.trim()) return "";

  const doc = new DOMParser().parseFromString(str, "text/html");
  const body = doc.body;

  body.querySelectorAll("img").forEach((img) => {
    if (img.closest(".blog-media-wrapper")) return;
    const wrapper = doc.createElement("span");
    wrapper.className = "blog-media-wrapper group";
    wrapper.setAttribute("contenteditable", "false");
    wrapper.setAttribute("data-type", "image");
    wrapper.style.cssText =
      "display:block;position:relative;margin:14px 0;";
    img.parentNode?.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.insertAdjacentHTML(
      "beforeend",
      mediaRemoveButtonMarkup("image"),
    );
  });

  body.querySelectorAll("video").forEach((video) => {
    if (video.closest(".blog-media-wrapper")) return;
    const wrapper = doc.createElement("span");
    wrapper.className = "blog-media-wrapper group";
    wrapper.setAttribute("contenteditable", "false");
    wrapper.setAttribute("data-type", "video");
    wrapper.style.cssText =
      "display:block;position:relative;margin:14px 0;";
    video.parentNode?.insertBefore(wrapper, video);
    wrapper.appendChild(video);
    wrapper.insertAdjacentHTML(
      "beforeend",
      mediaRemoveButtonMarkup("video"),
    );
  });

  body
    .querySelectorAll(".blog-aparat-embed")
    .forEach((embed) => {
      if (embed.closest(".blog-media-wrapper")) return;
      const wrapper = doc.createElement("div");
      wrapper.className = "blog-media-wrapper group blog-aparat-wrapper";
      wrapper.setAttribute("contenteditable", "false");
      wrapper.setAttribute("data-type", "aparat");
      wrapper.style.cssText =
        "display:block;position:relative;margin:14px 0;";
      embed.parentNode?.insertBefore(wrapper, embed);
      wrapper.appendChild(embed.cloneNode(true));
      embed.remove();
      wrapper.insertAdjacentHTML(
        "beforeend",
        mediaRemoveButtonMarkup("ویدیو"),
      );
    });

  body
    .querySelectorAll(
      ".blog-product-embed[data-product-id][data-product-slug][data-block-id]",
    )
    .forEach((div) => {
      if (div.closest(".blog-embed-wrapper")) return;
      const wrapper = doc.createElement("div");
      wrapper.className = "blog-embed-wrapper group";
      wrapper.setAttribute("contenteditable", "false");
      wrapper.setAttribute("data-type", "product");
      wrapper.style.cssText = "position:relative;margin:14px 0;";
      div.parentNode?.insertBefore(wrapper, div);
      wrapper.appendChild(div.cloneNode(true));
      div.remove();
      wrapper.insertAdjacentHTML(
        "beforeend",
        mediaRemoveButtonMarkup("محصول"),
      );
    });

  return body.innerHTML;
}

export function saveSelection(
  container: HTMLElement,
): Range | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const range = sel.getRangeAt(0);
  if (!container.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

export function restoreSelection(range: Range | null) {
  if (!range) return;
  const sel = window.getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

export function insertHtmlAtCaret(editor: HTMLElement, html: string) {
  editor.focus();
  const saved = saveSelection(editor);
  if (saved) restoreSelection(saved);

  const sel = window.getSelection();
  if (
    sel &&
    sel.rangeCount > 0 &&
    editor.contains(sel.getRangeAt(0).commonAncestorContainer)
  ) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const template = document.createElement("template");
    template.innerHTML = html;
    const fragment = template.content;
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else {
    editor.insertAdjacentHTML("beforeend", html);
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
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

function mediaRemoveButtonMarkup(label: string): string {
  return `<button type="button" class="blog-media-remove-btn transition-opacity opacity-70 group-hover:opacity-100" aria-label="حذف ${label}"
      style="outline:none;border:none;background:rgba(40,40,40,0.85);color:#fff;position:absolute;top:7px;right:7px;border-radius:50%;width:32px;height:32px;z-index:3;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;">
      <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="5" x2="15" y2="15" />
        <line x1="15" y1="5" x2="5" y2="15" />
      </svg>
    </button>`;
}

export function wrapInsertedMedia(
  html: string,
  type: "image" | "video",
): string {
  const display = type === "image" || type === "video" ? "block" : "inline-block";
  return `<span class="blog-media-wrapper group" contenteditable="false" data-type="${type}" style="display:${display};position:relative;margin:14px 0;">
    ${html}
    ${mediaRemoveButtonMarkup(type === "image" ? "تصویر" : "ویدیو")}
  </span>`;
}

export function wrapProductEmbed(innerHtml: string): string {
  return `<div class="blog-embed-wrapper group" contenteditable="false" data-type="product" style="position:relative;margin:14px 0;">
    ${innerHtml}
    ${mediaRemoveButtonMarkup("محصول")}
  </div>`;
}

export function buildAparatEmbedHtml(videoUrl: string): string {
  const hashMatch = videoUrl.match(/\/v\/([^/?#]+)/);
  const hash = hashMatch?.[1];
  if (!hash) return "";

  const embed = `<div class="blog-aparat-embed" data-aparat-hash="${hash}" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#0f172a;">
    <iframe src="https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame" title="ویدیو آپارات" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;border-radius:12px;"></iframe>
  </div>`;

  return `<div class="blog-media-wrapper group blog-aparat-wrapper" contenteditable="false" data-type="aparat" style="display:block;position:relative;margin:14px 0;">
    ${embed}
    ${mediaRemoveButtonMarkup("ویدیو")}
  </div>`;
}

export function normalizeLinkUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
