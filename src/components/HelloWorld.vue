<script setup lang="ts">
import { ref } from 'vue'
import { defineProps } from 'vue';


defineProps({
  msg: {
    type: String,
    default: "nothin yet"
  }

});

const count = ref(1)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count = count * (count - 1.3)">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
