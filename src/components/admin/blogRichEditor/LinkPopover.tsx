import { POPUP } from "./constants";

export default function LinkPopover({
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
      className={`${POPUP} flex flex-col gap-3`}
      role="dialog"
      aria-label="آدرس لینک"
    >
      <span className="block text-base font-semibold text-slate-800 mb-1">
        درج لینک
      </span>
      <input
        type="url"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://..."
        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none text-[15px] font-mono"
        autoFocus
        dir="ltr"
        spellCheck
      />
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={() => setShowLinkPopover(false)}
          className="flex-1 h-[38px] sm:h-[40px] px-2 rounded-xl border border-slate-200 text-slate-600 text-base font-medium hover:bg-slate-50 transition"
        >
          انصراف
        </button>
        <button
          type="button"
          onClick={onApplyLink}
          className="flex-1 h-[38px] sm:h-[40px] px-2 rounded-xl bg-cyan-600 text-white text-base font-bold hover:bg-cyan-700 transition"
        >
          درج لینک
        </button>
      </div>
    </div>
  );
}
