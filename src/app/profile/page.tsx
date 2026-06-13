import { getCurrentUser } from '@/src/lib/current-user';

export default async function ProfilePage() {
	const user = await getCurrentUser();

	return (
			<div>
			<pre>
				{JSON.stringify(user, null, 2)}
			</pre>
			</div>
	);
}