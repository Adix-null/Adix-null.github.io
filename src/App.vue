<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import TradeupSlot from './components/TradeupSlot.vue';
import Navbar from './components/Navbar.vue';
import Footer_info from './components/Footer.vue'
import Dropdown from './components/Dropdown.vue';
import SliderRange from './components/SliderRange.vue';

import type { Tradeup, Range } from '../tradeuptracker/types.ts';

let tradeups: Tradeup[];

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

const selectedPriceOption = "pricelatest";


onMounted(async () => {
  const response = await fetch('../tradeuptracker/tradeuptest.json');
  tradeups = await response.json();
  tradeups = tradeups.slice(0, 20);
  //console.log(tradeups);
});

const setFloatBounds = (quality: string) => {
  floatSliderMin.value = rangeDictionary[quality].min;
  floatSliderMax.value = rangeDictionary[quality].max;
}

const collectionOptions = ref<string[]>(['Any', 'The eSports Summer 2014 collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection', 'The 2021 Overpass collection']);
const priceOptions = ref<string[]>(['latest', 'average', 'median']);
const rangeDictionary: Record<string, Range> = {
  "FN": { min: 0.0, max: 0.07, name: "Factory New" },
  "MW": { min: 0.07, max: 0.15, name: "Minimal Wear" },
  "FT": { min: 0.15, max: 0.38, name: "Field-Tested" },
  "WW": { min: 0.38, max: 0.45, name: "Well-Worn" },
  "BS": { min: 0.45, max: 1.0, name: "Battle-Scarred" }
}
</script>

<template>
  <Navbar id="navbar" />

  <div id="main">
    <div id="filter">
      <form class="category">
        <label for="search_name">Item Name</label>
        <br />
        <input type="text" id="search_name" name="search_name">
        <input type="checkbox" id="stattrak_cb">StatTrak™</input>
      </form>

      <div class="category">
        <label>Float needed</label>
        <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="floatSliderMin"
          v-model:max-value="floatSliderMax" />

        <div id="rarityButtons">
          <button @click="setFloatBounds('FN')">FN</button>
          <button @click="setFloatBounds('MW')">MW</button>
          <button @click="setFloatBounds('FT')">FT</button>
          <button @click="setFloatBounds('WW')">WW</button>
          <button @click="setFloatBounds('BS')">BS</button>
        </div>
      </div>

      <div class="category">
        <label>Collection</label>
        <Dropdown :options="collectionOptions" :default="0" />
      </div>

      <div id="search_rarities" class="category">
        <label>Rarity</label>
        <div><input type="checkbox" id="Any" checked="true">Any</input></div>
        <div><input type="checkbox" id="Classified">Classified</input></div>
        <div><input type="checkbox" id="Restricted">Restricted</input></div>
        <div><input type="checkbox" id="Mil-Spec Grade">Mil-Spec Grade</input></div>
        <div><input type="checkbox" id="Industrial Grade">Industrial Grade</input></div>
        <div><input type="checkbox" id="Consumer Grade">Consumer Grade</input></div>
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
        <div class="field">
          <p>Item Info</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>Outcomes</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>Price</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>Profit</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>Profit chance</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>Float</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>Availability</p>
          <button>▼</button>
        </div>
        <div class="field">
          <p>24h volume</p>
          <button>▼</button>
        </div>

      </div>
      <div id="item-list">
        <TradeupSlot v-for="(tradeup, index) in tradeups" :key="index" :even="(index % 2) == 0" :tradeup="tradeup"
          :selectedPrice="selectedPriceOption" />
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

#rarityButtons {
  display: none;

  margin-top: 0.5em;
  /* display: flex; */
  flex-direction: row;
  justify-content: space-around;
  text-align: center;
}

#rarityButtons>button {
  width: 100%;
  border: 1px solid var(--text-color-main);
}

#rarityButtons>button:hover {
  background-color: var(--background-color-hover);
}

.category {
  margin-top: 1.5em;
  width: 100%;
}

.category>label {
  font-size: 1.5em;
}

input[type=checkbox] {
  margin-left: 1em;
}

#checkbox_cb {
  margin-left: 1em;
}

#search_rarities {
  display: flex;
  flex-direction: column;
}

#search_rarities>* {
  display: inline;
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

#item-table-labels {
  display: grid;
  border-bottom: 2px solid white;
  font-size: 0.85em;
}

#item-table-labels,
#item-list {
  grid-template-columns: 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}

.field {
  display: flex;
  flex-direction: row;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field>p {
  margin-right: 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.field>button {
  height: auto;
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