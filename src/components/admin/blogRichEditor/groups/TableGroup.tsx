import React from "react";
import {
  BLUR_OVERLAY,
  POPUP,
  TABLE_COLS_MAX,
  TABLE_COLS_MIN,
  TABLE_PRESETS,
  TABLE_ROWS_MAX,
  TABLE_ROWS_MIN,
} from "../constants";
import { FiGrid } from "react-icons/fi";
import { TOOLBAR_BTN_ICON } from "../constants";
import type { BtnFn } from "../types";
import ToolbarButton from "../ToolbarButton";

export default function TableGroup({
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
  setShowTablePicker: React.Dispatch<React.SetStateAction<boolean>>;
  tableRows: number;
  tableCols: number;
  setTableRows: (v: number) => void;
  setTableCols: (v: number) => void;
  insertTable: (r: number, c: number) => void;
  clampTableRows: (n: number) => number;
  clampTableCols: (n: number) => number;
  btn: BtnFn;
}) {
  return (
    <div className="relative" ref={tablePickerRef}>
      <ToolbarButton
        onClick={() => setShowTablePicker((v) => !v)}
        active={showTablePicker}
        title="جدول"
        btn={btn}
        icon={<FiGrid className={TOOLBAR_BTN_ICON} aria-hidden />}
      />

      {showTablePicker && (
        <>
          <div
            className={BLUR_OVERLAY}
            onClick={() => setShowTablePicker(false)}
          />
          <div className={`${POPUP} w-[92vw] max-w-[98vw] sm:w-[335px]`}>
            <p className="text-base font-semibold text-slate-700 mb-1">
              درج جدول در محتوا
            </p>
            <p className="text-xs text-slate-400 mb-3">
              یک اندازه سریع یا اندازه دلخواه وارد کنید.
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {TABLE_PRESETS.map(([r, c]) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => insertTable(r, c)}
                  className="min-h-[32px] sm:min-h-[36px] py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-100 text-xs sm:text-sm font-medium text-slate-700 transition focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  {r}×{c}
                </button>
              ))}
            </div>

            <div className="flex gap-2 sm:gap-3 mb-3">
              <label className="flex-1 flex flex-col gap-0.5 sm:gap-1">
                <span className="text-xs text-slate-600">ردیف</span>
                <input
                  type="number"
                  min={TABLE_ROWS_MIN}
                  max={TABLE_ROWS_MAX}
                  value={tableRows}
                  onChange={(e) =>
                    setTableRows(clampTableRows(Number(e.target.value)))
                  }
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 text-center text-sm sm:text-base font-mono focus:ring-2 focus:ring-cyan-400 outline-none"
                  style={{ minWidth: 0 }}
                />
              </label>

              <label className="flex-1 flex flex-col gap-0.5 sm:gap-1">
                <span className="text-xs text-slate-600">ستون</span>
                <input
                  type="number"
                  min={TABLE_COLS_MIN}
                  max={TABLE_COLS_MAX}
                  value={tableCols}
                  onChange={(e) =>
                    setTableCols(clampTableCols(Number(e.target.value)))
                  }
                  className="w-full px-2 py-2 rounded-lg border border-slate-200 text-center text-sm sm:text-base font-mono focus:ring-2 focus:ring-cyan-400 outline-none"
                  style={{ minWidth: 0 }}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => insertTable(tableRows, tableCols)}
              className="w-full min-h-[36px] sm:min-h-[40px] py-2 rounded-xl bg-cyan-600 text-white text-xs sm:text-sm font-semibold hover:bg-cyan-700 transition-colors"
            >
              درج جدول {tableRows}×{tableCols}
            </button>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              جدول زیر کرسر درج می‌شود و قابل ویرایش است.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
