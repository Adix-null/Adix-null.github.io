<script setup lang="ts">
import { ref } from 'vue';
import logo from '../assets/tradeuptracker.svg';
import Dropdown from './Dropdown.vue';

const dropdownOptions = ref<string[]>(['USD', 'EUR', 'CNY']);
</script>

<template>
    <div class="container">
        <img :src="logo">
        <h2>TradeUp Tracker</h2>
        <div id="links-container">
            <a class="clickable">
                Calculator
            </a>
            <a class="clickable">
                Skin Info
            </a>
            <a class="clickable">
                Login with Steam
            </a>
        </div>
        <div id="currency">
            <Dropdown :options="dropdownOptions" :default="0" />
        </div>
    </div>
</template>

<style scoped>
img {
    width: 65px;
    border-radius: 10px;
    padding: 10px;
}

h2 {
    width: fit-content;
    text-wrap: nowrap;
    padding-left: 1em;
}

#currency {
    visibility: hidden;
    margin: 0px 20px
}

#links-container {
    visibility: hidden;
    display: flex;
    flex-direction: row;
    margin-left: auto;
    align-items: center;
    margin: 0px 10px 0px auto;
}

.clickable {
    height: 30px;
    padding: 0em 0.5em;
    margin: 0px 10px;
    border-radius: 10px;
    align-content: center;
    border: 2px solid white;
    text-wrap: nowrap;
    cursor: pointer;
}

.container {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: black;
}
</style>