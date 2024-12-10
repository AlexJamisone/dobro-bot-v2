type Coffee = {
	name: string;
	image: string;
	short: string;
	price: number;
	acidity: number;
	density: number;
	description: string;
	fields: Record<string, string>;
	url: string;
};
type DataFromBackend = {
	products: Coffee[];
};
