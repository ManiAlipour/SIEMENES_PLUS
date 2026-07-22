import { GoChevronLeft } from "react-icons/go";
import { IconType } from "react-icons/lib";

interface TitleBarProps {
  title: string;
  address: string[];
  Icon: IconType;
  description?: string;
}

export default function TitleBar({
  title,
  address,
  Icon,
  description,
}: TitleBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#004c97] to-[#0079c2] shadow-[0_8px_20px_rgba(0,76,151,0.25)]">
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0b1f33]">
            {title}
          </h1>
          {description ? (
            <p className="mt-0.5 text-sm text-[#64748b]">{description}</p>
          ) : null}
        </div>
      </div>

      <nav className="flex flex-wrap items-center text-sm text-[#94a3b8]">
        {address.map((a, i) => (
          <span key={`${a}-${i}`} className="flex items-center">
            <span
              className={
                i === address.length - 1
                  ? "font-semibold text-[#004c97]"
                  : "font-light"
              }
            >
              {a}
            </span>
            {i < address.length - 1 && (
              <GoChevronLeft size={12} className="mx-1 text-[#cbd5e1]" />
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
