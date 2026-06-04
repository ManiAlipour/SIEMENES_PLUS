import type React from "react";
import { FiImage, FiLink, FiMinus, FiPackage, FiPlayCircle } from "react-icons/fi";
import { POPUP, TOOLBAR_BTN_ICON, TOOLBAR_GROUP } from "../constants";
import type { BtnFn, SetStateBool } from "../types";
import ToolbarButton from "../ToolbarButton";

export default function InsertGroup({
  uploadingImage,
  insertImage,
  insertVideo,
  showAparatPopover,
  setShowAparatPopover,
  aparatUrl,
  setAparatUrl,
  aparatPopoverRef,
  onInsertAparat,
  setShowProductPicker,
  insertDivider,
  btn,
}: {
  uploadingImage: boolean;
  insertImage: () => void;
  insertVideo: () => void;
  showAparatPopover: boolean;
  setShowAparatPopover: SetStateBool;
  aparatUrl: string;
  setAparatUrl: (v: string) => void;
  aparatPopoverRef: React.RefObject<HTMLDivElement | null>;
  onInsertAparat: () => void;
  setShowProductPicker: (v: boolean) => void;
  insertDivider: () => void;
  btn: BtnFn;
}) {
  return (
    <div className={TOOLBAR_GROUP}>
      <ToolbarButton
        onClick={insertImage}
        active={false}
        title="درج تصویر"
        btn={btn}
        icon={
          uploadingImage ? (
            <span className="inline-block w-[20px] h-[20px] border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiImage className={TOOLBAR_BTN_ICON} />
          )
        }
      />
      <ToolbarButton
        onClick={insertVideo}
        active={false}
        title="درج فایل ویدیو"
        btn={btn}
        icon={<FiPlayCircle className={TOOLBAR_BTN_ICON} />}
      />
      <div className="relative" ref={aparatPopoverRef}>
        <ToolbarButton
          onClick={() => setShowAparatPopover((v) => !v)}
          active={showAparatPopover}
          title="درج ویدیو آپارات"
          btn={btn}
          icon={<FiLink className={TOOLBAR_BTN_ICON} />}
        />
        {showAparatPopover && (
          <div
            className={`${POPUP} flex flex-col gap-3 min-w-[260px]`}
            role="dialog"
            aria-label="لینک آپارات"
          >
            <span className="block text-sm font-semibold text-slate-800">
              لینک ویدیو آپارات
            </span>
            <input
              type="url"
              value={aparatUrl}
              onChange={(e) => setAparatUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onInsertAparat();
                }
                if (e.key === "Escape") setShowAparatPopover(false);
              }}
              placeholder="https://www.aparat.com/v/..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none text-sm font-mono"
              autoFocus
              dir="ltr"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAparatPopover(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={onInsertAparat}
                className="flex-1 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700"
              >
                درج
              </button>
            </div>
          </div>
        )}
      </div>
      <ToolbarButton
        onClick={() => setShowProductPicker(true)}
        active={false}
        title="درج محصول"
        btn={btn}
        icon={<FiPackage className={TOOLBAR_BTN_ICON} />}
      />
      <ToolbarButton
        onClick={insertDivider}
        active={false}
        title="افزودن جداکننده"
        btn={btn}
        icon={<FiMinus className={TOOLBAR_BTN_ICON} />}
      />
    </div>
  );
}
