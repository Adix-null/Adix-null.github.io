<script setup>
import { ref } from 'vue';

const name = ref("test");
const status = ref(1);
const mydata = ref([3, 5, 945]);
const linkas = ref("https://wikipedia.org");

const myevent = () => {
  status.value = status.value > 3 ? 0 : status.value + 1;
};

</script>
<!-- 42:40 -->
<template>
  <h1>{{ name }}</h1>
  <p v-if="status">okej</p>
  <p v-else>nyet</p>

  <h2>data row</h2>
  <a v-for="dat in mydata" :key="dat">{{ dat }}
    <hr />
  </a>
  <a :href="linkas">gein nooledž</a>

  <br />

  <button @click="myevent">Do something idk</button>

</template>

<style scoped>
h1 {
  font-size: 2em;
}
</style>