<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue';


const name = ref("test");
const status = ref(1);
const mydata: Ref<string[], string[]> = ref(["ff", ":DD"]);
const linkas = ref("https://wikipedia.org");
const newTask = ref('Search');

const myevent = () => {
  status.value = status.value > 3 ? 0 : status.value + 1;
};

const addTask = () => {
  if (newTask.value !== '') {
    mydata.value.push(newTask.value);
    newTask.value = '';
  }
}

onMounted(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  mydata.value = data.map((task: { id: number; }) => task.id);
});

</script>
<!-- 1:05:00 -->
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
</template>


<style scoped>
h1 {
  font-size: 2em;
}
</style>