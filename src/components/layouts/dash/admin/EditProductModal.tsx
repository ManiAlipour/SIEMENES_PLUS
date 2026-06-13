"use client";

import toast from "react-hot-toast";
import ProductForm from "./ProductForm";

interface Product {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  category?: string;
  modelNumber?: string;
  description?: string;
  specifications?: { key: string; value: string }[] | Record<string, string>;
  imageUrl?: string;
  isFeatured?: boolean;
}

export default function EditProductModal({
  product,
  onClose,
  onUpdated,
}: {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const handleSubmit = async (values: any) => {
    try {
      const fd = new FormData();

      // اگر specs به صورت object از سرور آمده بود، تبدیلش می‌کنیم
      const specsArray = Array.isArray(values.specifications)
        ? values.specifications
        : Object.entries(values.specifications || {}).map(([key, value]) => ({
            key,
            value,
          }));

      const specsObj: Record<string, string> = {};
      specsArray.forEach((s: any) => {
        if (s.key) specsObj[s.key] = s.value;
      });

      fd.append("specifications", JSON.stringify(specsObj));

      Object.entries(values).forEach(([key, val]) => {
        if (key !== "specifications" && key !== "image") {
          fd.append(key, String(val ?? ""));
        }
      });

      if (values.image) {
        fd.append("image", values.image);
      }

      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) throw new Error();

      await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PRODUCT",
          entity: "product",
          entityName: values.name,
        }),
      });

      toast.success("محصول بروزرسانی شد ✅");

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("خطا در بروزرسانی محصول");
    }
  };

  // اگر specifications از دیتابیس object بود → تبدیل به array برای فرم
  const normalizedSpecs = Array.isArray(product.specifications)
    ? product.specifications
    : Object.entries(product.specifications || {}).map(([key, value]) => ({
        key,
        value,
      }));

  return (
    <ProductForm
      mode="edit"
      submitText="ذخیره تغییرات"
      onClose={onClose}
      onSubmit={handleSubmit}
      initialValues={{
        name: product.name,
        slug: product.slug,
        brand: product.brand || "",
        category: product.category || "",
        modelNumber: product.modelNumber || "",
        description: product.description || "",
        specifications:
          normalizedSpecs.length > 0
            ? normalizedSpecs
            : [{ key: "", value: "" }],
        image: null,
        imageUrl: product.imageUrl || null,
        isFeatured: product.isFeatured || false,
      }}
    />
  );
}
