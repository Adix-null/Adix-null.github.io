<script setup lang="ts">
import { ref, defineProps } from 'vue';

defineProps<{
    imgSrc: string,
    name: string,
    price: string,
    profit: string,
    profit_chance: string,
    max_float: string,
    availability: string,
    output_count: string,
    volume_24h: string,
}>();

</script>


<template>
    <div class="container">
        <div id="pic_name">
            <img :src="imgSrc" />
            <!-- Longest possible name - Dual Berettas | Sweet Little Angels (Battle-Scarred), 52 chars -->
            <p id="name">
                {{ name }}
            </p>
        </div>
        <p id="output_count">
            {{ output_count }}
        </p>
        <p id="price">
            {{ price }}
        </p>
        <p id="profit">
            {{ profit }}
        </p>
        <p id="profit_chance">
            {{ profit_chance }}
        </p>
        <p id="max_float">
            {{ max_float }}
        </p>
        <p id="availability">
            {{ availability }}
        </p>
        <p id="volume_24h">
            {{ volume_24h }}
        </p>

    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0em 2em;
}

.container * {
    overflow: clip;
    max-height: 75px;
    align-content: center;
    text-align: center;
}

#pic_name {
    display: flex;
    flex-direction: row;
    justify-self: start;
    text-align: start;
}

#pic_name>img {
    background: rgb(136, 71, 255);
    background: linear-gradient(90deg, rgba(136, 71, 255, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
    aspect-ratio: 4 / 3;
    flex-grow: 0;
    margin-right: 1em;
}
</style>