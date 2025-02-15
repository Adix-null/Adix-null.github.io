<script setup lang="ts">
import type { Ref } from 'vue';
import { rangeDictionary, shorthandKeys } from '../../tradeuptracker/types.ts';


const props = defineProps<{
    floatSliderMin: number,
    floatSliderMax: number
}>();

const setFloatBounds = (quality: string) => {
    //props.floatSliderMin.value = rangeDictionary[quality].min;
    //props.floatSliderMax.value = rangeDictionary[quality].max;
}
</script>

<template>
    <div id="container">
        <button v-for="float in shorthandKeys " @click=setFloatBounds(float)>{{ float }}</button>
    </div>
</template>

<style scoped>
#container {
    margin-top: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;
}

#container>button {
    width: 100%;
    border: 1px solid var(--text-color-main);
}

#container>button:hover {
    background-color: var(--background-color-hover);
}
</style>