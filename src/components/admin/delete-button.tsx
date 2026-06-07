'use client';

import {useRouter} from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
	const router = useRouter();

	const handleDelete = async () => {
		await fetch(`/api/products/${id}`, {
			method: "DELETE",
		});

		router.refresh();
	};

	return (
			<button
				onClick={handleDelete}
				className="px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20"
			>
				Delete
			</button>
	);
}