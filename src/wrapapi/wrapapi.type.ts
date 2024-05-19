export type CoffeeInfo = {
	success: boolean;
	name: string;
	price: number;
	img: string;
	info: Info[];
	description: string[];
	type: number;
};
export type RawCoffeeInfo = {
	success: boolean;
	data: {
		name: string;
		price: string;
		img: string;
		info: Info[];
		description: string[];
	};
};
type Info = {
	key: string;
	value: string;
};
