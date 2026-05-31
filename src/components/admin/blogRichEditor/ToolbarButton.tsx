export default function ToolbarButton({
  onClick,
  active,
  title,
  btn,
  icon,
  className = "",
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  btn: (active: boolean, extraClasses?: string) => string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={btn(active, `${className} flex-shrink-0`)}
      title={title}
      aria-pressed={active}
      tabIndex={0}
      style={{ minWidth: 36, minHeight: 36, touchAction: "manipulation" }}
    >
      {icon}
    </button>
  );
}
