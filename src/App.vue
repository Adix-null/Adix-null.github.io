<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import TradeupSlot from './components/TradeupSlot.vue';
import type { Tradeup } from '../tradeuptracker/types.ts';
//import SliderRange from './components/SliderRange.vue';

const name = ref("test");
const status = ref(1);
const mydata: Ref<string[], string[]> = ref(["ff", ":DD"]);
const linkas = ref("https://wikipedia.org");
const newTask = ref('Search');
let tradeups: Tradeup[];

const range = ref<[number, number]>([20, 80]);

const addTask = () => {
  if (newTask.value !== '') {
    mydata.value.push(newTask.value);
    newTask.value = '';
  }
}

const myevent = () => {
  status.value = (status.value + 1) % 3
}

onMounted(async () => {
  const response = await fetch('../tradeuptracker/tradeups.json');
  tradeups = await response.json();
});

</script>
<!--https://www.youtube.com/watch?v=VeNfHj6MhgA&t=3933s 1:05:00 -->
<template>
  <h1>{{ name }}</h1>
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

  <HelloWorld msg="amog" />

  <!-- <SliderRange v-model="range" :min="0" :max="100" :step="1" /> -->
  <div v-for="(max_required_float, collection, name) in tradeups" :key="name"> {{ name }}
    <TradeupSlot
      imgSrc="
    https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8jkIbLfgnhF-sBwh9bN_Iv9nBrj-BE-Nz2iJoXBJFJtYFzY_1e9yO-51pK-7prInHdl7yEi5niJzUawn1gSOR_ZgPWk"
      name="Axujenas skinas (lauke testuotas)" price="4$" profit="-0.2$" max_float={{max_required_float}}
      availability="37%" output_count="3" volume_24h="73" />
  </div>
</template>

<style scoped>
h1 {
  font-size: 2em;
}
</style>