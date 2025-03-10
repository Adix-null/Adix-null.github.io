<script setup lang="ts">
import { ref, defineEmits } from 'vue';

// Define state: 0 (neutral), 1 (expanded ▲), -1 (collapsed ▼)
const states = ref<number[]>([0, 0, 0, 0, 1, 0, 0, 0, 0]);

const props = defineProps<{
    labels: string[]
}>();

const emit = defineEmits<{
    (event: 'toggle', index: number, state: number): void;
}>();

const toggleField = (index: number) => {
    let selection: number;
    if (states.value[index] === 1) {
        selection = -1;
    }
    else if (states.value[index] === 0) {
        selection = 1;
    }
    else {
        selection = 0;
    }

    states.value = states.value.map(() => 0);
    states.value[index] = selection;

    emit('toggle', index, states.value[index]);
};
</script>

<template>
    <div class="container">
        <div v-for="(field, index) in props.labels" :key="index" class="field">
            <p @click="toggleField(index)">{{ field }}</p>
            <button @click=" toggleField(index)">
                {{ states[index] === 1 ? '▼' : states[index] === -1 ? '▲' : '⬍' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: grid;
    border-bottom: 2px solid white;
    font-size: 0.85em;
}

.field {
    display: flex;
    flex-direction: row;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.field>p {
    margin-right: 0.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.field>button {
    height: auto;
}
</style>