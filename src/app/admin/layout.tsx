import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';

export default function AdminLayout({
	                                    children,
                                    }: {
	children: React.ReactNode;
}) {
	return (
			<>
				<Navbar />

				<Container>
					<div className="py-10">
						{children}
					</div>
				</Container>
			</>
	);
}