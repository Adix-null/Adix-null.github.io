<script setup lang="ts">
import type { Ref } from 'vue';
import { raritiesOrder } from '../../tradeuptracker/types';

const props = defineProps<{

}>();

const emit = defineEmits<{
    (event: 'raritiesChosen', rarities: String[]): void;
}>();

const chooseRarity = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>("#container > div > input[type='checkbox']");

    let selectedRarities: string[] = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);

    if (selectedRarities.length === 0) {
        selectedRarities[0] = "Any";
        //(document.getElementById("Any") as HTMLInputElement).checked = true; not UX friendly behavior
    }

    if (selectedRarities.includes("Any")) {
        selectedRarities = [];
        selectedRarities[0] = "Any";
    }

    emit('raritiesChosen', selectedRarities);
};

</script>

<template>
    <div id="container">
        <div>
            <input type="checkbox" id="Any" checked="true" @change="chooseRarity">Any
        </div>
        <div v-for="rarity in raritiesOrder.slice(0, -1).reverse()">
            <input type="checkbox" :id="rarity" @change="chooseRarity">{{ rarity }}
        </div>
    </div>
</template>

<style scoped>
#container {
    display: flex;
    flex-direction: column;
}

#container>* {
    display: inline;
}
</style>