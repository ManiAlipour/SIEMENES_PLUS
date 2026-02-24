"use client";

import {
  MdPerson,
  MdTitle,
  MdOutlineEmail,
} from "react-icons/md";
import type { Contact } from "./types";

type ContactsTableProps = {
  contacts: Contact[];
  onShowMessage: (contact: Contact) => void;
};

function statusLabel(status: string) {
  if (status === "pending") return "در انتظار پاسخ";
  if (status === "answered") return "پاسخ داده شده";
  return "بسته شده";
}

function statusClass(status: string) {
  if (status === "pending") return "bg-yellow-100 text-yellow-700";
  if (status === "answered") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-500";
}

/**
 * Mobile layout: card list for each contact with tap-friendly "view message" button.
 */
export function MobileContactsList({ contacts, onShowMessage }: ContactsTableProps) {
  return (
    <div className="flex flex-col gap-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2"
          style={{ minWidth: 0 }}
        >
          <div className="flex items-center gap-2 text-gray-700 text-base font-bold mb-1">
            <MdPerson className="text-primary/60 w-5 h-5 shrink-0" />
            <span className="truncate">{contact.firstName + " " + contact.lastName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 min-w-0 truncate">
            <MdOutlineEmail className="w-4 h-4 text-primary/60 shrink-0" />
            <span dir="ltr" className="break-all truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 min-w-0 truncate">
            <MdTitle className="w-4 h-4 text-primary/60 shrink-0" />
            <span className="font-bold shrink-0">عنوان:</span>
            <span className="break-all truncate">{contact.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-xl text-xs font-bold whitespace-nowrap ${statusClass(contact.status)}`}>
              {statusLabel(contact.status)}
            </span>
            <span className="text-xxs text-gray-400 ml-auto rtl:ml-0 rtl:mr-auto whitespace-nowrap">
              {new Date(contact.createdAt).toLocaleDateString("fa-IR")}
            </span>
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="text-primary hover:underline text-xs font-bold px-2 py-1 rounded-lg focus:outline-none"
              onClick={() => onShowMessage(contact)}
              type="button"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              مشاهده پیام
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Desktop layout: table of contacts with "view message" in last column.
 */
export function DesktopContactsTable({ contacts, onShowMessage }: ContactsTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow px-2 pb-2">
      <table className="w-full text-sm text-right border-separate border-spacing-y-2">
        <thead>
          <tr className="text-xs text-gray-500 bg-gray-50">
            <th className="px-3 py-2 rounded-tr-xl">نام</th>
            <th className="px-3 py-2">ایمیل</th>
            <th className="px-3 py-2">عنوان</th>
            <th className="px-3 py-2">وضعیت</th>
            <th className="px-3 py-2">تاریخ</th>
            <th className="px-3 py-2 rounded-tl-xl">جزییات</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="bg-white hover:bg-gray-50 transition">
              <td className="px-3 py-2 font-semibold">
                {contact.firstName + " " + contact.lastName}
              </td>
              <td className="px-3 py-2">{contact.email}</td>
              <td className="px-3 py-2">{contact.title}</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded-xl text-xs font-bold ${statusClass(contact.status)}`}>
                  {statusLabel(contact.status)}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 ltr:text-left rtl:text-right">
                {new Date(contact.createdAt).toLocaleDateString("fa-IR")}
              </td>
              <td className="px-3 py-2">
                <button
                  className="text-primary hover:underline text-xs font-bold"
                  onClick={() => onShowMessage(contact)}
                  type="button"
                >
                  مشاهده پیام
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
