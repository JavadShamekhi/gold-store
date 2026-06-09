import Image from "next/image";
import AddToCartButton from "@/src/components/product/add-to-cart-button";
import {notFound} from "next/navigation";
import {getProductById} from "@/src/server/product.service";
import Navbar from "@/src/components/layout/navbar";
import Container from "@/src/components/layout/container";

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function ProductDetailsPage({
	                                                 params,
                                                 }: Props) {
	const { id } = await params;

	const product = await getProductById(
			id
	);

	if (!product) {
		notFound();
	}

	return (
			<>
				<Navbar />

				<Container>
					<div className="grid md:grid-cols-2 gap-12 py-20">
						<div className="relative h-[600px] rounded-3xl overflow-hidden">
							<Image
									src={product.image}
									alt={product.title}
									fill
									className="object-cover"
							/>
						</div>

						<div>
							<p className="text-[#d4af37] uppercase tracking-[4px]">
								{product.category}
							</p>

							<h1 className="text-5xl font-bold mt-4">
								{product.title}
							</h1>

							<p className="text-white/60 mt-6 text-lg leading-relaxed">
								{product.description}
							</p>

							<div className="mt-10 space-y-4">
								<p>
									Weight:
									<span className="text-[#d4af37] ml-2">
                  {product.weight}g
                </span>
								</p>

								<p>
									Stock:
									<span className="text-[#d4af37] ml-2">
                  {product.stock}
                </span>
								</p>
							</div>

							<div className="text-4xl font-bold text-[#d4af37] mt-10">
								${product.price}
							</div>

							<div className="flex gap-4 mt-10">
								<AddToCartButton
										id={product.id}
										title={product.title}
										price={product.price}
										image={product.image}
								/>

								<button className="border border-white/10 px-8 py-4 rounded-full hover:border-[#d4af37] transition">
									Wishlist
								</button>
							</div>
						</div>
					</div>
				</Container>
			</>
	);
}