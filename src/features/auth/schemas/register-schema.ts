import {z} from "zod";

export const registerSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Minimum 6 characters'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;