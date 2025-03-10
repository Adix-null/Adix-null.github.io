<script setup lang="ts">
//import personal_logo from '../assets/prf_pic_sq.png';
import ts_logo from '../assets/Typescript-logo.png';
import vite_logo from '../assets/Vitejs-logo.png';
import vue_logo from '../assets/vue.svg';
import deno_logo from '../assets/Deno-logo.png';
import api_logo from '../assets/steamwebapi-logo.svg';
import { lastUpdated } from "../../tradeuptracker/lastUpdated.ts";
</script>

<template>
    <div class="container">
        <div id="texts">
            <p>
                Developed by <a href="https://github.com/Adix-null">Adix Null</a>
            </p>
            <p>
                Prices update every 8 hours. All containers, items and their corresponding visual media shown on this
                site are the property of Valve
                Corporation. TradeupTracker does not guarantee the accuracy of prices shown on screen, as they are
                subject to volatile market fluctuations and may not be truthfully reflected in the data sources.
                <br />
                ©2025 TradeUptracker
                <br />
            </p>
            <p>
                Last updated: {{ lastUpdated.replace("T", " ").replace("Z", " UTC") }}
            </p>
        </div>
        <div id="logos">
            <img :src="api_logo" />
            <a href="https://bymykel.github.io/CSGO-API">CSGO info API</a>
            <img :src="vue_logo" />
            <img :src="ts_logo" />
            <img :src="deno_logo" />
            <img :src="vite_logo" />
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 2em 2em;
    display: flex;
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
    max-height: 500px;
    background-color: var(--backround-color-accent);
}

@media only screen and (max-width: 1000px) {
    .container {
        flex-direction: column;
        max-height: 1000px;
    }
}

#logos {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-content: start;
    flex-wrap: wrap;
}

#logos>* {
    height: 50px;
    padding-right: 25px;
}

#texts {
    width: fit-content;
}

p {
    text-align: start;
}
</style>