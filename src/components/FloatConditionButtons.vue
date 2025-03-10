<script setup lang="ts">
import { rangeDictionaryShortNames, shorthandKeys } from '../../tradeuptracker/types.ts';

const emit = defineEmits<{
    (event: "updateFloatSlider", floatSliderMin: number, floatSliderMax: number): void;
}>();

const setFloatBounds = (quality: string) => {
    let floatSliderMin = rangeDictionaryShortNames[quality as (typeof shorthandKeys)[number]].min;
    let floatSliderMax = rangeDictionaryShortNames[quality as (typeof shorthandKeys)[number]].max;
    emit('updateFloatSlider', floatSliderMin, floatSliderMax);
}
</script>

<template>
    <div class="container">
        <button v-for="float in shorthandKeys" @click=setFloatBounds(float)>{{ float }}</button>
    </div>
</template>

<style scoped>
.container {
    margin-top: 0.5em;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;
}

.container>button {
    width: 100%;
    border: 1px solid var(--text-color-main);
}

.container>button:hover {
    background-color: var(--background-color-hover);
}
</style>