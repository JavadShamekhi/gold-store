import {getProducts} from "@/src/server/product.service";
import Navbar from "@/src/components/layout/navbar";
import ClientProducts from "@/src/app/products/client-products";

export default async function ProductsPage() {
	const products = await getProducts();

	return (
			<>
				<Navbar/>

				<ClientProducts products={products}/>
			</>
	);
}