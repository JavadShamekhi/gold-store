import {products} from "@/src/lib/products";
import Image from "next/image";
import {notFound} from "next/navigation";
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

			const product = products.find(
					(item) => item.id === Number(id)
			);

			if (!product) {
				return notFound();
			}

			return (
				<main>
					<Navbar />

					<Container>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-14 py-20">
							<div className="relative h-[600px] rounded-3xl overflow-hidden border border-white/10">
								<Image
										src={product.image}
										alt={product.title}
										fill
										className="object-cover"
								/>
							</div>

							<div className="flex flex-col justify-center">
            <span className="text-[#d4af37] uppercase tracking-[4px] text-sm">
              {product.category}
            </span>

								<h1 className="text-5xl font-bold mt-4">
									{product.title}
								</h1>

								<p className="text-3xl font-bold text-[#d4af37] mt-6">
									${product.price}
								</p>

								<div className="mt-8 space-y-4 text-white/70">
									<p>
										Weight:
										<span className="text-white ml-2">
                  {product.weight}
                </span>
									</p>

									<p>
										Material:
										<span className="text-white ml-2">
                  18K Premium Gold
                </span>
									</p>

									<p>
										Availability:
										<span className="text-green-400 ml-2">
                  In Stock
                </span>
									</p>
								</div>

								<p className="mt-10 text-white/60 leading-8">
									Crafted with exceptional precision and timeless
									elegance, this luxury jewelry piece is designed
									for modern sophistication and premium fashion.
								</p>

								<div className="flex gap-4 mt-10">
									<button className="bg-[#d4af37] text-black px-8 py-4 rounded-full font-semibold hover:opacity-90 transition">
										Add To Cart
									</button>

									<button className="border border-white/10 px-8 py-4 rounded-full hover:border-[#d4af37] transition">
										Wishlist
									</button>
								</div>
							</div>
						</div>
					</Container>
				</main>
			);
}