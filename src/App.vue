<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
//import HelloWorld from './components/HelloWorld.vue';
import TradeupSlot from './components/TradeupSlot.vue';
import Navbar from './components/Navbar.vue';
import Footer_info from './components/Footer.vue'
import Dropdown from './components/Dropdown.vue';
import SliderRange from './components/SliderRange.vue';

import type { Tradeup } from '../tradeuptracker/types.ts';

// const name = ref("test");
// const status = ref(1);
// const mydata: Ref<string[], string[]> = ref(["ff", ":DD"]);
// const linkas = ref("https://wikipedia.org");
// const newTask = ref('Search');
let tradeups: Tradeup[];

const range = ref<[number, number]>([0, 100]);


// const addTask = () => {
//   if (newTask.value !== '') {
//     mydata.value.push(newTask.value);
//     newTask.value = '';
//   }
// }

// const myevent = () => {
//   status.value = (status.value + 1) % 3
// }

onMounted(async () => {
  const response = await fetch('../tradeuptracker/tradeuptest.json');
  tradeups = await response.json();
  tradeups = tradeups.slice(0, 20);
});

</script>
<!--https://www.youtube.com/watch?v=VeNfHj6MhgA&t=3900s 1:05:00 -->
<template>

  <!-- <h1>{{ name }}</h1>
  <p v-if="status">okej</p>
  <p v-else>nyet</p>

  <form @submit.prevent="addTask">
    <label for="newTask">Add smth</label>
    <br />
    <input type="text" id="search" name="newTask" v-model="newTask">
    <button type="submit">Search the db</button>
  </form>

  <h2>Poshliy pojechali OwO</h2>
  <a v-for="dat in mydata" :key="dat">{{ dat }}
    <hr />
  </a>
  <a :href="linkas">gein nooledž</a>

  <br />

  <button @click="myevent">Do something idk</button>

  <HelloWorld msg="amog" /> -->

  <!-- <SliderRange v-model="range" :min="0" :max="100" :step="1" /> -->

  <Navbar id="navbar" />

  <div id="main">
    <div id="filter">
      <form>
        <label for="newTask">Item Name</label>
        <br />
        <input type="text" id="search_name" name="newTask">
        <input type="checkbox" id="checkbox">StatTrak™</input>
      </form>

      <label>Float needed</label>
      <SliderRange />

      <label>Collection</label>
      <Dropdown />

      <label>Rarity</label>
      <div id="search_rarities">
        <div>
          <input type="radio" id="Classified" name="rarity" />
          <label for="Classified">Classified</label>
        </div>
        <div>
          <input type="radio" id="Restricted" name="rarity" />
          <label for="Restricted">Restricted</label>
        </div>
        <div>
          <input type="radio" id="Mil-Spec Grade" name="rarity" />
          <label for="Mil-Spec Grade">Mil-Spec Grade</label>
        </div>
        <div>
          <input type="radio" id="Industrial Grade" name="rarity" />
          <label for="Industrial Grade">Industrial Grade</label>
        </div>
        <div>
          <input type="radio" id="Consumer Grade" name="rarity" />
          <label for="Consumer Grade">Consumer Grade</label>
        </div>
      </div>

      <br />
      <div id="search_price">
        <label>Price</label>
        <Dropdown />
      </div>
      <SliderRange />

      <div id="profit_search">
        <label>Profit</label>
        <input type="checkbox" id="checkbox">Percent</input>
      </div>
      <SliderRange />

      <label>Profit Chance</label>
      <SliderRange />

      <label>Availability</label>
      <SliderRange />

      <label>Liquidity</label>
      <SliderRange />
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
          <p>Float needed</p>
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
          name="Axujenas skinas (lauke testuotas)" price="4$" profit="-0.2$" max_float={{max_required_float}}
          availability="37%" output_count="3" volume_24h="73" />
        <!-- <div v-for="(max_required_float, collection, name) in tradeups" :key="name"> {{ name }}
        </div> -->

      </div>
    </div>

  </div>

  <Footer_info id="footer" />

</template>

<style scoped>
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

#checkbox {
  margin-left: 1em;
}

#search_rarities {
  margin-top: 1em;
}

#search_price>* {
  display: inline;
}

#search_price>label {
  margin-right: 1em;
}

#item-view {
  width: 100%;
}

#item-table-labels {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-bottom: 2px solid white;
}

.field {
  margin: 15px;
}

.field>* {
  display: inline;
}

.field>p {
  margin-right: 0.5em;
}


#main {
  display: flex;
  flex-direction: row;
  height: 100%;
}

#footer {
  margin-top: auto;
}
</style>