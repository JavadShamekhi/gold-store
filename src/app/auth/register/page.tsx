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

export default function RegisterPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [errorShake, setErrorShake] = useState(false);
	const {dict} = useLocale();

	// NOTE: mirrors login/page.tsx's pattern of building the schema inline
	// with dict-based messages. If you don't have dict.register.* keys yet,
	// add them to your locale dictionaries (en/fa) — same shape as
	// dict.login.invalidEmail / dict.login.minPassword.
	const schema = z.object({
		name: z.string().min(2, dict?.register.invalidName ?? 'Name must be at least 2 characters'),
		email: z.string().email(dict?.register.invalidEmail ?? 'Invalid email'),
		password: z.string().min(6, dict?.register.minPassword ?? 'Min 6 characters'),
	});

	type FormValues = z.infer<typeof schema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		form.setFocus('name');
	}, []);

	if (!dict) return null;

	const onSubmit = async (values: FormValues) => {
		try {
			setLoading(true);
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(values),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || dict.register.registerFailed);
			}

			toast.success(dict.register.accountCreated);
			// Per your earlier choice: no auto-login, just send them to
			// /login to sign in with the credentials they just created.
			router.push('/auth/login');
		} catch (err) {
			setErrorShake(true);
			setTimeout(() => setErrorShake(false), 500);

			toast.error(
					err instanceof Error ? err.message : dict.register.registerFailed
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
						{dict.register.title}
					</p>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

							{/* NAME */}
							<FormField
									control={form.control}
									name="name"
									render={({field}) => (
											<FormItem>
												<FormLabel>{dict.register.name}</FormLabel>
												<FormControl>
													<Input
															{...field}
															placeholder={dict.register.namePlaceholder}
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

							{/* EMAIL */}
							<FormField
									control={form.control}
									name="email"
									render={({field}) => (
											<FormItem>
												<FormLabel>{dict.register.email}</FormLabel>
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
												<FormLabel>{dict.register.password}</FormLabel>
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
								{loading ? dict.register.creatingAccount : dict.register.createAccount}
							</Button>

						</form>
					</Form>

					{/* LINK TO LOGIN */}
					<p className="text-center text-sm text-[var(--foreground)]/60 mt-6">
						{dict.register.haveAccount}{' '}
						<button
								type="button"
								onClick={() => router.push('/auth/login')}
								className="text-[var(--primary)] hover:underline cursor-pointer"
						>
							{dict.register.loginLink}
						</button>
					</p>
				</div>
			</div>
	);
}