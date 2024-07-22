import { writable } from "svelte/store";

export const falseWinesList = writable([]);
export const wineSet = writable("animals/humans");
export const catSet = writable("price");
export const hideTooltip = writable(true);