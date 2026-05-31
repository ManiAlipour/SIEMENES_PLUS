import { FiImage, FiMinus, FiPackage, FiPlayCircle } from "react-icons/fi";
import { TOOLBAR_BTN_ICON, TOOLBAR_GROUP } from "../constants";
import type { BtnFn } from "../types";
import ToolbarButton from "../ToolbarButton";

export default function InsertGroup({
  uploadingImage,
  insertImage,
  insertVideo,
  setShowProductPicker,
  insertDivider,
  btn,
}: {
  uploadingImage: boolean;
  insertImage: () => void;
  insertVideo: () => void;
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
        title="درج ویدیو"
        btn={btn}
        icon={<FiPlayCircle className={TOOLBAR_BTN_ICON} />}
      />
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
