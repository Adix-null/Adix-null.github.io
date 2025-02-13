<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import '../style.css';

import type { Tradeup } from '../../tradeuptracker/types.ts';

const props = defineProps<{
    tradeup: Tradeup,
    selectedPrice: string
}>();

const RarityDictionary: Record<string, string> = {
    "Consumer Grade": "b0c3d9",
    "Industrial Grade": "5e98d9",
    "Mil-Spec Grade": "4b69ff",
    "Restricted": "8847ff",
    "Classified": "d32ce6",
    "Covert": "eb4b4b",
}
const stattrakColor = "#cf6a32";
const nameColor = computed(() =>
    props.tradeup.inputs[0].stattrak ? stattrakColor : "initial"
);

const gradient = computed(() =>
    `linear-gradient(90deg, #${RarityDictionary[props.tradeup.rarity]}dd, #00000000)`
);

function toFixedTruncate(num: number, decimals: number): string {
    const factor = 10 ** decimals;
    return (Math.trunc(num * factor) / factor).toFixed(decimals);
}
//linear - gradient(90deg, rgba(136, 71, 255, 0.8) 0 %, rgba(0, 0, 0, 0) 100 %)
//:rarity="tradeup.rarity"
</script>

<template>
    <div class="container">
        <div id="pic_name">
            <a :href="tradeup.inputs[0].steamurl" target="_blank">
                <img :src="tradeup.inputs[0].image" :style="{ background: gradient }" />
            </a>
            <!-- Longest possible name - Dual Berettas | Sweet Little Angels (Battle-Scarred), 52 chars -->
            <p id="name" :style="{ color: nameColor }">
                {{ tradeup.inputs[0].name }}
            </p>
        </div>
        <p id="output_count">
            {{ tradeup.outcomes!.length }}
        </p>
        <p id="price">
            {{ toFixedTruncate(tradeup.inputs[0].prices[selectedPrice] * 10, 2) }}$
        </p>
        <p id="profit">
            {{ toFixedTruncate(tradeup.expected_value!, 2) }}$
        </p>
        <p id="profit_chance">
            {{ toFixedTruncate(tradeup.profit_chance!, 0) }}%
        </p>
        <p id="max_float">
            {{ toFixedTruncate(tradeup.max_required_float, 4) }}
        </p>
        <p id="availability">
            {{ tradeup.availability }}%
        </p>
        <p id="volume_24h">
            {{ tradeup.inputs[0].volume24h }}
        </p>

    </div>
</template>

<style scoped>
.container>* {
    border-bottom: 1px solid var(--text-color-main);
}


.container * {
    overflow: clip;
    max-height: 75px;
    align-content: center;
    text-align: center;
}

p {
    height: 100%;
    margin: 0;
    padding: 0;
}

#pic_name {
    display: flex;
    flex-direction: row;
    justify-self: start;
    width: 100%;
}

#name {
    text-align: start;
    margin-left: 0.5em;
}

#pic_name>img {
    aspect-ratio: 4 / 3;
    flex-grow: 0;
    margin-right: 1em;
}
</style>