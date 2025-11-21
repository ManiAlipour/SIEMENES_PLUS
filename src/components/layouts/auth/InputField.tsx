"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="mb-6">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          {...register}
          type={inputType}
          className={`
            w-full px-4 py-3.5 rounded-xl
            bg-gray-50 border-2 transition-all duration-300
            focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
            }
            text-gray-900 placeholder-gray-400
            hover:border-gray-300
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <span>⚠</span>
          {error}
        </motion.p>
      )}
    </div>
  );
}
