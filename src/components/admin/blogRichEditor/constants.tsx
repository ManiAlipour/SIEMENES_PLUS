import { BsListOl, BsQuote } from "react-icons/bs";
import {
  FiAlignCenter,
  FiAlignLeft,
  FiAlignRight,
  FiCode,
} from "react-icons/fi";
import type { FormatState } from "./types";

export const BG = "bg-gradient-to-b from-white via-slate-50 to-slate-100";
export const BORDER = "border border-slate-200";
export const ROUNDED = "rounded-2xl";
export const SHADOW = "shadow-lg";

export const TOOLBAR_SCROLL =
  "overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-200 hover:scrollbar-thumb-cyan-300 scrollbar-track-slate-100";

export const TOOLBAR_BTN =
  "flex items-center gap-2 h-9 sm:h-11 px-2 sm:px-2.5 py-1 text-base sm:text-lg font-medium text-slate-500 bg-white border border-slate-200 rounded-xl shadow hover:bg-cyan-50 transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 aria-pressed:bg-cyan-100 aria-pressed:text-cyan-800 aria-pressed:font-bold aria-pressed:ring-2 aria-pressed:ring-cyan-200 active:scale-[0.98]";

export const TOOLBAR_BTN_ACTIVE =
  "!bg-cyan-100 !text-cyan-700 !ring-2 !ring-cyan-200 font-bold";

export const TOOLBAR_BTN_DISABLED = "opacity-40 pointer-events-none";
export const TOOLBAR_BTN_ICON = "text-xl sm:text-2xl";

export const TOOLBAR_GROUP =
  "flex items-center gap-0.5 py-1 px-1 sm:px-2 !bg-white/95 rounded-xl border border-slate-200 shadow-sm";

export const TOOLBAR_SEPARATOR =
  "h-6 sm:h-7 w-0.5 mx-1.5 sm:mx-2 bg-gradient-to-b from-slate-200 to-slate-300 rounded-full opacity-70";

export const POPUP =
  "absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 min-w-[195px] sm:min-w-[250px] max-w-xs sm:max-w-xs shadow-xl bg-white border border-slate-200 rounded-2xl p-4";

export const BLUR_OVERLAY =
  "fixed inset-0 z-20 bg-black/20 backdrop-blur-[1.5px] transition-opacity";

export const INITIAL_FORMAT_STATE: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  formatBlock: "p",
  unorderedList: false,
  orderedList: false,
  align: "left",
};

export const TABLE_PRESETS: [number, number][] = [
  [2, 2],
  [3, 3],
  [4, 3],
  [4, 4],
  [5, 2],
  [5, 3],
  [5, 4],
];

export const TABLE_ROWS_MIN = 2;
export const TABLE_ROWS_MAX = 15;
export const TABLE_COLS_MIN = 2;
export const TABLE_COLS_MAX = 10;

export const BLOCK_TYPES = [
  { key: "h2", label: "H2", title: "عنوان ۲" },
  { key: "h3", label: "H3", title: "عنوان ۳" },
  { key: "blockquote", label: <BsQuote />, title: "نقل قول" },
  { key: "pre", label: <FiCode />, title: "کد" },
  { key: "p", label: "متن", title: "پاراگراف معمولی" },
];

export const ALIGNMENTS = [
  { key: "left", icon: <FiAlignLeft />, title: "چپ‌چین" },
  { key: "center", icon: <FiAlignCenter />, title: "وسط‌چین" },
  { key: "right", icon: <FiAlignRight />, title: "راست‌چین" },
];
