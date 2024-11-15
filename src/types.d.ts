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
	nextUrl: string;
	products: Coffee[];
};
//
// type Product struct {
//     Name        string            `json:"name"`
//     Image       string            `json:"image"`
//     Short       string            `json:"short"`
//     Price       int               `json:"price"`
//     Acidity     int               `json:"acidity"`
//     Density     int               `json:"density"`
//     Description string            `json:"description"`
//     Fields      map[string]string `json:"fields"`
//     Url         string            `json:"url"`
// }
