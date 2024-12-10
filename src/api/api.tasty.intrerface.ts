export interface Root {
	data: Data;
}

export interface Data {
	items: Item[];
	prices: Prices;
	count: number;
	has_coffee: boolean;
	weight: number;
	shipping: number;
	shipping_method: string;
	coupon_code: string;
	voucher_code: string;
	shipping_name: string;
	dates: Dates;
	gifts: Gifts;
	gifts_hint: GiftsHint;
	latest_order: LatestOrder;
	address: Address;
}

export interface Item {
	id: string;
	web_id: string;
	product: Product;
	options: number[];
	quantity: number;
	gift_for: string;
}

export interface Product {
	id: number;
	name: string;
	slug: string;
	main_category: string;
	used_for: string;
	images: string[];
	mockup_image: string;
	mini_description: string;
	rating: number;
	reviews_count: number;
	processing_method: string;
	week_special: boolean;
	price: number;
	is_archive: boolean;
	selectable_options: SelectableOption[];
	measurable_option: MeasurableOption;
	rating_q: number;
	sourness: number;
	saturation: number;
	special_flags: SpecialFlag[];
	is_for_milk: boolean;
	is_decaf: boolean;
	is_simple_capsule: boolean;
	is_dolce_gusto_capsule: boolean;
	is_simple_drip: boolean;
	is_brew_bag_drip: boolean;
	user_rating: any;
	is_random: boolean;
	product_user_sale_count: number;
	is_coffee_bean: boolean;
}

export interface SelectableOption {
	id: number;
	selected_id: any;
	option: Option;
	values: Value[];
}

export interface Option {
	id: number;
	title: string;
	type: string;
	sort_order: number;
}

export interface Value {
	id: number;
	price: number;
	option_value_id: number;
	product_option_id: number;
	title: string;
	discount_percent: number;
	price_without_discount: number;
}

export interface MeasurableOption {
	id: number;
	selected_id: any;
	option: Option2;
	values: Value2[];
}

export interface Option2 {
	id: number;
	title: string;
	type: string;
	sort_order: number;
}

export interface Value2 {
	id: number;
	price: number;
	option_value_id: number;
	product_option_id: number;
	title: string;
	discount_percent: number;
	price_without_discount: number;
}

export interface SpecialFlag {
	id: number;
	value: string;
	parameter: string;
}

export interface Prices {
	total: number;
	sub_total: number;
	coupon: number;
	voucher: number;
	internal_bill: number;
	personal_discount: number;
	shipping: number;
	special_week: number;
}

export interface Dates {
	roasting: string;
	send: string;
	send_diff: number;
	shipping: string[];
	shipping_interval: string;
}

export interface Gifts {
	coffee: number;
	tea: number;
}

export interface GiftsHint {
	type: string;
	count: number;
	left: number;
}

export interface LatestOrder {
	is_legal: boolean;
	shipping_code: string;
	payment_code: string;
}

export interface Address {
	id: number;
	dadata: any;
}
