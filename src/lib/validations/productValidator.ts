import { z } from "zod";

const specificationsSchema = z.record(z.string().trim(), z.string().trim());

export const productSchemaZod = z.object({
  name: z.string().trim(),
  slug: z.string().trim().min(1).toLowerCase(),
  brand: z.string().trim().optional(),
  category: z.string().trim().optional(),
  modelNumber: z.string().trim().optional(),
  image: z.string().trim(), // این مرحله بعد از آپلود و تبدیل به URL استفاده می‌شود
  description: z.string().trim().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  datasheetUrl: z.string().trim().optional(),
  contactNeeded: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  // timestamps را در لایه دیتابیس مدیریت می‌کنیم
});

// برای ساخت محصول، وقتی فایل به صورت file ورودی است
export const productRequestSchema = z.object({
  body: z.object({
    name: productSchemaZod.shape.name,
    slug: productSchemaZod.shape.slug,
    brand: productSchemaZod.shape.brand,
    category: productSchemaZod.shape.category,
    modelNumber: productSchemaZod.shape.modelNumber,
    description: productSchemaZod.shape.description,
    specifications: productSchemaZod.shape.specifications,
    isFeatured: productSchemaZod.shape.isFeatured,
    createdBy: productSchemaZod.shape.createdBy,
  }),
  file: z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      mimetype: z.string(),
      buffer: z.instanceof(Buffer).optional(),
      size: z.number().optional(),
      path: z.string().optional(),
    })
    .optional()
    .refine((file) => !!file, "تصویر محصول اجباری است."),
});

// ولیدیشن داده‌ای برای ذخیره در مونگو، بعد از ساخت URL
export const productCreateSchema = productSchemaZod;
export const productUpdateSchema = productSchemaZod.partial();
