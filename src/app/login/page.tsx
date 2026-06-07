'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	loginSchema,
	LoginFormValues,
} from '@/src/features/auth/schemas/login-schema';
import { useAuthStore } from '@/src/store/auth-store';
import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import { toast } from 'sonner';

export default function LoginPage() {
	const router = useRouter();

	const login = useAuthStore(
			(state) => state.login
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (
			values: LoginFormValues
	) => {
		login({
			id: 1,
			email: values.email,
		});

		toast.success('Logged in successfully');

		router.push('/');
	};

	return (
			<main>
				<Navbar />

				<Container>
					<div className="max-w-md mx-auto py-24">
						<h1 className="text-5xl font-bold mb-10">
							Login
						</h1>

						<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-6"
						>
							<div>
								<input
										{...register('email')}
										placeholder="Email"
										className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-4"
								/>

								{errors.email && (
										<p className="text-red-400 mt-2">
											{errors.email.message}
										</p>
								)}
							</div>

							<div>
								<input
										type="password"
										{...register('password')}
										placeholder="Password"
										className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-4"
								/>

								{errors.password && (
										<p className="text-red-400 mt-2">
											{errors.password.message}
										</p>
								)}
							</div>

							<button
									type="submit"
									className="w-full bg-[#d4af37] text-black py-4 rounded-xl font-semibold cursor-pointer"
							>
								Login
							</button>
						</form>
					</div>
				</Container>
			</main>
	);
}