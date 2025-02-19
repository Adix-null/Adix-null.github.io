<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import TradeupSlot from './components/TradeupSlot.vue';
import Navbar from './components/Navbar.vue';
import Footer_info from './components/Footer.vue'
import Dropdown from './components/Dropdown.vue';
import SliderRange from './components/SliderRange.vue';
import FloatConditionButtons from './components/FloatConditionButtons.vue';
import RarityOptions from './components/RarityOptions.vue';
import TradeupTableLabels from './components/TradeupTableLabels.vue';

import { type Tradeup, type Range, type Prices, rarityDictionary } from '../tradeuptracker/types.ts';

const tradeups = ref<Tradeup[]>([]);
const tradeupsQueried = ref<Tradeup[]>([]);

const condFloatMin = ref(0);
const condFloatMax = ref(1);
const raritesChosen = ref<String[]>([]);
const collectionChosen = ref<String>("");
const selectedPriceOption = "pricelatest";

const floatSliderMin = ref(0);
const floatSliderMax = ref(1);
const priceSliderMin = ref(0);
const priceSliderMax = ref(100);
const profitSliderMin = ref(0);
const profitSliderMax = ref(100);
const chanceSliderMin = ref(0);
const chanceSliderMax = ref(100);
const availabilitySliderMin = ref(0);
const availabilitySliderMax = ref(100);
const liquiditySliderMin = ref(0);
const liquiditySliderMax = ref(100);

const tableLabels: String[] = ['Rarity', 'Item Name', 'Outcomes', 'Price', 'Profit', 'Profit Chance', 'Float', 'Availability', '24h Volume'];

const priceOptions = ref<string[]>(['latest', 'average', 'median']);

const collectionOptions = ref<string[]>(['Any', 'The eSports Summer 2014 collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection']);

onMounted(async () => {
  try {
    const response = await fetch('/tradeuptest.json');
    const data = await response.json();
    tradeups.value = data.slice(0, 300);
    tradeupsQueried.value = tradeups.value;
  } catch (error) {
    console.error('Failed to load JSON:', error);
  }
});

const onChosenRarity = (rarities: String[]) => {
  raritesChosen.value = rarities;
};

const onSetFloat = (floatSliderMin: number, floatSliderMax: number) => {
  condFloatMin.value = floatSliderMin;
  condFloatMax.value = floatSliderMax;
};

const sortState = ref<{ index: number; direction: number }>({ index: -1, direction: 0 });
const onSort = (index: number, state: number) => {
  sortState.value = { index, direction: state };
  sortTradeups(tradeupsQueried);
};

const sortTradeups = (tradeupList: Ref<Tradeup[]>) => {
  if (sortState.value.direction === 0) return tradeupList.value; // Neutral state

  tradeupList.value = [...tradeupList.value].sort((a, b) => {
    const fieldMapA = [
      rarityDictionary[a.rarity],
      a.inputs[0].name,
      a.outcomes!.length,
      a.inputs[0].prices[selectedPriceOption],
      a.expected_value!,
      a.profit_chance,
      a.max_required_float,
      a.availability,
      a.inputs[0].volume24h];

    const fieldMapB = [
      rarityDictionary[b.rarity],
      b.inputs[0].name,
      b.outcomes!.length,
      b.inputs[0].prices[selectedPriceOption],
      b.expected_value!,
      b.profit_chance,
      b.max_required_float,
      b.availability,
      b.inputs[0].volume24h];

    if (sortState.value.direction === 1)
      return fieldMapA[sortState.value.index] < fieldMapB[sortState.value.index] ? 1 : -1;
    else if (sortState.value.direction === -1)
      return fieldMapA[sortState.value.index] > fieldMapB[sortState.value.index] ? 1 : -1;
    else
      return 0;
  });
};


const onSubmitQuery = () => {
  tradeupsQueried.value = tradeups.value;

  tradeupsQueried.value = tradeupsQueried.value.filter(tradeup => {
    let include = true;

    if (tradeup.max_required_float > floatSliderMax.value || tradeup.max_required_float < floatSliderMin.value) {
      return false;
    }
    if (!(raritesChosen.value.includes("Any") || raritesChosen.value.length === 0)) {
      return raritesChosen.value.includes(tradeup.rarity);
    }

    return true;
  });

  sortTradeups(tradeupsQueried);

}
</script>

<template>
  <Navbar id="navbar" />

  <div id="main">
    <div id="filter">
      <form class="category" id="updateButtons">
        <button type="reset" class="coloredButton">Reset</button>
        <button type="button" class="coloredButton" @click="onSubmitQuery">Search</button>
      </form>

      <form class="category">
        <label for="search_name">Item Name</label>
        <br />
        <input type="text" id="search_name" name="search_name">
        <input type="checkbox" id="stattrak_cb">StatTrak™</input>
      </form>

      <div class="category">
        <label>Float needed</label>
        <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="floatSliderMin"
          v-model:max-value="floatSliderMax" v-model:set-min="condFloatMin" v-model:set-max="condFloatMax" />
        <FloatConditionButtons :float-slider-min="floatSliderMin" :float-slider-max="floatSliderMax"
          @updateFloatSlider="onSetFloat" />
      </div>

      <div class="category">
        <label>Collection</label>
        <Dropdown :options="collectionOptions" :default="0" />
      </div>

      <div id="search_rarities" class="category">
        <label>Rarity</label>
        <RarityOptions @rarities-chosen="onChosenRarity" />
      </div>

      <br />
      <div id="search_price" class="category">
        <label>Price</label>
        <Dropdown :options="priceOptions" :default="0" />
        <SliderRange :min="0" :max="100" :step="0.01" v-model:min-value="priceSliderMin"
          v-model:max-value="priceSliderMax" />
      </div>

      <div id="profit_search" class="category">
        <label>Profit</label>
        <input type="checkbox" id="checkbox_pc">Percent</input>
        <SliderRange :min="0" :max="100" :step="0.01" v-model:min-value="profitSliderMin"
          v-model:max-value="profitSliderMax" />
      </div>

      <div class="category">
        <label>Profit Chance</label>
        <SliderRange :min="0" :max="100" :step="1" v-model:min-value="chanceSliderMin"
          v-model:max-value="chanceSliderMax" />
      </div>

      <div class="category">
        <label>Availability</label>
        <SliderRange :min="0" :max="100" :step="0.1" v-model:min-value="availabilitySliderMin"
          v-model:max-value="availabilitySliderMax" />
      </div>

      <div class="category">
        <label>Liquidity</label>
        <SliderRange :min="0" :max="100" :step="1" v-model:min-value="liquiditySliderMin"
          v-model:max-value="liquiditySliderMax" />
      </div>
    </div>

    <div id="item-view">
      <div id="item-table-labels">
        <TradeupTableLabels :labels="tableLabels" @toggle="onSort" />
      </div>

      <div id="item-list">
        <TradeupSlot v-for="(tradeup, index) in tradeupsQueried" :key="index" :even="(index % 2) == 0"
          :tradeup="tradeup" :selectedPrice="selectedPriceOption" />
      </div>
    </div>
  </div>

  <Footer_info id="footer" />

</template>

<style scoped>
#main {
  display: flex;
  flex-direction: row;
  width: 80%;
  padding: 1em 0em 3em 0em
}

#filter {
  min-width: fit-content;
  height: 100%;
  padding: 0em 1em;
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: left;
  border-right: 2px solid var(--text-color-main);
}

.category {
  margin-top: 1.5em;
  width: 100%;
}

.category>label {
  font-size: 1.5em;
}

#updateButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

input[type=checkbox] {
  margin-left: 1em;
}

#search_price>* {
  display: inline;
}

#search_price>label {
  margin-right: 0.5em;
}

#item-view {
  width: 100%;
  min-width: 750px;
  flex-grow: 0;
  display: block;
  grid-auto-rows: min-content;
  padding-left: 1em;
}


#item-table-labels>*,
#item-list {
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

#item-list {
  display: grid;
  grid-template-rows: auto 1fr;
}

#item-list>* {
  display: contents;
}

#footer {
  margin-top: auto;
}
</style>