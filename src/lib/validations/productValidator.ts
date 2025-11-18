import { z } from "zod";

const specificationsSchema = z.record(z.string().trim(), z.string().trim());

export const productSchemaZod = z.object({
  name: z.string().trim(),
  slug: z.string().trim().min(1).toLowerCase(),
  brand: z.string().trim().optional(),
  category: z.string().trim().optional(),
  modelNumber: z.string().trim().optional(),
  image: z.string().trim(),
  description: z.string().trim().optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  isFeatured: z.boolean().optional().default(false),
  createdBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});

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
  file: z.instanceof(File).optional().optional(),
});

export const productCreateSchema = productSchemaZod;
export const productUpdateSchema = productSchemaZod.partial();
