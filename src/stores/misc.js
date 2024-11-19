import { writable } from "svelte/store";
import allWineData from "$data/wineData.csv";

export const favWinesList = writable([]);
export const wineSet = writable("animals/humans");
export const metricSelect = writable("price");
export const animalSelect = writable("all");
export const topgroupSelect = writable("all");
export const photoSelect = writable("all");
export const hideTooltip = writable(true);

const filteredData = allWineData.filter(d => d.price <= 100);

export const bigScatterData = writable(filteredData);
export const selectedAnimalSTORE = writable([]);
export const selectedTypeSTORE = writable([]);
export const selectedCountrySTORE = writable([]);
export const selectedPriceRangeSTORE = writable([3, 100]);
export const selectedRatingRangeSTORE = writable([2.5, 5]);
export const selectedYearRangeSTORE = writable([1850, 2023]);