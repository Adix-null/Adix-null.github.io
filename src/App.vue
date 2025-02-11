<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TradeupSlot from './components/TradeupSlot.vue';
import Navbar from './components/Navbar.vue';
import Footer_info from './components/Footer.vue'
import Dropdown from './components/Dropdown.vue';
import SliderRange from './components/SliderRange.vue';

import type { Tradeup } from '../tradeuptracker/types.ts';

let tradeups: Tradeup[];

const sliderMin = ref(0);
const sliderMax = ref(1);

onMounted(async () => {
  const response = await fetch('../tradeuptracker/tradeuptest.json');
  tradeups = await response.json();
  tradeups = tradeups.slice(0, 20);
});

const dropdownOptions = ref<string[]>(['Option 1', 'Option 2', 'Option 3', 'Option 3', 'Option 3', 'Option 3', 'Option 3', 'Option 3', 'Option 3', 'Option 3', 'Option 3', 'Option 3']);

</script>

<template>
  <Navbar id="navbar" />

  <div id="main">
    <div id="filter">
      <form>
        <label class="category" for="search_name">Item Name</label>
        <br />
        <input type="text" id="search_name" name="search_name">
        <input type="checkbox" id="stattrak_cb">StatTrak™</input>
      </form>

      <label class="category">Float needed</label>
      <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="sliderMin" v-model:max-value="sliderMax" />


      <label class="category">Collection</label>
      <Dropdown :options="dropdownOptions" />

      <label class="category">Rarity</label>
      <div id="search_rarities">
        <div><input type="checkbox" id="Any">Any</input></div>
        <div><input type="checkbox" id="Classified">Classified</input></div>
        <div><input type="checkbox" id="Restricted">Restricted</input></div>
        <div><input type="checkbox" id="">Mil-Spec Grade</input></div>
        <div><input type="checkbox" id="">Industrial Grade</input></div>
        <div><input type="checkbox" id="">Consumer Grade</input></div>
      </div>

      <br />
      <div id="search_price" class="category">
        <label>Price</label>
        <Dropdown :options="dropdownOptions" />
      </div>
      <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="sliderMin" v-model:max-value="sliderMax" />

      <div id="profit_search" class="category">
        <label>Profit</label>
        <input type="checkbox" id="checkbox_pc">Percent</input>
      </div>
      <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="sliderMin" v-model:max-value="sliderMax" />

      <label class="category">Profit Chance</label>
      <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="sliderMin" v-model:max-value="sliderMax" />

      <label class="category">Availability</label>
      <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="sliderMin" v-model:max-value="sliderMax" />

      <label class="category">Liquidity</label>
      <SliderRange :min="0" :max="1" :step="0.001" v-model:min-value="sliderMin" v-model:max-value="sliderMax" />
    </div>


    <div id="item-view">
      <div id="item-table-labels">
        <div class="field">
          <p>Name</p>
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
          <p>Liquidity</p>
          <button>▼</button>
        </div>

      </div>
      <div id="item-list">
        <TradeupSlot
          imgSrc="
        https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbLfgnhF-sBwh9bN_Iv9nBrj-BE-Nz2iJoXBJFJtYFzY_1e9yO-51pK-7prInHdl7yEi5niJzUawn1gSOR_ZgPWk"
          name="Dual Berettas | Sweet Little Angels (Battle-Scarred)" output_count="3" price="4$" profit="-0.2$"
          profit_chance="33%" max_float=0.08625 availability="37%" volume_24h="73" />
        <TradeupSlot
          imgSrc="
        https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAZx7PLfYQJW-9W4kb-GkvP9JrafkDMB7JYi2byRotik2gPs_0Y_a27ycIKcdwA2YVqG8wLvxO2705a5tYOJlyVepNPmuQ"
          name="AWP | PAW (Factory New)" output_count="3" price="4$" profit="-0.2$" profit_chance="33%"
          max_float=0.08625 availability="37%" volume_24h="73" />
        <TradeupSlot
          imgSrc="
        https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbLfgnhF-sBwh9bN_Iv9nBrj-BE-Nz2iJoXBJFJtYFzY_1e9yO-51pK-7prInHdl7yEi5niJzUawn1gSOR_ZgPWk"
          name="Galil | Cold fusion (Field-Tested)" output_count="3" price="4$" profit="-0.2$" profit_chance="33%"
          max_float=0.08625 availability="37%" volume_24h="73" />
        <!-- <div v-for="(max_required_float, collection, name) in tradeups" :key="name"> {{ name }}
        </div> -->

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
  border-right: 2px solid white;
}

.category {
  font-size: 1.5em;
  margin-top: 0.5em;
}

input[type=checkbox] {
  /* doesnt work for some reason */
  font-size: 2em !important;
  margin-left: 0.5em;
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
  min-width: 500px;
  flex-grow: 0;
  display: block;
  grid-auto-rows: min-content;
  padding-left: 1em;
}

#item-table-labels {
  display: grid;
  border-bottom: 2px solid white;
}

#item-table-labels,
#item-list {
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
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