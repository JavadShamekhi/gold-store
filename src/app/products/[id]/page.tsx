import {notFound} from "next/navigation";
import {getProductById} from "@/src/server/product.service";
import ProductDetailsClient from "@/src/components/product/product-details-client";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function ProductDetailsPage({
	                                                 params,
                                                 }: Props) {
	const {id} = await params;

	const product = await getProductById(
			id
	);

	if (!product) {
		notFound();
	}

	return <ProductDetailsClient product={product}/>;
}