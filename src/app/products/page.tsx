import {getProducts} from "@/src/server/product.service";
import Navbar from "@/src/components/layout/navbar";
import ClientProducts from "@/src/components/product/client-products";

export default async function ProductsPage() {
	const products = await getProducts();

	return (
			<>
				<Navbar/>

				<ClientProducts products={products}/>
			</>
	);
}