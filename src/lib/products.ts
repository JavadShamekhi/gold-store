import {Product} from "@/src/types/product";

export const products: Product[] = [
	{
		id: 1,
		title: 'Royal Gold Ring',
		price: 1250,
		image: '/images/royal-gold-ring.jpg',
		category: 'Ring',
		weight: '18g',
	},
	{
		id: 2,
		title: 'Luxury Necklace',
		price: 3400,
		image: '/images/necklace.jpg',
		category: 'Necklace',
		weight: '24g',
	},
	{
		id: 3,
		title: 'Diamond Bracelet',
		price: 2100,
		image: '/images/diamond-bracelet.jpg',
		category: 'Bracelet',
		weight: '16g',
	},
	{
		id: 4,
		title: 'Golden Earrings',
		price: 980,
		image: '/images/golden-earrings.jpg',
		category: 'Earrings',
		weight: '10g',
	},
];