'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/src/components/ui/alert-dialog';

export default function DeleteButton({
	                                     id,
                                     }: {
	id: string;
}) {
	const router = useRouter();

	const handleDelete = async () => {
		try {
			const res = await fetch(`/api/products/${id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				throw new Error('Delete failed');
			}

			toast.success('Product deleted successfully');
			router.refresh();
		} catch {
			toast.error('Failed to delete product');
		}
	};

	return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<button
							className="px-4 py-2 border border-[var(--border)]	bg-[var(--background)] rounded-full hover:border-red-500 hover:text-red-400 transition cursor-pointer"
					>
						Delete
					</button>
				</AlertDialogTrigger>

				<AlertDialogContent className="bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold">
							Are you absolutely sure?
						</AlertDialogTitle>

						<AlertDialogDescription className="text-sm text-muted-foreground">
							This action cannot be undone. This will permanently
							delete this product from your database.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel className="bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded-full hover:bg-[var(--secondary)]">
							Cancel
						</AlertDialogCancel>

						<AlertDialogAction
								onClick={handleDelete}
								className="bg-red-500 text-white rounded-full hover:bg-red-600"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
	);
}