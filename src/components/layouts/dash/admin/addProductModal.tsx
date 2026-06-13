"use client";

import toast from "react-hot-toast";
import ProductForm from "./ProductForm";

export default function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: () => void;
}) {
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const fd = new FormData();

      const specsObj: Record<string, string> = {};
      values.specifications.forEach((s: any) => {
        specsObj[s.key] = s.value;
      });

      fd.append("specifications", JSON.stringify(specsObj));

      Object.entries(values).forEach(([key, val]) => {
        if (key !== "specifications" && key !== "image") {
          fd.append(key, String(val));
        }
      });

      if (values.image) {
        fd.append("image", values.image);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error();

      await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_PRODUCT",
          entity: "product",
          entityName: values.name,
        }),
      });

      toast.success("محصول با موفقیت ثبت شد ✅", {
        className: "font-vazirmatn",
        position: "top-center",
      });

      resetForm();
      onAdd();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("خطا در ذخیره‌سازی محصول");
    }
  };

  return (
    <ProductForm
      mode="create"
      submitText="ثبت محصول"
      initialValues={{
        name: "",
        slug: "",
        brand: "",
        category: "",
        modelNumber: "",
        description: "",
        specifications: [{ key: "", value: "" }],
        image: null,
        isFeatured: false,
      }}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
