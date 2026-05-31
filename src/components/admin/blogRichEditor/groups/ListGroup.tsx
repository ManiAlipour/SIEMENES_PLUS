import { BsListOl } from "react-icons/bs";
import { FiList } from "react-icons/fi";
import { TOOLBAR_BTN_ICON, TOOLBAR_GROUP } from "../constants";
import type { BtnFn, ExecFn, FormatState } from "../types";
import ToolbarButton from "../ToolbarButton";

export default function ListGroup({
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
      <ToolbarButton
        onClick={() => exec("insertUnorderedList")}
        active={formatState.unorderedList}
        title="لیست نقطه‌ای"
        btn={btn}
        icon={<FiList className={TOOLBAR_BTN_ICON} />}
      />
      <ToolbarButton
        onClick={() => exec("insertOrderedList")}
        active={formatState.orderedList}
        title="لیست شماره‌دار"
        btn={btn}
        icon={<BsListOl className={TOOLBAR_BTN_ICON} />}
      />
    </div>
  );
}
