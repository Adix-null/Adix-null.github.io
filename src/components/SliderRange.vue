<!-- source is https://github.com/miracleonyenma/custom-vue-range-slider -->

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import '../style.css';

// Define component props with proper TypeScript types
const props = defineProps<{
    min?: number;
    max?: number;
    step?: number;
    minValue?: number;
    maxValue?: number;
    setMin?: number,
    setMax?: number
}>();

// Default values for props (Vue does not apply defaults in setup(), so we handle it manually)
const min = props.min ?? 0;
const max = props.max ?? 100;
const step = props.step ?? 1;
const sliderMinValue = ref(props.minValue ?? 50);
const sliderMaxValue = ref(props.maxValue ?? 80);

// Define emits for the slider component
const emit = defineEmits<{
    (event: "update:minValue", value: number): void;
    (event: "update:maxValue", value: number): void;
}>();

// Define refs for the slider element and inputs
const slider = ref<HTMLElement | null>(null);
const inputMin = ref<HTMLInputElement | null>(null);
const inputMax = ref<HTMLInputElement | null>(null);

// Function to get the percentage of a value between min and max
const getPercent = (value: number, min: number, max: number): number => {
    return ((value - min) / (max - min)) * 100;
};

// Function to set CSS variables for width, left, and right positioning
const setCSSProps = (left: number, right: number) => {
    if (slider.value) {
        slider.value.style.setProperty("--progressLeft", `${left}%`);
        slider.value.style.setProperty("--progressRight", `${right}%`);
    }
};

//Update values automatically
watch(() => props.setMin, (newValue) => {
    if (newValue !== undefined) {
        sliderMinValue.value = newValue;
    }
});
watch(() => props.setMax, (newValue) => {
    if (newValue !== undefined) {
        sliderMaxValue.value = newValue;
    }
});
// Watch effect to update emitted values and CSS variables when slider values change
watchEffect(() => {
    if (slider.value) {
        // Emit updated values
        emit("update:minValue", sliderMinValue.value);
        emit("update:maxValue", sliderMaxValue.value);

        // Calculate percentages
        const leftPercent = getPercent(sliderMinValue.value, min, max);
        const rightPercent = 100 - getPercent(sliderMaxValue.value, min, max);

        // Set CSS variables
        setCSSProps(leftPercent, rightPercent);
    }
});

// Validation to ensure min value is not greater than max and vice versa
const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (target.name === "min") {
        if (parseFloat(target.value) > sliderMaxValue.value) {
            target.value = sliderMaxValue.value.toString();
        } else {
            sliderMinValue.value = parseFloat(target.value);
        }
    }

    if (target.name === "max") {
        if (parseFloat(target.value) < sliderMinValue.value) {
            target.value = sliderMinValue.value.toString();
        } else {
            sliderMaxValue.value = parseFloat(target.value);
        }
    }
};
</script>

<template>
    <div class="container">
        <div ref="slider" class="custom-slider minmax">
            <div class="minmax-indicator"></div>
            <input ref="inputMin" type="range" name="min" id="min" :min="min" :max="max" :value="minValue" :step="step"
                @input="onInput" v-model="sliderMinValue" />
            <input ref="inputMax" type="range" name="max" id="max" :min="min" :max="max" :value="maxValue" :step="step"
                @input="onInput" v-model="sliderMaxValue" />
        </div>
        <div class="minmax-inputs">
            <input type="tel" pattern="-?[0-9]+" :step="step" v-model="sliderMinValue" />
            <input type="tel" pattern="-?[0-9]+" :step="step" v-model="sliderMaxValue" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
}

a,
.green {
    text-decoration: none;
    color: var(--accent-main);
    transition: 0.4s;
}

@media (hover: hover) {
    a:hover {
        background-color: hsla(160, 100%, 37%, 0.2);
    }
}

.custom-slider {
    --trackHeight: 0.35rem;
    --thumbRadius: 1rem;
}

/* style the input element with type "range" */
.custom-slider input[type="range"] {
    position: relative;
    appearance: none;
    background: none;
    border-radius: 999px;
    z-index: 0;
    height: 100%;
    pointer-events: none;
    cursor: grab;
}

/* ::before element to replace the slider track */
.custom-slider input[type="range"]::before {
    content: "";
    display: block;
    position: absolute;
    width: var(--ProgressPercent, 100%);
    height: 100%;
    background: var(--accent-main);
    border-radius: 999px;
}

/* `::-webkit-slider-runnable-track` targets the track (background) of a range slider in chrome and safari browsers. */
.custom-slider input[type="range"]::-webkit-slider-runnable-track {
    appearance: none;
    background: var(--accent-dim);
    height: var(--trackHeight);
    border-radius: 999px;
}

.custom-slider input[type="range"]::-webkit-slider-thumb {
    position: relative;
    width: var(--thumbRadius);
    height: var(--thumbRadius);
    margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
    background: var(--accent-main);
    border: 1px solid var(--accent-main);
    border-radius: 999px;
    pointer-events: all;
    appearance: none;
    z-index: 1;
}

/* `::-moz-range-track` targets the track (background) of a range slider in Mozilla Firefox. */
.custom-slider.default input[type="range"]::-moz-range-track {
    appearance: none;
    background: var(--accent-dim);
    height: var(--trackHeight);
    border-radius: 999px;
}

.custom-slider input[type="range"]::-moz-range-thumb {
    position: relative;
    box-sizing: border-box;
    width: var(--thumbRadius);
    height: var(--thumbRadius);
    margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
    background: var(--accent-main);
    border: 1px solid var(--accent-main);
    border-radius: 999px;
    pointer-events: all;
    appearance: none;
    z-index: 1;
}

.custom-slider.minmax {
    position: relative;
    height: var(--trackHeight);
    background: var(--accent-dim);
    border-radius: 999px;
    margin: 0.5rem 0;
    --progressLeft: 0%;
    --progressRight: 0%;
}

.custom-slider .minmax-indicator {
    position: absolute;
    height: 100%;
    pointer-events: none;
    left: var(--thumbRadius);
    right: var(--thumbRadius);
}

.custom-slider .minmax-indicator::before {
    content: "";
    position: absolute;
    background: var(--accent-main);
    height: 100%;
    left: var(--progressLeft);
    right: calc(var(--progressRight) - var(--thumbRadius));
}

.custom-slider.minmax input[type="range"] {
    position: absolute;
    width: calc(100% - var(--thumbRadius));
}

.custom-slider.minmax input[type="range"][name="max"] {
    left: var(--thumbRadius);
}

.custom-slider.minmax input[type="range"]::-webkit-slider-runnable-track {
    background: none;
}

.custom-slider.minmax input[type="range"]::before {
    display: none;
}

.minmax-inputs {
    display: flex;
    justify-content: space-between;
}

.minmax-inputs input {
    width: 60px;
    margin-top: 0.5em;
}
</style>