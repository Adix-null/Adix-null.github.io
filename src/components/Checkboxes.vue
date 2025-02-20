<script setup lang="ts">
import { getCurrentInstance, ref, type ComponentInternalInstance, type Ref } from 'vue';

const props = defineProps<{
    options: string[],
    special?: string,
    message: string,
    checkNormals: boolean,
}>();

const emit = defineEmits<{
    (event: String, options: String[]): void;
}>();

const cbs = ref(null);

const chooseOption = () => {
    const checkboxes = document.querySelectorAll<HTMLInputElement>("#container > div > input[type='checkbox']");

    let selectedOptions: string[] = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.id);
    ;
    if (selectedOptions.length === 0) {
        selectedOptions[0] = props.special ?? "*";
    }
    if (props.special != null) {
        if (selectedOptions.includes(props.special)) {
            selectedOptions = [];
            selectedOptions[0] = props.special;
        }
    }
    else {
        if (selectedOptions.includes("*")) {
            selectedOptions = [];
            selectedOptions[0] = "*";
        }
    }

    emit(props.message, selectedOptions);
    console.log(selectedOptions);
    console.log(props.message);
};

</script>

<template>
    <div ref="cbs" id="container">
        <div v-if="props.special != null">
            <input type="checkbox" :id="special!" checked="true" @change="chooseOption">{{ special }}
        </div>
        <div v-for="option in props.options">
            <input type="checkbox" :id="option" :checked="checkNormals" @change="chooseOption">{{ option }}
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