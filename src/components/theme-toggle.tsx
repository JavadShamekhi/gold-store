'use client';

import {useTheme} from "next-themes";
import {Moon, Sun} from "lucide-react";
import {useEffect, useState} from "react";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
			<button
				onClick={() => setTheme(
						theme === 'dark' ? 'light' : 'dark'
				)}
				className="cursor-pointer rounded-full border border-[var(--border)] hover:border-[var(--primary)] p-2 transition hover:scale-105"
			>
				{theme === 'dark' ? (
						<Sun size={18} />
				) : (
						<Moon size={18} />
				)}
			</button>
	);
}