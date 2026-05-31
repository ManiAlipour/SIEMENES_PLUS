import type React from "react";
import type { ProductOption } from "../BlogProductPickerModal";

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  formatBlock: string;
  unorderedList: boolean;
  orderedList: boolean;
  align: "left" | "center" | "right";
}

export interface BlogRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

// برای propهای گروپ‌ها (اختیاری، ولی تمیزتر)
export type BtnFn = (active: boolean, extraClasses?: string) => string;

export type ExecFn = (cmd: string, value?: string) => void;

export type SetStateBool = React.Dispatch<React.SetStateAction<boolean>>;

export type InsertProductFn = (product: ProductOption) => void;
