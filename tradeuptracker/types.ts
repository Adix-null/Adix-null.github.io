export interface SkinInfo {
	unstable: boolean;
	steamurl: string;
	id: string;
	name: string;
	description: string;
	weapon: { id: string; weapon_id: number; name: string };
	category: { id: string; name: string };
	pattern: { id: string; name: string };
	min_float: number;
	max_float: number;
	float_category?: string;
	output_float?: string;
	rarity: { id: string; name: string; color: string };
	prices: { [key: string]: Prices[keyof Prices] };
	volume24h: number;
	stattrak: boolean;
	souvenir: boolean;
	paint_index: string;
	wears: { id: string; name: string }[];
	collections: { id: string; name: string; image: string }[];
	crates: { id: string; name: string; image: string }[];
	team: { id: string; name: string };
	legacy_model: boolean;
	image: string;
}

export interface SkinPrice {
	id: string;
	markethashname: string;
	marketname: string;
	slug: string;
	classid: string;
	instanceid: string;
	groupid: string;
	infoprice: string;
	pricelatest: number | null;
	pricelatestsell: number | null;
	pricelatestsell24h: number | null;
	pricelatestsell7d: number | null;
	pricelatestsell30d: number | null;
	pricelatestsell90d: number | null;
	lateststeamsellat: { date: string; timezone_type: number; timezone: string };
	latest10steamsales: [string, number, number][];
	pricemedian: number | null;
	pricemedian24h: number | null;
	pricemedian7d: number | null;
	pricemedian30d: number | null;
	pricemedian90d: number | null;
	priceavg: number | null;
	priceavg24h: number | null;
	priceavg7d: number | null;
	priceavg30d: number | null;
	priceavg90d: number | null;
	pricesafe: number | null;
	pricemin: number | null;
	pricemax: number | null;
	pricemix: number | null;
	buyorderprice: number;
	buyordermedian: number;
	buyorderavg: number;
	buyordervolume: number;
	offervolume: number;
	soldtoday: number;
	sold24h: number | null;
	sold7d: number | null;
	sold30d: number | null;
	sold90d: number | null;
	soldtotal: number;
	hourstosold: number;
	points: number;
	priceupdatedat: { date: string; timezone_type: number; timezone: string };
	bordercolor: string;
	color: string;
	quality: string;
	rarity: string;
	itemimage: string;
	marketable: boolean;
	tradable: boolean;
	unstable: boolean;
	unstablereason: string | null;
	createdat: { date: string; timezone_type: number; timezone: string };
	firstseentime: number;
	firstseenat: { date: string; timezone_type: number; timezone: string };
	steamurl: string;
	markettradablerestriction: number;
	tag1: string;
	tag2: string;
	tag3: string;
	tag4: string;
	tag5: string;
	tag6: string;
	tag7: string;
	infotypehintgcdfhbhaielj: string;
	infopricereal: string;
	pricereal: number | null;
	pricereal24h: number | null;
	pricereal7d: number | null;
	pricereal30d: number | null;
	pricereal90d: number | null;
	pricerealmedian: number | null;
	winloss: number;
	wear: string;
	isstar: boolean;
	isstattrak: boolean;
	itemgroup: string;
	itemname: string;
	itemtype: string;
}

export interface Prices {
	pricelatest: number;
	pricelatestsell: number;
	pricelatestsell24h: number;
	pricelatestsell7d: number;
	pricemedian: number;
	pricemedian24h: number;
	pricemedian7d: number;
	priceavg: number;
	priceavg24h: number;
	priceavg7d: number;
	pricesafe: number;
	pricemin: number;
	pricemax: number;
	buyorderprice: number;
	sold24h: number;
	sold7d: number;
	offervolume: number;
}

export interface Range {
	min: number;
	max: number;
	name: string;
}

export interface FinalItem {
	count: number;
	name: SkinInfo["name"];
	min_float: SkinInfo["min_float"];
	max_float: SkinInfo["max_float"];
	stattrak: SkinInfo["stattrak"];
	image: SkinInfo["image"];
	float_category: SkinInfo["float_category"];
	steamurl: SkinPrice["steamurl"];
	prices: SkinInfo["prices"];
	unstable: SkinPrice["unstable"];
	output_float: number;
	volume24h: number;
}

export interface Tradeup {
	availability: number;
	collection: string;
	rarity: string;
	expected_value: number | null;
	profit_chance: number;
	max_required_float: number;
	inputs: SkinInfo[] | FinalItem[];
	outcomes: SkinInfo[] | FinalItem[] | null;
}
