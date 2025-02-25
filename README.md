# TradeupTracker
## A website to view computed tradeups with the latest prices 

Built with Vue 3 Composition + TypeScript + Vite + Deno 2

Will probably containerize the project soon but for now

To build the project install the necessary deps and run
### On Windows 
```npm run dev```
### On Linux 
```deno run -A npm:vite```

To compute the tradeup file run 
<br>
```deno run --allow-read --allow-write --allow-net tradeuptracker/logic.ts```
