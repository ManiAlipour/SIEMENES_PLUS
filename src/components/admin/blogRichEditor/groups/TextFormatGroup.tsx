import React from "react";
import { FiBold, FiItalic, FiLink, FiUnderline } from "react-icons/fi";
import { TOOLBAR_BTN_ICON, TOOLBAR_GROUP } from "../constants";
import type { BtnFn, ExecFn, FormatState, SetStateBool } from "../types";
import LinkPopover from "../LinkPopover";
import ToolbarButton from "../ToolbarButton";

export default function TextFormatGroup({
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
  setShowLinkPopover: SetStateBool;
  linkUrl: string;
  setLinkUrl: (v: string) => void;
  linkPopoverRef: React.RefObject<HTMLDivElement | null>;
  exec: ExecFn;
  onApplyLink: () => void;
  btn: BtnFn;
}) {
  return (
    <div className={TOOLBAR_GROUP}>
      <ToolbarButton
        onClick={() => exec("bold")}
        active={formatState.bold}
        title="پررنگ"
        btn={btn}
        icon={<FiBold className={TOOLBAR_BTN_ICON} />}
      />
      <ToolbarButton
        onClick={() => exec("italic")}
        active={formatState.italic}
        title="ایتالیک"
        btn={btn}
        icon={<FiItalic className={TOOLBAR_BTN_ICON} />}
      />
      <ToolbarButton
        onClick={() => exec("underline")}
        active={formatState.underline}
        title="زیرخط"
        btn={btn}
        icon={<FiUnderline className={TOOLBAR_BTN_ICON} />}
      />

      <div className="relative" ref={linkPopoverRef}>
        <ToolbarButton
          onClick={() => setShowLinkPopover((v) => !v)}
          active={showLinkPopover}
          title="لینک"
          btn={btn}
          icon={<FiLink className={TOOLBAR_BTN_ICON} />}
        />
        {showLinkPopover && (
          <LinkPopover
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            setShowLinkPopover={setShowLinkPopover as any}
            onApplyLink={onApplyLink}
          />
        )}
      </div>
    </div>
  );
}
