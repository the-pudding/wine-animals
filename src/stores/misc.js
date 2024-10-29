import { writable } from "svelte/store";

export const favWinesList = writable([]);
export const wineSet = writable("animals/humans");
export const metricSelect = writable("price");
export const animalSelect = writable("all");
export const topgroupSelect = writable("all");
export const photoSelect = writable("all");
export const hideTooltip = writable(true);