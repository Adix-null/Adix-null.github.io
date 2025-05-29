<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import TradeupSlot from './components/TradeupSlot.vue';
import Navbar from './components/Navbar.vue';
import Footer_info from './components/Footer.vue'
import Dropdown from './components/Dropdown.vue';
import SliderRange from './components/SliderRange.vue';
import FloatConditionButtons from './components/FloatConditionButtons.vue';
import CheckBoxes from './components/Checkboxes.vue';
import TradeupTableLabels from './components/TradeupTableLabels.vue';
import PageNumber from './components/PageNumber.vue';

import { type Tradeup, rarityDictionary, raritiesOrder, collectionNames, priceTypeNames, tableLabels } from '../tradeuptracker/types.ts';

const tradeups = ref<Tradeup[]>([]);
const tradeupsQueried = ref<Tradeup[]>([]);

const searchName = ref<string>('');
const stattrakState = ref(true);
const normalState = ref(true);
const condFloatMin = ref(0);
const condFloatMax = ref(1);
const raritesChosen = ref<string[]>([]);
const collectionChosen = ref<string>('Any');
const selectedPriceOption = ref<string>(priceTypeNames[0]);
const profitPercent = ref(true);
const currentPage = ref(1);
const pageCount = ref(0);
const totalItems = ref(0);

const floatSliderMin = ref(0);
const floatSliderMax = ref(1);
const priceSliderMin = ref(0.1);
const priceSliderMax = ref(100);
const profitSliderMin = ref(0);
const profitSliderMax = ref(100);
const chanceSliderMin = ref(0);
const chanceSliderMax = ref(100);
const availabilitySliderMin = ref(0);
const availabilitySliderMax = ref(100);
const liquiditySliderMin = ref(0);
const liquiditySliderMax = ref(100);

const itemsPerPage = 30;
const tableLabelInfo: string[] = tableLabels;

onMounted(async () => {
  try {
    const response = await fetch('/tradeups.json');
    const data = await response.json();
    tradeups.value = data;
    tradeupsQueried.value = tradeups.value;
    onSubmitQuery();
  } catch (error) {
    console.error('Failed to load JSON:', error);
  }
});


watch(() => floatSliderMin.value, (newValue) => {
  condFloatMin.value = newValue;
});
watch(() => floatSliderMax.value, (newValue) => {
  condFloatMax.value = newValue;
});

const onChosenPage = (num: number) => {
  currentPage.value = num;
  onSubmitQuery();
};

const onChosenName = (options: string[]) => {
  normalState.value = false;
  stattrakState.value = false;

  if (options[0] === "*") {
    normalState.value = true;
    stattrakState.value = true;
  }
  else {
    if (options.includes("StatTrak")) {
      stattrakState.value = true;
    }
    if (options.includes("Normal")) {
      normalState.value = true;
    }
  }
};

const onChosenRarity = (options: string[]) => {
  raritesChosen.value = options;
};

const onChosenCollection = (option: string) => {
  collectionChosen.value = option;
};

const onChosenPriceType = (option: string) => {
  selectedPriceOption.value = option as string;
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
      a.inputs[0].prices[selectedPriceOption.value],
      a.expected_value!,
      a.profit_chance,
      a.max_required_float,
      a.availability,
      a.inputs[0].volume24h];

    const fieldMapB = [
      rarityDictionary[b.rarity],
      b.inputs[0].name,
      b.outcomes!.length,
      b.inputs[0].prices[selectedPriceOption.value],
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

const onSearch = () => {
  currentPage.value = 1;
  onSubmitQuery();
}

const onSubmitQuery = () => {
  tradeupsQueried.value = tradeups.value;
  sortTradeups(tradeupsQueried);

  tradeupsQueried.value = tradeupsQueried.value.filter(tradeup => {

    if (searchName.value && !tradeup.inputs[0].name.toLocaleLowerCase().includes(searchName.value.toLocaleLowerCase())) {
      return false;
    }

    if (normalState.value == false && tradeup.inputs[0].stattrak == false || stattrakState.value == false && tradeup.inputs[0].stattrak == true) {
      return false;
    }

    if (tradeup.max_required_float > floatSliderMax.value || tradeup.max_required_float < floatSliderMin.value) {
      return false;
    }

    if (collectionChosen.value && collectionChosen.value != "Any" && tradeup.collection.replace(" StatTrak™", "") != collectionChosen.value) {
      return false;
    }

    if (!(raritesChosen.value.includes("Any") || raritesChosen.value.length === 0)) {
      if (!raritesChosen.value.includes(tradeup.rarity)) {
        return false;
      }
    }

    if (tradeup.inputs[0].prices[selectedPriceOption.value] * 10 > priceSliderMax.value || tradeup.inputs[0].prices[selectedPriceOption.value] * 10 < priceSliderMin.value) {
      return false;
    }

    if (profitPercent.value && profitSliderMax.value < 100) {
      const profitPercentage = 10 * tradeup.expected_value! / tradeup.inputs[0].prices[selectedPriceOption.value];
      if (profitPercentage > profitSliderMax.value || profitPercentage < profitSliderMin.value) {
        return false;
      }
    }
    else {
      if (tradeup.expected_value! > profitSliderMax.value || tradeup.expected_value! < profitSliderMin.value) {
        return false;
      }
    }

    if (tradeup.profit_chance > chanceSliderMax.value || tradeup.profit_chance < chanceSliderMin.value) {
      return false;
    }

    if (tradeup.availability > availabilitySliderMax.value || tradeup.availability < availabilitySliderMin.value) {
      return false;
    }

    if (liquiditySliderMax.value < 100 && tradeup.inputs[0].volume24h > liquiditySliderMax.value || tradeup.inputs[0].volume24h < liquiditySliderMin.value) {
      return false;
    }

    return true;
  });

  totalItems.value = tradeupsQueried.value.length;
  pageCount.value = Math.floor(totalItems.value / itemsPerPage);
  tradeupsQueried.value = tradeupsQueried.value.slice(itemsPerPage * (currentPage.value - 1), Math.min(itemsPerPage * currentPage.value, totalItems.value));
}
</script>

<template>
  <Navbar id="navbar" />

  <div id="desktop-infobox">
    This site is best viewed on a desktop.
  </div>

  <div id="main">
    <div id="filter">
      <form class="category" id="update-buttons">
        <button type="submit" class="coloredButton">Reset</button>
        <button type="button" class="coloredButton" @click="onSearch">Search</button>
      </form>

      <form class="category">
        <label for="search-name">Item Name</label>
        <br />
        <input type="text" @keydown.enter.prevent="onSubmitQuery" v-model="searchName" id="search-name"
          name="search-name">
        <CheckBoxes v-on:['nameFieldChosen']="onChosenName" message="nameFieldChosen" :options="['Normal', 'StatTrak™']"
          :check-normals="true" />
      </form>

      <div class="category">
        <label>Float needed</label>
        <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value.number="floatSliderMin"
          v-model:max-value.number="floatSliderMax" v-model:set-min.number="condFloatMin"
          v-model:set-max.number="condFloatMax" />
        <FloatConditionButtons :float-slider-min="floatSliderMin" :float-slider-max="floatSliderMax"
          @updateFloatSlider="onSetFloat" />
      </div>

      <div class="category">
        <label>Collection</label>
        <Dropdown v-on:['collectionChosen']="onChosenCollection" message="collectionChosen"
          :options="(['Any', ...collectionNames.sort()])" :default="0" :v-model="collectionChosen" />
      </div>

      <div id="search_rarities" class="category">
        <label>Rarity</label>
        <CheckBoxes v-on:['raritiesChosen']="onChosenRarity" message="raritiesChosen" special="Any"
          :options="raritiesOrder.slice(0, -1).reverse()" :check-normals="false" />
      </div>

      <br />
      <div id="search-price" class="category">
        <label>Price</label>
        <Dropdown v-on:['onChosenPriceType']="onChosenPriceType" message="onChosenPriceType" :options="priceTypeNames"
          :default="0" :v-model:selected="selectedPriceOption" class="hide" />
        <SliderRange :min="0" :max="100" :step="0.01" v-model:min-value.number="priceSliderMin"
          v-model:max-value.number="priceSliderMax" />
      </div>

      <div id="profit_search" class="category">
        <label>Profit</label>
        <input type="checkbox" id="checkbox_pc" v-model="profitPercent">Percent</input>
        <SliderRange :min="-100" :max="100" :step="0.01" v-model:min-value.number="profitSliderMin"
          v-model:max-value.number="profitSliderMax" />
      </div>

      <div class="category">
        <label>Profit Chance</label>
        <SliderRange :min="0" :max="100" :step="1" v-model:min-value.number="chanceSliderMin"
          v-model:max-value.number="chanceSliderMax" />
      </div>

      <div class="category">
        <label>Availability</label>
        <SliderRange :min="0" :max="100" :step="0.1" v-model:min-value.number="availabilitySliderMin"
          v-model:max-value.number="availabilitySliderMax" />
      </div>

      <div class="category">
        <label>Liquidity</label>
        <SliderRange :min="0" :max="100" :step="1" v-model:min-value.number="liquiditySliderMin"
          v-model:max-value.number="liquiditySliderMax" />
      </div>
    </div>

    <div id="item-view">
      <div id="item-table-labels">
        <TradeupTableLabels :labels="tableLabelInfo" @toggle="onSort" />
      </div>

      <div id="item-list">
        <TradeupSlot v-for="(tradeup, index) in tradeupsQueried" :key="index" :even="(index % 2) == 0"
          :tradeup="tradeup" :selectedPrice="selectedPriceOption" />
      </div>

      <PageNumber :current-page="currentPage" :page-count="pageCount" @selected-page="onChosenPage"
        :set-value="currentPage" />
    </div>
  </div>

  <Footer_info id="footer" />

</template>

<style scoped>
#main {
  display: flex;
}

#desktop-infobox {
  margin: 1em;
  padding: 0.5em 1em;
  border-radius: 10px;
  border: 5px solid var(--accent-highlight);
  background-color: var(--accent-main);
}

#filter {
  padding: 0em 1.5em;
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: left;
}

.category {
  margin-top: 1em;
  width: 100%;
}

.category>label {
  font-size: 1.5em;
}

#update-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

input[type=checkbox] {
  margin-left: 1em;
}

#search-name {
  width: 100%;
}

#search-price>* {
  display: inline;
}

#search-price>label {
  margin-right: 0.5em;
}

#item-view {
  flex-grow: 0;
  display: block;
  grid-auto-rows: min-content;
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

@media only screen and (max-width: 1000px),
only screen and (min-width: 700px) {
  #main {
    flex-direction: column;
    width: 100%;
  }

  #item-table-labels>*,
  #item-list {
    grid-template-columns: 1fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  }

  #item-view {
    min-width: 700px;
    padding: 1em;
    box-sizing: border-box;
  }
}

@media only screen and (max-width: 700px) {
  #item-view {
    display: grid;
    min-width: 100%;
    overflow-x: auto;
  }

  #item-table-labels {
    display: grid;
  }

  #item-list {
    width: 1000px;
  }
}

@media only screen and (min-width: 1000px) {
  #desktop-infobox {
    display: none;
  }

  #main {
    flex-direction: row;
    width: 80%;
    padding-bottom: 3em;
  }

  #filter {
    min-width: 200px;
    height: 100%;
    border-right: 2px solid var(--text-color-main);
  }

  #item-view {
    width: 100%;
    padding-left: 1em;
  }
}

.hide {
  display: none !important;
}
</style>