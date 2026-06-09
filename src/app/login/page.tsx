'use client';

import { toast } from "sonner";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {error} from "effect/Brand";

const schema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			setLoading(true);

			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				throw new Error('Login failed');
			}

			toast.success('Welcome back!');

			router.push('/admin/products');
			router.refresh();
		} catch (err) {
			toast.error(
					error instanceof Error
						? error.message
							: 'Login failed'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
			<div className="min-h-screen flex items-center justify-center bg-background text-foreground">
				<div className="w-full max-w-md p-8 rounded-2xl border border-border bg-[#0a0a0a] shadow-xl">

					<h1 className="text-3xl font-bold text-center text-[#d4af37] mb-2">
						ZARRIN Admin
					</h1>

					<p className="text-center text-white/60 mb-8">
						Sign in to your dashboard
					</p>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

							{/* EMAIL */}
							<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
															placeholder="admin@example.com"
															{...field}
															className="bg-background border-border focus:border-[#d4af37]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
									)}
							/>

							{/* PASSWORD */}
							<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
															type="password"
															placeholder="••••••••"
															{...field}
															className="bg-background border-border focus:border-[#d4af37]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
									)}
							/>

							{/* BUTTON */}
							<Button
									type="submit"
									disabled={loading}
									className="w-full bg-[#d4af37] text-black hover:opacity-90"
							>
								{loading ? 'Signing in...' : 'Login'}
							</Button>

						</form>
					</Form>
				</div>
			</div>
	);
}