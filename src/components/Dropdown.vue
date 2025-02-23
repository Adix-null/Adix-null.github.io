<script setup lang="ts">
import { ref } from 'vue';
import '../style.css'

const props = defineProps<{
    options: string[],
    default?: number,
    message: string
}>();

const isDropdownOpen = ref(false);
const selectedOption = ref(props.options[props.default ?? 0]);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const emit = defineEmits<{
    (event: string, value: string): void;
}>();

const selectOption = (option: string) => {
    selectedOption.value = option;
    isDropdownOpen.value = false;
    toggleDropdown();
    emit(props.message, selectedOption.value);
};

if (props.default != null) {
    selectOption(props.options[props.default]);
    toggleDropdown();
}
</script>

<template>
    <div class="container" @click="toggleDropdown">
        <button class="dropdown-button">{{ selectedOption || '...' }}</button>
        <ul v-if="isDropdownOpen" class="dropdown-list">
            <li v-for="option in options" :key="option" @click="selectOption(option)" class="dropdown-item">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    border: 1px solid var(--text-color-main);
    border-radius: 5px;
    background-color: var(--background-color-main);
    max-width: 200px;
    cursor: pointer;
}

.dropdown-button {
    max-width: 90%;
    padding: 5px;
    white-space: nowrap;
    text-overflow: clip;
    overflow: hidden;
}

.dropdown-list {
    position: absolute;
    width: max-content;
    max-width: 200px;
    top: 100%;
    left: 0;
    right: 0;
    padding: 0;
    margin: 0;
    z-index: 1;
    list-style: none;
    text-align: start;
    border: 1px solid var(--text-color-main);
    max-height: 350px;
    overflow-y: auto;
    background-color: var(--background-color-main);
}

.dropdown-item {
    padding: 0.5em;
    cursor: pointer;
}

.dropdown-item:hover {
    background-color: var(--background-color-hover);
}
</style>
