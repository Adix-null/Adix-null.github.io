const priceUrl =
    "https://www.steamwebapi.com/steam/api/items?key=72ZDY58DKG0WJNJ4&sort_by=name&item_group=rifle,sniper+rifle,machinegun,pistol,smg,shotgun,equipment";
const pricePath = new URL("./items.json", import.meta.url);
const infoUrl = "https://bymykel.github.io/CSGO-API/api/en/skins.json";
const infoPath = new URL("./skins.json", import.meta.url);
const tradeupPath = new URL("./tradeups.json", import.meta.url);

//deno run--allow - read--allow - write--allow - net tradeuptracker / logic.js

const rangeDictionary = [
    { min: 0.0, max: 0.07, name: "Factory New" },
    { min: 0.07, max: 0.15, name: "Minimal Wear" },
    { min: 0.15, max: 0.38, name: "Field-Tested" },
    { min: 0.38, max: 0.45, name: "Well-Worn" },
    { min: 0.45, max: 1.0, name: "Battle-Scarred" },
];
const raritiesOrder = ["Consumer Grade", "Industrial Grade", "Mil-Spec Grade", "Restricted", "Classified", "Covert"];
const delta = 0.000001;
const fee = 13;
const priceTypeNames = [
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
const price_type = priceTypeNames[10];

processItems();

async function processItems() {
    try {
        const priceData = await saveUrlToJSON(priceUrl, pricePath);
        const skinsData = await saveUrlToJSON(infoUrl, infoPath);
        //const priceData = await readJSON(pricePath);
        console.log("Price read successful");
        //const skinsData = await readJSON(infoPath);
        console.log("Info read successful");

        let updatedItems = groupItemsByCollection(skinsData);
        updatedItems = groupItemsByRarity(updatedItems)
            .filter((collection) => collection.rarities.size > 1)
            .sort((a, b) => a.collectionName.localeCompare(b.collectionName));

        updatedItems = expandItemsByFloatRanges(updatedItems);
        updatedItems = generateStattrakCollections(updatedItems);
        updatedItems = insertPriceInfo(updatedItems, priceData);

        let tradeupList = calculateTradeupRequirements(updatedItems);
        tradeupList = findCheapestItem(tradeupList, updatedItems);
        tradeupList = calculateTradeupOutcomes(tradeupList, updatedItems);
        tradeupList = calculateExpectedValue(tradeupList).sort((a, b) => b.expected_value - a.expected_value);

        await Deno.writeTextFile(tradeupPath, JSON.stringify(tradeupList));
        console.log("File written successfully!");
    } catch (error) {
        console.error("Error processing items:", error);
    }
}

//web info logic

async function readJSON(filePath) {
    try {
        const data = await Deno.readTextFile(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
}

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        throw error;
    }
}

async function saveUrlToJSON(url, fileURL) {
    try {
        const data = await fetchJSON(url);
        const jsonString = JSON.stringify(data, null, 2);  // Pretty-print JSON

        await Deno.writeTextFile(fileURL, jsonString);

        console.log(`Data from ${url} has been saved to ${filename}`);
    } catch (error) {
        console.error(`Error saving data from ${url} to ${filename}:`, error);
    }
}

//items info logic

function groupItemsByCollection(data) {
    const groups = {};
    data.forEach((item) => {
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

function groupItemsByRarity(groups) {
    return Object.entries(groups).map(([name, items]) => {
        // Bin items by rarity
        const rarities = items.reduce((bins, item) => {
            const rarityName = item.rarity.name;
            if (!bins[rarityName]) {
                bins[rarityName] = [];
            }
            bins[rarityName].push(item);
            return bins;
        }, {});

        // Sort the rarities based on raritiesOrder
        const sortedRarities = new Map(
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

function expandItemsByFloatRanges(collections) {
    return collections.map((collection) => ({
        ...collection,
        rarities: new Map(
            [...collection.rarities.entries()].map(([rarity, items]) => [
                rarity,
                items.flatMap((item) => {
                    return rangeDictionary
                        .filter((range) => item.max_float > range.min && item.min_float <= range.max)
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

function generateStattrakCollections(collections) {
    return collections.flatMap((collection) => {
        const firstRarity = [...collection.rarities.entries()][0][1];
        const hasStatTrak = firstRarity?.[0]?.stattrak || false;

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

function insertPriceInfo(collections, priceData) {
    return collections.map((collection) => ({
        ...collection,
        rarities: new Map(
            [...collection.rarities.entries()].map(([rarityName, items]) => [
                rarityName,
                items.map((item) => {
                    const priceInfo = priceData.find((p) => p.markethashname === item.name);
                    const prices = {
                        pricelatest: Math.max(priceInfo?.pricelatest, 0),
                        pricelatestsell: Math.max(priceInfo?.pricelatestsell, 0),
                        pricelatestsell24h: Math.max(priceInfo?.pricelatestsell24h, 0),
                        pricelatestsell: Math.max(priceInfo?.pricelatestsell7d, 0),

                        pricemedian: Math.max(priceInfo?.pricemedian, 0),
                        pricemedian24h: Math.max(priceInfo?.pricemedian24h, 0),
                        pricemedian7d: Math.max(priceInfo?.pricemedian7d, 0),

                        priceavg: Math.max(priceInfo?.priceavg, 0),
                        priceavg24h: Math.max(priceInfo?.priceavg24h, 0),
                        priceavg7d: Math.max(priceInfo?.priceavg7d, 0),

                        pricesafe: Math.max(priceInfo?.pricesafe, 0),
                        pricemin: Math.max(priceInfo?.pricemin, 0),
                        pricemax: Math.max(priceInfo?.pricemax, 0),

                        buyorderprice: Math.max(priceInfo?.buyorderprice, 0),
                        sold24h: Math.max(priceInfo?.sold24h, 0),
                        sold7d: Math.max(priceInfo?.sold7d, 0),
                        offervolume: Math.max(priceInfo?.offervolume, 0),
                    };
                    return {
                        ...item,
                        image: priceInfo?.itemimage,
                        steamurl: priceInfo?.steamurl,
                        prices: prices,
                        unstable: priceInfo?.unstable,
                    };
                }),
            ])
        ),
    }));
}

//tradeup logic

function calculateTradeupRequirements(collections) {
    const tradeupRequirements = [];

    Object.values(collections).forEach((collection) => {
        const rarities = [...collection.rarities.entries()];

        rarities.forEach(([rarity, items], index) => {
            const indexName = raritiesOrder.indexOf(rarity);
            const prevRarity = indexName > 0 && indexName < raritiesOrder.length ? raritiesOrder[indexName - 1] : null;

            // Skip if this is the lowest rarity
            if (!prevRarity) return;
            if (index === 0) return;

            const requiredFloats = new Set();

            items.forEach((item) => {
                const qualityFloat = rangeDictionary.find((range) => range.name === item.float_category).max;
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

    const uniqueItems = [];
    const seenHashes = new Set();

    tradeupRequirements.forEach((item) => {
        const hash = JSON.stringify(item);

        if (!seenHashes.has(hash)) {
            seenHashes.add(hash);
            uniqueItems.push(item);
        }
    });

    return uniqueItems;
}

function findCheapestItem(tradeups, groupedItems) {
    const bestTradeupItems = tradeups.map((tradeup) => {
        const { collection, rarity, max_required_float } = tradeup;

        const matchingCollection = groupedItems.find((col) => col.collectionName === collection);
        if (!matchingCollection) return null;

        const itemsOfRarity = matchingCollection.rarities.get(rarity);
        if (!itemsOfRarity) return null;

        const matchingItems = itemsOfRarity.filter((item) => {
            const floatRange = rangeDictionary.find((range) => range.name === item.float_category);
            return floatRange && max_required_float > floatRange.min;
        });

        const cheapestItem = matchingItems.reduce(
            (minItem, item) => (!minItem || item.prices[price_type] < minItem.prices[price_type] ? item : minItem),
            null
        );

        let max_required_float_correct = max_required_float;
        const floatRange = rangeDictionary.find((range) => range.name === cheapestItem.float_category);
        if (max_required_float < floatRange.min || max_required_float > floatRange.max) {
            max_required_float_correct = Math.min(floatRange.max, cheapestItem.max_float);
        }

        max_required_float_correct -= delta;
        const rangeScarcity = rangeDictionary.find(
            (range) => max_required_float_correct > range.min && max_required_float_correct <= range.max
        );
        const floatScarcity =
            (100 * (max_required_float_correct - rangeScarcity.min)) / (rangeScarcity.max - rangeScarcity.min);

        return cheapestItem
            ? {
                ...tradeup,
                max_required_float: max_required_float_correct,
                availability: floatScarcity.toFixed(1),
                input: cheapestItem,
            }
            : null;
    });

    const uniqueItems = [];
    const seenHashes = new Set();

    bestTradeupItems.forEach((item) => {
        const hash = JSON.stringify(item);

        if (!seenHashes.has(hash)) {
            seenHashes.add(hash);
            uniqueItems.push(item);
        }
    });

    return uniqueItems;
}

function calculateTradeupOutcomes(tradeups, groupedItems) {
    return tradeups.map((tradeup) => {
        const { collection, rarity, max_required_float, input } = tradeup;

        const nextRarityIndex = raritiesOrder.indexOf(rarity) + 1;
        if (nextRarityIndex >= raritiesOrder.length) return tradeup; //Should never happen

        const nextRarity = raritiesOrder[nextRarityIndex];

        const matchingCollection = groupedItems.find((col) => col.collectionName === collection);
        if (!matchingCollection) return tradeup;

        const possibleOutcomes = matchingCollection.rarities.get(nextRarity) || [];

        const validOutcomes = possibleOutcomes
            .map((skin) => {
                const expectedFloat = max_required_float * (skin.max_float - skin.min_float) + skin.min_float;

                const floatCategory = rangeDictionary.find((range) => range.name === skin.float_category);

                if (!floatCategory) return null;
                if (expectedFloat < floatCategory.min || expectedFloat > floatCategory.max) return null;

                skin.output_float = expectedFloat.toFixed(6); // Keep precision
                return skin;
            })
            .filter((item) => item !== null);

        return {
            ...tradeup,
            outcomes: validOutcomes,
        };
    });
}

function calculateExpectedValue(tradeups) {
    return tradeups.map((tradeup) => {
        const profitBruto = tradeup.outcomes.reduce((sum, outcome) => sum + outcome.prices[price_type], 0) / tradeup.outcomes.length;
        const expectedValue = 10 * -tradeup.input.prices[price_type] + profitBruto * (1 - fee * 0.01);

        const input = {
            count: 10,
            name: tradeup.input.name,
            min_float: tradeup.input.min_float,
            max_float: tradeup.input.max_float,
            stattrak: tradeup.input.stattrak,
            image: tradeup.input.image,
            float_category: tradeup.input.float_category,
            steamurl: tradeup.input.steamurl,
            prices: tradeup.input.prices,
            unstable: tradeup.input.unstable,
        };

        const outcomes = tradeup.outcomes.map((outcome) => {
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
            }
        });

        return {
            max_required_float: tradeup.max_required_float,
            collection: tradeup.collection,
            rarity: tradeup.rarity,
            availability: tradeup.availability,
            expected_value: expectedValue,
            inputs: input,
            outcomes: outcomes,
        };
    });
}
