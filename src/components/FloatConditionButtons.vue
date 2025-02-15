<script setup lang="ts">
import type { Ref } from 'vue';
import { rangeDictionary } from '../../tradeuptracker/types.ts';


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
        <button @click="setFloatBounds('FN')">FN</button>
        <button @click="setFloatBounds('MW')">MW</button>
        <button @click="setFloatBounds('FT')">FT</button>
        <button @click="setFloatBounds('WW')">WW</button>
        <button @click="setFloatBounds('BS')">BS</button>
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