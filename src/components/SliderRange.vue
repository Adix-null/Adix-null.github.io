<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps<{
    min: number;
    max: number;
    step?: number;
    modelValue: [number, number];
}>();

const emit = defineEmits<["update:modelValue"]>();

const minValue = ref(props.modelValue[0]);
const maxValue = ref(props.modelValue[1]);

const updateValues = () => {
    if (minValue.value > maxValue.value) {
        [minValue.value, maxValue.value] = [maxValue.value, minValue.value];
    }
    emit(emit, [minValue.value, maxValue.value]);
};

watch(() => props.modelValue, ([newMin, newMax]) => {
    minValue.value = newMin;
    maxValue.value = newMax;
}, { deep: true });

</script>

<template>
    <div class="slider-container">
        <input type="range" v-model="minValue" :min="min" :max="max" :step="step" @input="updateValues" />
        <input type="range" v-model="maxValue" :min="min" :max="max" :step="step" @input="updateValues" />
        <div class="values">{{ minValue }} - {{ maxValue }}</div>
    </div>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
