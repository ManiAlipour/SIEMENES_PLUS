"use client";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export default function InputField({
  label,
  type = "text",
  register,
  error,
}: Props) {
  return (
    <div className="mb-5">
      <label className="block mb-1.5 text-sm leading-tight text-gray-300 select-none">
        {label}
      </label>
      <input
        {...register}
        type={type}
        className="w-full px-3.5 py-2.5 rounded-md bg-white/5 border border-white/20 focus:border-teal-400 focus:ring-2 focus:ring-teal-600 outline-none text-sm text-white placeholder-gray-400 transition-all duration-200 ease-out"
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
