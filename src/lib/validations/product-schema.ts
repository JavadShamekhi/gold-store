import {z} from "zod";

export const productSchema = z.object({
	title: z.string().min(3),
	description: z.string().min(10),
	category: z.string().min(1),
	image: z.string().url(),
	price: z.coerce.number().positive(),
	weight: z.coerce.number().positive(),
	stock: z.coerce.number().min(0),
});

export type ProductFormValues = z.infer<
		typeof productSchema
>;