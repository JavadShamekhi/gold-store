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
import {useLocale} from "@/src/lib/i18n/LocaleProvider";

export default function DeleteButton({
	                                     id,
                                     }: {
	id: string;
}) {
	const router = useRouter();
	const { dict } = useLocale();

	if (!dict) return null;

	const t = dict.product.deleteButton;

	const handleDelete = async () => {
		try {
			const res = await fetch(`/api/products/${id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				throw new Error(t.errorGeneric);
			}

			toast.success(t.success);
			router.refresh();
		} catch(error) {
			console.log(error)
			toast.error(t.error);
		}
	};

	return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<button
							className="px-4 py-2 border border-[var(--border)]	bg-[var(--background)] rounded-full hover:border-red-500 hover:text-red-400 transition cursor-pointer"
					>
						{t.trigger}
					</button>
				</AlertDialogTrigger>

				<AlertDialogContent className="bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rounded-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold">
							{t.confirmTitle}
						</AlertDialogTitle>

						<AlertDialogDescription className="text-sm text-muted-foreground">
							{t.confirmDescription}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel className="bg-transparent border border-[var(--border)] text-[var(--foreground)] rounded-full hover:bg-[var(--secondary)] cursor-pointer">
							{t.cancel}
						</AlertDialogCancel>

						<AlertDialogAction
								onClick={handleDelete}
								className="bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
						>
							{t.action}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
	);
}