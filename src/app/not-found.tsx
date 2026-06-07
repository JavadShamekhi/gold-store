import Link from 'next/link';

export default function NotFound() {
	return (
			<div className="h-screen flex flex-col items-center justify-center">
				<h1 className="text-6xl font-bold">
					404
				</h1>

				<p className="mt-4 text-white/60">
					This page not found
				</p>

				<Link
						href="/"
						className="mt-8 bg-[#d4af37] text-black px-6 py-3 rounded-full"
				>
					Back to home
				</Link>
			</div>
	);
}