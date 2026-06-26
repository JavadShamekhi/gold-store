'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/src/components/ui/form';
import {Input} from '@/src/components/ui/input';
import {Button} from '@/src/components/ui/button';
import {useLocale} from '@/src/lib/i18n/LocaleProvider';
import {useAuthStore} from "@/src/store/auth-store";

export default function LoginPage() {
	const router = useRouter();
	const login = useAuthStore((state) => state.login);
	const [loading, setLoading] = useState(false);
	const [errorShake, setErrorShake] = useState(false);
	const {dict} = useLocale();

	const schema = z.object({
		email: z.string().email(dict?.login.invalidEmail ?? 'Invalid email'),
		password: z.string().min(6, dict?.login.minPassword ?? 'Min 6 characters'),
	});

	type FormValues = z.infer<typeof schema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		form.setFocus('email');
	}, []);

	if (!dict) return null;

	const onSubmit = async (values: FormValues) => {
		try {
			setLoading(true);
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(values),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || dict.login.loginFailed);
			}
			login(data?.user);
			toast.success(dict.login.welcomeBack);
			router.refresh();
			if (data?.user?.role === 'ADMIN') {
				router.push('/admin');
			} else {
				router.push('/');
			}
		} catch (err) {
			setErrorShake(true);
			setTimeout(() => setErrorShake(false), 500);

			toast.error(
					err instanceof Error ? err.message : dict.login.loginFailed
			);
		} finally {
			setLoading(false);
		}
	};

	return (
			<div
					className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] text-[var(--foreground)]">

				{/* BACKGROUND GRID */}
				<div
						className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,var(--primary)_1px,transparent_0)] [background-size:24px_24px]"/>

				{/* GOLD GLOW ORBS */}
				<div
						className="absolute w-[500px] h-[500px] bg-[var(--primary)] opacity-10 blur-[120px] top-[-100px] left-[-100px]"/>
				<div
						className="absolute w-[500px] h-[500px] bg-blue-500 opacity-10 blur-[120px] bottom-[-150px] right-[-150px]"/>

				{/* CARD */}
				<div
						className={`
					w-full max-w-md z-10
					p-8 rounded-3xl
					border border-[var(--border)]
					bg-[var(--card)]
					backdrop-blur-xl
					shadow-[0_0_60px_rgba(212,175,55,0.08)]
					transition
					${errorShake ? 'animate-shake' : ''}
				`}
				>

					{/* TITLE */}
					<h1 className="text-4xl font-bold text-center text-[var(--primary)] tracking-wide">
						ZARRIN
					</h1>

					<p className="text-center text-[var(--foreground)]/60 mt-2 mb-8">
						{dict.login.title}
					</p>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

							{/* EMAIL */}
							<FormField
									control={form.control}
									name="email"
									render={({field}) => (
											<FormItem>
												<FormLabel>{dict.login.email}</FormLabel>
												<FormControl>
													<Input
															{...field}
															placeholder="admin@zarrin.com"
															className="
												bg-[var(--background)]
												border-[var(--border)]
												focus:border-[var(--primary)]
												transition
											"
													/>
												</FormControl>
												<FormMessage/>
											</FormItem>
									)}
							/>

							{/* PASSWORD */}
							<FormField
									control={form.control}
									name="password"
									render={({field}) => (
											<FormItem>
												<FormLabel>{dict.login.password}</FormLabel>
												<FormControl>
													<Input
															type="password"
															{...field}
															placeholder="••••••••"
															className="
												bg-[var(--background)]
												border-[var(--border)]
												focus:border-[var(--primary)]
												transition
											"
													/>
												</FormControl>
												<FormMessage/>
											</FormItem>
									)}
							/>

							{/* BUTTON */}
							<Button
									type="submit"
									disabled={loading}
									className="
								w-full h-12
								bg-[var(--primary)]
								text-black font-semibold
								rounded-xl
								hover:scale-[1.02]
								transition
								active:scale-[0.98]
								cursor-pointer
							"
							>
								{loading ? dict.login.authenticating : dict.login.enterDashboard}
							</Button>

						</form>
					</Form>

					{/* LINK TO REGISTER */}
					<p className="text-center text-sm text-[var(--foreground)]/60 mt-6">
						{dict.login.noAccount}{' '}
						<button
								type="button"
								onClick={() => router.push('/auth/register')}
								className="text-[var(--primary)] hover:underline cursor-pointer"
						>
							{dict.login.registerLink}
						</button>
					</p>
				</div>
			</div>
	);
}