import { GoChevronRight } from "react-icons/go";
import { IconType } from "react-icons/lib";

interface TitleBarProps {
  title: string;
  address: string[];
  Icon: IconType;
}

export default function TitleBar({ title, address, Icon }: TitleBarProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Title Section */}
      <div className="flex items-center gap-2">
        <div className="p-[6px] rounded-xl bg-linear-to-br from-[#06b6d4] to-[#0e7490] bg-opacity-20 shadow-[inset_0_0_6px_rgba(6,182,212,0.4)]">
          <Icon size={26} className="text-[#06b6d4]" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#1f2937]">
          {title}
        </h1>
      </div>

      {/* Address (Breadcrumb) */}
      <nav className="flex items-center flex-wrap text-sm text-[#374151]/80 pl-[6px]">
        {address.map((a, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`hover:text-[#06b6d4] transition-colors duration-200 ${
                i === address.length - 1
                  ? "font-semibold text-[#06b6d4]"
                  : "font-light"
              }`}
            >
              {a}
            </span>
            {i < address.length - 1 && (
              <GoChevronRight size={12} className="mx-1 text-[#9ca3af]" />
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
