<script setup lang="ts">
import { ref } from 'vue';
import '../style.css'

defineProps({
    options: {
        type: Array as () => string[],
        required: true,
    },
});

const isDropdownOpen = ref(false);
const selectedOption = ref<string | null>(null);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (option: string) => {
    selectedOption.value = option;
    isDropdownOpen.value = false;
};
</script>

<template>
    <div class="dropdown" @click="toggleDropdown">
        <button class="dropdown-button">{{ selectedOption || 'Select Option' }}</button>
        <ul v-if="isDropdownOpen" class="dropdown-list">
            <li v-for="option in options" :key="option" @click="selectOption(option)" class="dropdown-item">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.dropdown {
    position: relative;
    border: 1px solid white;
    background-color: var(--background-color-main);
}

.dropdown-button {
    padding: 5px;
    cursor: pointer;
}

.dropdown-list {
    position: absolute;
    width: max-content;
    top: 100%;
    left: 0;
    right: 0;
    padding: 0;
    margin: 0;
    z-index: 1;
    list-style: none;
    border: 1px solid white;
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
