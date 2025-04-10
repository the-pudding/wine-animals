import { writable } from "svelte/store";
import allWineData from "$data/wineData.csv";

// EXPLORE DATA
const filteredData = allWineData.filter(d => d.price <= 150 && d.topgroup !== "human" && d.topgroup !== "none");

export const bigScatterData = writable(filteredData);
export const withFiltersData = writable(filteredData);
export const selectedAnimalSTORE = writable([]);
export const selectedTypeSTORE = writable([]);
export const selectedCountrySTORE = writable([]);
export const searchedWineSTORE = writable(undefined);
export const selectedPriceRangeSTORE = writable([3, 150]);
export const selectedRatingRangeSTORE = writable([2.5, 5]);
export const selectedYearRangeSTORE = writable([1850, 2023]);

// INTRO SELECTION
const isBrowser = typeof window !== 'undefined';
const openingWines = ["cat", "bird", "pig", "amphibian/reptile"];
const randomAnimal = openingWines[Math.floor(Math.random() * openingWines.length)];

const storedAnimal = isBrowser ? localStorage.getItem("animalSelected") : null;
console.log("[store] loaded animal from localStorage:", storedAnimal);
const hasStoredAnimal = !!storedAnimal;

export const bottleSelected = writable(false);
export const animalSelected = writable(storedAnimal || randomAnimal);

console.log("[store] initialized animalSelected to:", storedAnimal || randomAnimal);

if (isBrowser) {
	bottleSelected.subscribe((isSelected) => {
		console.log("[store] bottleSelected changed:", isSelected);
		if (isSelected) {
			const unsubscribe = animalSelected.subscribe((animal) => {
				console.log("[store] setting localStorage to:", animal);
				localStorage.setItem("animalSelected", animal);
			});
			unsubscribe();
		}
	});
}

// STEAL RANGES
export const stealPriceNum = writable(29.99);
export const stealRatingNum = writable(4);
export const stealData = writable([]);
export const stealPercent = writable();
export const stealTopgroupCounts = writable([]);

// ANIMAL CARDS
export const navAnimal = writable("amphibian/reptile");
export const currAnimalSlide = writable(0);

// UNIVERSAL TOOLTIP
export const tooltipType = writable(null);
export const lockedSelection = writable(false);
export const tooltipData = writable(null);
export const tooltipVisible = writable(false);

// SECTION
export const activeSection = writable("Finding the Deals");