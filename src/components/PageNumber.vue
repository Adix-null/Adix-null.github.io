<script setup lang="ts">
import { ref, watch } from 'vue';
import '../style.css'

const props = defineProps<{
    pageCount: number,
    currentPage: number,
    setValue?: number,
}>();

const emits = defineEmits<{
    (event: 'selectedPage', pageNumber: number): void;
}>();

const currentPageNum = ref(props.currentPage);

const changePageNum = (num: number) => {
    currentPageNum.value = num;
    emits('selectedPage', num);
}
watch(() => props.setValue, (newValue) => {
    if (newValue !== undefined) {
        currentPageNum.value = newValue;
    }
});
</script>

<template>
    <div class="container">
        <button v-if="pageCount > 0" @click="changePageNum(1)"
            :class="'page-number' + (currentPageNum === 1 ? ' highlight' : '')">1</button>
        <p v-if="currentPageNum > 3" class="page-number">...</p>
        <button v-if="currentPageNum > 2" @click="changePageNum(currentPageNum - 1)" class="page-number">{{
            currentPageNum - 1 }}</button>
        <button v-if="currentPageNum > 1 && currentPageNum < props.pageCount" @click="changePageNum(currentPageNum)"
            :class="'page-number' + (currentPageNum > 1 && currentPageNum < props.pageCount ? ' highlight' : '')">{{
                currentPageNum }}</button>
        <button v-if="currentPageNum < props.pageCount - 1" @click="changePageNum(currentPageNum + 1)"
            class="page-number">{{ currentPageNum + 1 }}</button>
        <p v-if="currentPageNum < props.pageCount - 2" class="page-number">...</p>
        <button v-if="pageCount > 1" @click="changePageNum(props.pageCount)"
            :class="'page-number' + (currentPageNum === props.pageCount ? ' highlight' : '')">{{ props.pageCount
            }}</button>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.highlight {
    background-color: var(--background-color-hover) !important;
}

.page-number {
    margin: 0.75em 0.25em;
    padding: 0.25em 0.75em;
    border-radius: 2px;
}

button.page-number {
    background-color: var(--background-color-alt);
}
</style>