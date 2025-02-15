<script setup lang="ts">
import type { Ref } from 'vue';

const props = defineProps<{

}>();

</script>

<template id="container">
    <div><input type="checkbox" id="Any" checked="true">Any</input></div>
    <div><input type="checkbox" id="Classified">Classified</input></div>
    <div><input type="checkbox" id="Restricted">Restricted</input></div>
    <div><input type="checkbox" id="Mil-Spec Grade">Mil-Spec Grade</input></div>
    <div><input type="checkbox" id="Industrial Grade">Industrial Grade</input></div>
    <div><input type="checkbox" id="Consumer Grade">Consumer Grade</input></div>
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