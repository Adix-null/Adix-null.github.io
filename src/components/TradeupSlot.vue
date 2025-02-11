<script setup lang="ts">
import { defineProps } from 'vue';
import '../style.css';

defineProps<{
    img_src: string,
    name: string,
    price: number,
    profit: number,
    profit_chance: number,
    max_float: number,
    availability: number,
    output_count: number,
    volume_24h: number,
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
    background: rgb(136, 71, 255);
    background: linear-gradient(90deg, rgba(136, 71, 255, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
    aspect-ratio: 4 / 3;
    flex-grow: 0;
    margin-right: 1em;
}
</style>