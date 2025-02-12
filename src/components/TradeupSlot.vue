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

const gradient = computed(() =>
    `linear-gradient(90deg, #${RarityDictionary[props.tradeup.rarity]}dd, #00000000)`
);
//linear - gradient(90deg, rgba(136, 71, 255, 0.8) 0 %, rgba(0, 0, 0, 0) 100 %)
//:rarity="tradeup.rarity"
</script>

<template>
    <div class="container">
        <div id="pic_name">
            <img :src="tradeup.inputs[0].image" :style="{ background: gradient }" />
            <!-- Longest possible name - Dual Berettas | Sweet Little Angels (Battle-Scarred), 52 chars -->
            <p id="name">
                {{ tradeup.inputs[0].name }}
            </p>
        </div>
        <p id="output_count">
            {{ tradeup.outcomes!.length }}
        </p>
        <p id="price">
            {{ tradeup.inputs[0].prices[selectedPrice] }}
        </p>
        <p id="profit">
            {{ tradeup.expected_value!.toFixed(2) }}
        </p>
        <p id="profit_chance">
            {{ tradeup.profit_chance!.toFixed(0) }}%
        </p>
        <p id="max_float">
            {{ tradeup.max_required_float.toFixed(3) }}
        </p>
        <p id="availability">
            {{ tradeup.availability }}%
        </p>
        <p id="volume_24h">
            0
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

#pic_name>p {
    text-align: start;

}

#pic_name>img {
    aspect-ratio: 4 / 3;
    flex-grow: 0;
    margin-right: 1em;
}
</style>