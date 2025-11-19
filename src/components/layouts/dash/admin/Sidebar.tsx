import Link from "next/link";
import { IoIosClose, IoIosSettings, IoIosStats } from "react-icons/io";
import {
  MdCategory,
  MdDashboardCustomize,
  MdOutlineMessage,
} from "react-icons/md";
import { IoCartSharp } from "react-icons/io5";
import { FcDocument } from "react-icons/fc";
import { usePathname } from "next/navigation";
import { FaUsersGear } from "react-icons/fa6";

interface ISideBarProps {
  open: boolean;
  toggleOpen: () => void;
}

export default function AdminSideBar({ open, toggleOpen }: ISideBarProps) {
  const sidebarLinks = [
    {
      title: "داشبورد",
      href: "/admin",
      icon: MdDashboardCustomize,
    },
    {
      title: "محصولات",
      href: "/admin/products",
      icon: IoCartSharp,
    },
    {
      title: "دسته بندی ها",
      href: "/admin/categories",
      icon: MdCategory,
    },
    {
      title: "بلاگ ها",
      href: "/admin/blogs",
      icon: FcDocument,
    },
    {
      title: "کاربران",
      href: "/admin/users",
      icon: FaUsersGear,
    },
    {
      title: "کامنت ها",
      href: "/admin/comments",
      icon: MdOutlineMessage,
    },
    {
      title: "آمار سایت",
      href: "/admin/stats",
      icon: IoIosStats,
    },
  ];

  const pathname = usePathname();

  return (
    <div
      className={`md:flex flex-col gap-4 z-40 px-6 transition-all duration-300 py-5
         bg-primary text-white h-screen  min-w-52 fixed ${
           open
             ? "translate-x-0 backdrop-blur-3xl shadow-2xl"
             : "translate-x-full md:translate-x-0"
         }`}
    >
      <div className="text-xl mb-3 flex justify-between items-center gap-2 ">
        پنل ادمین
        <button onClick={toggleOpen} className="text-xl md:hidden">
          <IoIosClose />
        </button>
      </div>

      {sidebarLinks.map((sl, i) => (
        <Link
          href={sl.href}
          className={`flex gap-2 items-center hover:bg-slate-50/20 transition-all
           duration-300 px-4 py-2 ${pathname === sl.href && "bg-slate-50/20"}`}
          key={i}
        >
          <sl.icon className="text-lg" />
          <span>{sl.title}</span>
        </Link>
      ))}
    </div>
  );
}
