import {notFound} from 'next/navigation';
import Navbar from '@/src/components/layout/navbar';
import Container from '@/src/components/layout/container';
import {prisma} from '@/src/lib/prisma';
import EditProductForm from './edit-product-form';

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function EditProductPage({
	                                              params,
                                              }: Props) {
	const {id} = await params;

	const product = await prisma.product.findUnique({
		where: {
			id: id,
		},
	});

	if (!product) {
		notFound();
	}

	return (
			<>
				<Navbar/>

				<Container>
					<div className="py-20">
						<h1 className="text-5xl font-bold mb-10">
							Edit Product
						</h1>

						<EditProductForm product={product}/>
					</div>
				</Container>
			</>
	);
}