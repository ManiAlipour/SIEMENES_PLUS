import React from "react";
import { BLOCK_TYPES, TOOLBAR_GROUP } from "../constants";
import type { BtnFn, ExecFn, FormatState } from "../types";
import ToolbarButton from "../ToolbarButton";

export default function BlockFormatGroup({
  formatState,
  exec,
  btn,
}: {
  formatState: FormatState;
  exec: ExecFn;
  btn: BtnFn;
}) {
  return (
    <div className={TOOLBAR_GROUP}>
      {BLOCK_TYPES.map((type) => (
        <ToolbarButton
          key={type.key}
          onClick={() => exec("formatBlock", type.key)}
          active={formatState.formatBlock === type.key}
          title={typeof type.label === "string" ? type.title : ""}
          btn={btn}
          icon={
            typeof type.label === "string" ? (
              <span className="px-2 font-bold text-[14px] sm:text-[15px]">
                {type.label}
              </span>
            ) : (
              <span>{type.label}</span>
            )
          }
        />
      ))}
    </div>
  );
}
