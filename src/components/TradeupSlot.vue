<script setup lang="ts">
import { ref, defineProps } from 'vue';

defineProps<{
    imgSrc: string,
    name: string,
    price: string,
    profit: string,
    max_float: string,
    availability: string,
    output_count: string,
    volume_24h: string,
}>();

</script>


<template>
    <div class="container">
        <img :src="imgSrc" />
        <!-- Longest possible name - Dual Berettas | Sweet Little Angels (Battle-Scarred), 52 chars -->
        <p id="name">
            {{ name }}
        </p>
        <p id="price">
            {{ price }}
        </p>
        <p id="profit">
            {{ profit }}
        </p>
        <p id="max_float">
            {{ max_float }}
        </p>
        <p id="availability">
            {{ availability }}
        </p>
        <p id="output_count">
            {{ output_count }}
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
    height: 100px;
    align-items: center;
}

.container>* {
    max-height: 100px;
    align-content: center;
}

p {
    margin: 0px 10px;
}

.name {
    width: 400px
}
</style>