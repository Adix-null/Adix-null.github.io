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

export const priceTypeNames: string[] = [
	"pricelatest",
	"pricelatestsell",
	"pricelatestsell24h",
	"pricelatestsell",
	"pricemedian",
	"pricemedian24h",
	"pricemedian7d",
	"priceavg",
	"priceavg24h",
	"priceavg7d",
	"pricesafe",
	"pricemin",
	"pricemax",
	"buyorderprice",
];

export const collectionNames: string[] = [
	"The Kilowatt Collection", //"set_community_33",
	"The Revolution Collection", //"set_community_32",
	"The Recoil Collection", //"set_community_31",
	"The Dreams & Nightmares Collection", //"set_community_30",
	"The Operation Riptide Collection", //"set_community_29",
	"The Snakebite Collection", //"set_community_28",
	"The Operation Broken Fang Collection", //"set_community_27",
	"The Fracture Collection", //"set_community_26",
	"The Prisma 2 Collection", //"set_community_25",
	"The CS20 Collection", //"set_community_24",
	"The Shattered Web Collection", //"set_community_23",
	"The Prisma Collection", //"set_community_22",
	"The Danger Zone Collection", //"set_community_21",
	"The Horizon Collection", //"set_community_20",
	"The Clutch Collection", //"set_community_19",
	"The Spectrum 2 Collection", //"set_community_18",
	"The Operation Hydra Collection", //"set_community_17",
	"The Spectrum Collection", //"set_community_16",
	"The Glove Collection", //"set_community_15",
	"The Gamma 2 Collection", //"set_gamma_2",
	"The Gamma Collection", //"set_community_13",
	"The Chroma 3 Collection", //"set_community_12",
	"The Wildfire Collection", //"set_community_11",
	"The Revolver Case Collection", //"set_community_10",
	"The Shadow Collection", //"set_community_9",
	"The Falchion Collection", //"set_community_8",
	"The Chroma 2 Collection", //"set_community_7",
	"The Chroma Collection", //"set_community_6",
	"The Vanguard Collection", //"set_community_5",
	"The Breakout Collection", //"set_community_4",
	"The Huntsman Collection", //"set_community_3",
	"The Phoenix Collection", //"set_community_2",
	"The Winter Offensive Collection", //"set_community_1",
	"The eSports 2014 Summer Collection", //"set_esports_iii",
	"The eSports 2013 Winter Collection", //"set_esports_ii",
	"The eSports 2013 Collection", //"set_esports",
	"The Arms Deal 3 Collection", //"set_weapons_iii",
	"The Arms Deal 2 Collection", //"set_weapons_ii",
	"The Arms Deal Collection", //"set_weapons_i",
	"The Bravo Collection", //"set_bravo_i",
	"The Anubis Collection", //"set_anubis",
	"The 2021 Vertigo Collection", //"set_vertigo_2021",
	"The Mirage Collection", //"set_mirage_2021",
	"The 2021 Dust 2 Collection", //"set_dust_2_2021",
	"The 2021 Train Collection", //"set_train_2021",
	"The Ancient Collection", //"set_op10_ancient",
	"The Control Collection", //"set_op10_ct",
	"The Havoc Collection", //"set_op10_t",
	"The Norse Collection", //"set_norse",
	"The Canals Collection", //"set_canals",
	"The St. Marc Collection", //"set_stmarc",
	"The 2018 Inferno Collection", //"set_inferno_2",
	"The 2018 Nuke Collection", //"set_nuke_2",
	"The Gods and Monsters Collection", //"set_gods_and_monsters",
	"The Chop Shop Collection", //"set_chopshop",
	"The Rising Sun Collection", //"set_kimono",
	"The Cache Collection", //"set_cache",
	"The Overpass Collection", //"set_overpass",
	"The Cobblestone Collection", //"set_cobblestone",
	"The Baggage Collection", //"set_baggage",
	"The Bank Collection", //"set_bank",
	"The Dust 2 Collection", //"set_dust_2",
	"The Train Collection", //"set_train",
	"The 2021 Mirage Collection", //"set_mirage",
	"The Italy Collection", //"set_italy",
	"The Lake Collection", //"set_lake",
	"The Safehouse Collection", //"set_safehouse",
	"The Alpha Collection", //"set_bravo_ii",
	"The Dust Collection", //"set_dust",
	"The Aztec Collection", //"set_aztec",
	"The Vertigo Collection", //"set_vertigo",
	"The Inferno Collection", //"set_inferno",
	"The Militia Collection", //"set_militia",
	"The Nuke Collection", //"set_nuke",
	"The Office Collection", //"set_office",
	"The Assault Collection", //"set_assault",
];

export const raritiesOrder: string[] = [
	"Consumer Grade",
	"Industrial Grade",
	"Mil-Spec Grade",
	"Restricted",
	"Classified",
	"Covert",
];

export const tableLabels: string[] = [
	"Rarity",
	"Item Name",
	"Outcomes",
	"Price",
	"Profit",
	"Profit Chance",
	"Float",
	"Availability",
	"24h Volume",
];

export const rarityDictionary: Record<string, number> = Object.fromEntries(
	raritiesOrder.map((rarity: string, index: number) => [rarity, index])
);

export const ranges: Range[] = [
	{ min: 0.0, max: 0.07, name: "Factory New" },
	{ min: 0.07, max: 0.15, name: "Minimal Wear" },
	{ min: 0.15, max: 0.38, name: "Field-Tested" },
	{ min: 0.38, max: 0.45, name: "Well-Worn" },
	{ min: 0.45, max: 1.0, name: "Battle-Scarred" },
];

export const shorthandKeys = ["FN", "MW", "FT", "WW", "BS"] as const;

export const rangeDictionaryShortNames: Record<(typeof shorthandKeys)[number], Range> = Object.fromEntries(
	shorthandKeys.map((key, index) => [key, ranges[index]])
) as Record<(typeof shorthandKeys)[number], Range>;

const colors = ["b0c3d9", "5e98d9", "4b69ff", "8847ff", "d32ce6", "eb4b4b"];
export const stattrakColor = "#cf6a32";

export const RarityColorDictionary: Record<string, string> = Object.fromEntries(
	raritiesOrder.map((rarity, index) => [rarity, colors[index]])
);
