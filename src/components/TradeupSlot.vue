<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
import '../style.css';

import type { Tradeup } from '../../tradeuptracker/types.ts';
import { RarityColorDictionary, stattrakColor } from '../../tradeuptracker/types.ts';

const props = defineProps<{
    even: Boolean,
    tradeup: Tradeup,
    selectedPrice: string
}>();

const nameColor = computed(() =>
    props.tradeup.inputs[0].stattrak ? stattrakColor : "initial"
);

const gradient = computed(() =>
    `linear-gradient(90deg, #${RarityColorDictionary[props.tradeup.rarity]}dd, #00000000)`
);

function toFixedTruncate(num: number, decimals: number): string {
    const factor = 10 ** decimals;
    return (Math.trunc(num * factor) / factor).toFixed(decimals);
}
</script>

<template>
    <div :class="'container ' + (props.even ? 'even-row' : 'odd-row')">
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

.even-row>* {
    background-color: var(--background-color-main);
}

.odd-row>* {
    background-color: var(--background-color-alt);
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