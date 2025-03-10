<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    options: string[],
    special?: string,
    message: string,
    checkNormals: boolean,
}>();

const emit = defineEmits<{
    (event: string, options: string[]): void;
}>();

const checkboxes = ref<(HTMLInputElement | null)[]>([]);

const chooseOption = () => {
    let selectedOptions: string[] = checkboxes.value
        .filter(cb => cb?.checked)
        .map(cb => cb!.id);

    if (selectedOptions.length === 0) {
        selectedOptions = [props.special ?? "*"];
    }

    if (selectedOptions.includes(props.special ?? "*")) {
        selectedOptions = [props.special ?? "*"];
    }

    emit(props.message, selectedOptions);
};

</script>

<template>
    <div class="container">
        <div v-if="props.special">
            <input type="checkbox" :id="props.special" checked @change="chooseOption"
                :ref="(el => checkboxes[0] = el as HTMLInputElement)">
            {{ props.special }}
        </div>
        <div v-for="(option, index) in props.options" :key="option">
            <input type="checkbox" :id="option" :checked="checkNormals" @change="chooseOption"
                :ref="(el => checkboxes[index + 1] = el as HTMLInputElement)">
            {{ option }}
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}

#container>* {
    display: inline;
}
</style>