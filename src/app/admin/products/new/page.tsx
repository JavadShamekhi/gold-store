import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';

import ProductForm from './product-form';

export default function NewProductPage() {
	return (
			<>
				<Navbar/>

				<Container>
					<div className="py-20">
						<div className="mb-10">
							<p className="text-[#d4af37] uppercase tracking-[4px] text-sm">
								Admin
							</p>

							<h1 className="text-5xl font-bold mt-3">
								Create Product
							</h1>

							<p className="text-white/60 mt-4">
								Add a new jewelry product to your store.
							</p>
						</div>

						<ProductForm/>
					</div>
				</Container>
			</>
	);
}