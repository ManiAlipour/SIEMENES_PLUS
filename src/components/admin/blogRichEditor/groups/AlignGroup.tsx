import { ALIGNMENTS, TOOLBAR_GROUP } from "../constants";
import type { BtnFn, ExecFn, FormatState } from "../types";
import ToolbarButton from "../ToolbarButton";

export default function AlignGroup({
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
      {ALIGNMENTS.map((a) => (
        <ToolbarButton
          key={a.key}
          onClick={() =>
            exec("justify" + a.key.charAt(0).toUpperCase() + a.key.slice(1))
          }
          active={formatState.align === a.key}
          title={a.title}
          btn={btn}
          icon={a.icon}
        />
      ))}
    </div>
  );
}
