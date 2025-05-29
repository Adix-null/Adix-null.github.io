// deno-lint-ignore-file no-explicit-any

import {
	SkinInfo,
	SkinPrice,
	Prices,
	Range,
	FinalItem,
	Tradeup,
	priceTypeNames,
	raritiesOrder,
	ranges,
} from "./types.ts";

const STEAMWEBAPI_KEY = Deno.args[0];
let fetch_web: boolean = true;

if (!STEAMWEBAPI_KEY) {
	fetch_web = false;
	console.error("Missing Steam web API Key");
}

const priceUrl: URL = new URL(
	"https://www.steamwebapi.com/steam/api/items?key=" +
		STEAMWEBAPI_KEY +
		"&sort_by=name&item_group=rifle,sniper+rifle,machinegun,pistol,smg,shotgun,equipment"
);
const pricePath: URL = new URL("./items.json", import.meta.url);
const infoUrl: URL = new URL("https://bymykel.github.io/CSGO-API/api/en/skins.json");
const infoPath: URL = new URL("./skins.json", import.meta.url);
const tradeupPath: URL = new URL("../public/tradeups.json", import.meta.url);

const epsilon: number = 0.000001;
const fee: number = 13;

const price_type: string = priceTypeNames[0];

processItems();

async function processItems() {
	try {
		const start: number = Date.now();
		let priceData: SkinPrice[];
		let skinsData: SkinInfo[];

		if (fetch_web) priceData = await saveUrlToJSON(priceUrl, pricePath);
		priceData = await readJSON(pricePath);
		console.log("Price read");

		if (fetch_web) skinsData = await saveUrlToJSON(infoUrl, infoPath);
		skinsData = await readJSON(infoPath);
		console.log("Info read");

		let GroupedInfo: any = groupItemsByCollection(skinsData);
		console.log("Gruouped by collection info");
		GroupedInfo = groupItemsByRarity(GroupedInfo)
			.filter((collection) => collection.rarities.size > 1)
			.sort((a, b) => a.collectionName.localeCompare(b.collectionName));
		console.log("Gruouped by rarity info");

		let groupedPrices: any = groupPricesByCollection(priceData);
		console.log("Gruouped by collection price");
		groupedPrices = groupPricesByRarity(groupedPrices)
			.filter((collection) => collection.rarities.size > 1)
			.sort((a, b) => a.collectionName.localeCompare(b.collectionName));
		console.log("Gruouped by rarity price");

		GroupedInfo = expandItemsByFloatRanges(GroupedInfo);
		console.log("Expanded float");
		GroupedInfo = generateStattrakCollections(GroupedInfo);
		console.log("Generated starttrak");
		GroupedInfo = insertPriceInfo(GroupedInfo, groupedPrices);
		console.log("Insetred price");

		let tradeupList: any = calculateTradeupRequirements(GroupedInfo);
		console.log("Tradeup max req float");
		tradeupList = findCheapestItem(tradeupList, GroupedInfo);
		console.log("Cheapest item");
		tradeupList = calculateTradeupOutcomes(tradeupList, GroupedInfo);
		console.log("Tradeup outcomes");
		tradeupList = calculateExpectedValue(tradeupList).sort((a, b) => b.expected_value - a.expected_value);
		console.log("Expected value");

		await Deno.writeTextFile(tradeupPath, JSON.stringify(tradeupList));
		//await Deno.writeTextFile(tradeupPathTest, JSON.stringify(tradeupList.slice(0, 300)));
		console.log("Data written successfully");

		const timestamp = new Date().toISOString();
		const content = `export const lastUpdated = "${timestamp}";\n`;
		await Deno.writeTextFile("tradeuptracker/lastUpdated.ts", content);
		console.log("Updated timestamp:", timestamp);

		console.log((Date.now() - start) / 1000 + "s");
	} catch (error) {
		console.error("Error processing items:", error);
	}
}

//web info logic

async function readJSON(filePath: URL): Promise<any> {
	try {
		const data = await Deno.readTextFile(filePath);
		return JSON.parse(data);
	} catch (error) {
		console.error("Error reading file:", error);
		throw error;
	}
}

async function fetchJSON(url: URL) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		console.error(`Error loading ${url}:`, error);
		throw error;
	}
}

async function saveUrlToJSON(url: URL, fileURL: URL): Promise<any> {
	try {
		console.log("fetching url...");
		const data = await fetchJSON(url);
		const jsonString = JSON.stringify(data, null, 2); // Pretty-print JSON

		await Deno.writeTextFile(fileURL, jsonString);

		console.log(`Data from ${url} has been saved to ${fileURL}`);
	} catch (error) {
		console.error(`Error saving data from ${url} to ${fileURL}:`, error);
		throw error;
	}
}

//items info logic

function groupItemsByCollection(data: SkinInfo[]): { [collectionName: string]: SkinInfo[] } {
	const groups: { [collectionName: string]: SkinInfo[] } = {};
	data.forEach((item: SkinInfo) => {
		if (item.name[0] != "★") {
			const collectionName = item.collections[0]?.name;
			if (!collectionName) return; // Skip if no collection exists

			if (!groups[collectionName]) {
				groups[collectionName] = [];
			}
			groups[collectionName].push(item);
		}
	});

	return groups;
}

function groupPricesByCollection(data: SkinPrice[]): { [collectionName: string]: SkinPrice[] } {
	const groups: { [collectionName: string]: SkinPrice[] } = {};
	data.forEach((item: SkinPrice) => {
		const collectionName = item.tag7;
		if (!collectionName) return; // Skip if no collection exists

		if (!groups[collectionName]) {
			groups[collectionName] = [];
		}
		groups[collectionName].push(item);
	});

	return groups;
}

interface GroupedRaritiesInfo {
	collectionName: string;
	rarities: Map<string, SkinInfo[]>;
}

interface GroupedRaritiesPrice {
	collectionName: string;
	rarities: Map<string, SkinPrice[]>;
}

function groupItemsByRarity(groups: { [collectionName: string]: SkinInfo[] }): GroupedRaritiesInfo[] {
	return Object.entries(groups).map(([name, items]) => {
		// Bin items by rarity
		const rarities: { [rarityName: string]: SkinInfo[] } = items.reduce((bins, item) => {
			const rarityName: string = item.rarity.name;
			if (!bins[rarityName]) {
				bins[rarityName] = [];
			}
			bins[rarityName].push(item);
			return bins;
		}, {} as { [rarityName: string]: SkinInfo[] });

		// Sort the rarities based on raritiesOrder
		const sortedRarities: Map<string, SkinInfo[]> = new Map(
			Object.keys(rarities)
				.sort((a, b) => raritiesOrder.indexOf(a) - raritiesOrder.indexOf(b))
				.map((key) => [key, rarities[key]])
		);

		return {
			collectionName: name,
			rarities: sortedRarities,
		};
	});
}

function groupPricesByRarity(groups: { [collectionName: string]: SkinPrice[] }): GroupedRaritiesPrice[] {
	return Object.entries(groups).map(([name, items]) => {
		// Bin items by rarity
		const rarities: { [rarityName: string]: SkinPrice[] } = items.reduce((bins, item) => {
			const rarityName: string = item.rarity;
			if (!bins[rarityName]) {
				bins[rarityName] = [];
			}
			bins[rarityName].push(item);
			return bins;
		}, {} as { [rarityName: string]: SkinPrice[] });

		// Sort the rarities based on raritiesOrder
		const sortedRarities: Map<string, SkinPrice[]> = new Map(
			Object.keys(rarities)
				.sort((a, b) => raritiesOrder.indexOf(a) - raritiesOrder.indexOf(b))
				.map((key) => [key, rarities[key]])
		);

		return {
			collectionName: name,
			rarities: sortedRarities,
		};
	});
}

function expandItemsByFloatRanges(collections: GroupedRaritiesInfo[]): GroupedRaritiesInfo[] {
	return collections.map((collection) => ({
		...collection,
		rarities: new Map(
			[...collection.rarities.entries()].map(([rarity, items]) => [
				rarity,
				items.flatMap((item) => {
					return ranges
						.filter((range: Range) => item.max_float > range.min && item.min_float < range.max)
						.map((range) => ({
							...item,
							name: item.name + " (" + range.name + ")",
							float_category: range.name,
						}));
				}),
			])
		),
	}));
}

function generateStattrakCollections(collections: GroupedRaritiesInfo[]): GroupedRaritiesInfo[] {
	return collections.flatMap((collection) => {
		const firstRarity: SkinInfo[] = [...collection.rarities.entries()][0][1];
		const hasStatTrak: boolean = firstRarity?.[0]?.stattrak || false;

		// Generate normal collection
		const regularCollection = {
			...collection,
			rarities: new Map(
				[...collection.rarities.entries()].map(([rarityName, items]) => [
					rarityName,
					items.map((item) => ({
						...item,
						souvenir: false,
						stattrak: false,
					})),
				])
			),
		};

		if (!hasStatTrak) return [regularCollection];

		// Generate stattrak collection
		const statTrakCollection = {
			...collection,
			collectionName: collection.collectionName + " StatTrak™",
			rarities: new Map(
				[...collection.rarities.entries()].map(([rarityName, items]) => [
					rarityName,
					items.map((item) => ({
						...item,
						souvenir: false,
						stattrak: true,
						name: "StatTrak™ " + item.name,
					})),
				])
			),
		};

		return [regularCollection, statTrakCollection];
	});
}

function insertPriceInfo(collections: GroupedRaritiesInfo[], priceData: GroupedRaritiesPrice[]) {
	return collections.map((collection) => ({
		...collection,
		rarities: new Map(
			[...collection.rarities.entries()].map(([rarityName, items]) => [
				rarityName,
				items.map((item) => {
					const collection = priceData.find((c) => c.collectionName === item.collections[0]?.name);
					if (!collection) return undefined;

					const rarityGroup = collection.rarities.get(item.rarity.name);
					if (!rarityGroup) return undefined;

					const priceInfo: SkinPrice | undefined = rarityGroup.find((skin) => skin.markethashname === item.name);

					const prices: Prices = {
						pricelatest: priceInfo?.pricelatest ?? 0,
						pricelatestsell: priceInfo?.pricelatestsell ?? 0,
						pricelatestsell24h: priceInfo?.pricelatestsell24h ?? 0,
						pricelatestsell7d: priceInfo?.pricelatestsell7d ?? 0,

						pricemedian: priceInfo?.pricemedian ?? 0,
						pricemedian24h: priceInfo?.pricemedian24h ?? 0,
						pricemedian7d: priceInfo?.pricemedian7d ?? 0,

						priceavg: priceInfo?.priceavg ?? 0,
						priceavg24h: priceInfo?.priceavg24h ?? 0,
						priceavg7d: priceInfo?.priceavg7d ?? 0,

						pricesafe: priceInfo?.pricesafe ?? 0,
						pricemin: priceInfo?.pricemin ?? 0,
						pricemax: priceInfo?.pricemax ?? 0,

						buyorderprice: priceInfo?.buyorderprice ?? 0,
						sold24h: priceInfo?.sold24h ?? 0,
						sold7d: priceInfo?.sold7d ?? 0,
						offervolume: priceInfo?.offervolume ?? 0,
					};
					return {
						...item,
						prices: prices,
						steamurl: priceInfo?.steamurl,
						volume24h: priceInfo?.sold24h ?? 0,
						unstable: priceInfo?.unstable,
					};
				}),
			])
		),
	}));
}

//tradeup logic

function calculateTradeupRequirements(
	collections: GroupedRaritiesInfo[]
): { max_required_float: number; collection: string; rarity: string | null }[] {
	const tradeupRequirements: { max_required_float: number; collection: string; rarity: string | null }[] = [];

	Object.values(collections).forEach((collection) => {
		const rarities = [...collection.rarities.entries()];

		rarities.forEach(([rarity, items], index) => {
			const indexName = raritiesOrder.indexOf(rarity);
			const prevRarity = indexName > 0 && indexName < raritiesOrder.length ? raritiesOrder[indexName - 1] : null;

			// Skip if this is the lowest rarity
			if (!prevRarity) return;
			if (index === 0) return;

			const requiredFloats = new Set<number>();

			items.forEach((item) => {
				const qualityFloat = ranges.find((range) => range.name === item.float_category)?.max ?? 0;
				const { min_float, max_float } = item;
				const maxRequiredFloat = (Math.min(qualityFloat, max_float) - min_float) / (max_float - min_float);
				requiredFloats.add(maxRequiredFloat);
			});

			[...requiredFloats]
				.sort((a, b) => b - a) // Descending order
				.forEach((floatValue) => {
					tradeupRequirements.push({
						max_required_float: floatValue,
						collection: collection.collectionName,
						rarity: prevRarity,
					});
				});
		});
	});

	const uniqueItems: { max_required_float: number; collection: string; rarity: string | null }[] = [];
	const seenHashes = new Set<string>();

	tradeupRequirements.forEach((item) => {
		const hash = JSON.stringify(item);

		if (!seenHashes.has(hash)) {
			seenHashes.add(hash);
			uniqueItems.push(item);
		}
	});

	return uniqueItems;
}

function findCheapestItem(
	tradeups: { collection: string; rarity: string; max_required_float: number }[],
	groupedItems: GroupedRaritiesInfo[]
): (Tradeup | null)[] {
	const bestTradeupItems: (Tradeup | null)[] = tradeups.map((tradeup) => {
		const { collection, rarity, max_required_float } = tradeup;

		const matchingCollection = groupedItems.find((col) => col.collectionName === collection);
		if (!matchingCollection) return null;

		const itemsOfRarity = matchingCollection.rarities.get(rarity);
		if (!itemsOfRarity) return null;

		const matchingItems = itemsOfRarity.filter((item) => {
			const floatRange = ranges.find((range) => range.name === item.float_category);
			return floatRange && max_required_float > floatRange.min;
		});

		const cheapestItem = matchingItems.reduce<SkinInfo | null>(
			(minItem, item) => (!minItem || item.prices[price_type] < minItem.prices[price_type] ? item : minItem),
			null
		);

		if (!cheapestItem) return null;

		let max_required_float_correct = max_required_float;
		const floatRange: Range = ranges.find((range) => range.name === cheapestItem.float_category)!;
		if (max_required_float < floatRange.min || max_required_float > floatRange.max) {
			max_required_float_correct = Math.min(floatRange.max, cheapestItem.max_float);
		}

		max_required_float_correct -= epsilon;
		const rangeScarcity = ranges.find(
			(range) => max_required_float_correct > range.min && max_required_float_correct <= range.max
		);
		const floatScarcity: number =
			(100 * (max_required_float_correct - (rangeScarcity?.min ?? 0))) / (rangeScarcity?.max ?? 1);

		return {
			...tradeup,
			max_required_float: max_required_float_correct,
			availability: Math.trunc(floatScarcity * 10) / 10, //round to 1 place after decimal
			inputs: [cheapestItem],
			outcomes: null,
			expected_value: 0,
			profit_chance: -1,
		};
	});

	const uniqueItems: Tradeup[] = [];
	const seenHashes = new Set<string>();

	bestTradeupItems.forEach((item) => {
		if (item === null) return;
		const hash = JSON.stringify(item);

		if (!seenHashes.has(hash)) {
			seenHashes.add(hash);
			uniqueItems.push(item);
		}
	});

	return uniqueItems;
}

function calculateTradeupOutcomes(tradeups: Tradeup[], groupedItems: GroupedRaritiesInfo[]): Tradeup[] {
	return tradeups.map((tradeup) => {
		const { collection, rarity, max_required_float } = tradeup;

		// Get the next rarity in the rarities order
		const nextRarityIndex = raritiesOrder.indexOf(rarity) + 1;
		if (nextRarityIndex >= raritiesOrder.length) return tradeup; // Should never happen

		const nextRarity = raritiesOrder[nextRarityIndex];

		// Find the matching collection
		const matchingCollection = groupedItems.find((col) => col.collectionName === collection);
		if (!matchingCollection) return tradeup;

		// Get possible outcomes for the next rarity
		const possibleOutcomes = matchingCollection.rarities.get(nextRarity) || [];

		const validOutcomes = possibleOutcomes
			.map((skin) => {
				const expectedFloat = max_required_float * (skin.max_float - skin.min_float) + skin.min_float;

				// Get the float category from the range dictionary
				const floatCategory = ranges.find((range) => range.name === skin.float_category);

				// Ensure the float is within the valid range
				if (!floatCategory) return null;
				if (expectedFloat < floatCategory.min || expectedFloat > floatCategory.max) return null;

				skin.output_float = expectedFloat.toFixed(6); // Keep precision
				return skin;
			})
			.filter((item) => item !== null);

		return {
			...tradeup,
			outcomes: validOutcomes as SkinInfo[], // Explicitly cast to SkinInfo[] to handle the non-null filtering
		};
	});
}

function calculateExpectedValue(tradeups: Tradeup[]) {
	return tradeups.map((tradeup) => {
		const profitBruto =
			tradeup.outcomes!.reduce((sum: number, outcome: SkinInfo | FinalItem) => sum + outcome.prices[price_type], 0) /
			tradeup.outcomes!.length;
		const expectedValue = 10 * -tradeup.inputs[0].prices[price_type] + profitBruto * (1 - fee * 0.01);
		const chanceToProfit: number =
			(100 *
				tradeup.outcomes!.reduce(
					(sum: number, outcome: SkinInfo | FinalItem) =>
						sum + (outcome.prices[price_type] * (1 - fee * 0.01) > 10 * tradeup.inputs[0].prices[price_type] ? 1 : 0),
					0
				)) /
			tradeup.outcomes!.length;

		const input: FinalItem = {
			count: 10,
			name: tradeup.inputs[0].name,
			min_float: tradeup.inputs[0].min_float,
			max_float: tradeup.inputs[0].max_float,
			stattrak: tradeup.inputs[0].stattrak,
			image: tradeup.inputs[0].image,
			float_category: tradeup.inputs[0].float_category,
			steamurl: tradeup.inputs[0].steamurl,
			prices: tradeup.inputs[0].prices,
			unstable: tradeup.inputs[0].unstable,
			volume24h: tradeup.inputs[0].volume24h,
			output_float: -1,
		};

		const outcomes = tradeup.outcomes!.map((outcome) => {
			return {
				name: outcome.name,
				min_float: outcome.min_float,
				max_float: outcome.max_float,
				stattrak: outcome.stattrak,
				image: outcome.image,
				float_category: outcome.float_category,
				steamurl: outcome.steamurl,
				prices: outcome.prices,
				unstable: outcome.unstable,
				output_float: outcome.output_float,
			};
		});

		return {
			max_required_float: Math.min(tradeup.max_required_float, tradeup.inputs[0].max_float),
			collection: tradeup.collection,
			rarity: tradeup.rarity,
			availability: tradeup.availability,
			inputs: [input],
			expected_value: expectedValue,
			profit_chance: chanceToProfit,
			outcomes: outcomes,
		};
	});
}
