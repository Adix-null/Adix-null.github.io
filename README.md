# TradeupTracker
## A tool to view CS2 computed tradeups based on the latest prices 

Built with Vue 3 Composition + TypeScript + Vite + Deno 2

The site is automatically updated every 8 hours with github actions and deployed on github pages.

To build the project install the necessary dependencies and run:
### On Windows 
```npm run dev```
### On Linux 
```deno run -A npm:vite```

To compute the tradeup file run 
<br>
```deno run --allow-read --allow-write --allow-net tradeuptracker/logic.ts YOUR_STEAMWEBAPI_KEY true```
