import { bigScatterData } from "$stores/misc.js";
import { get } from "svelte/store";


export default function filterScatterData(filterParams) {
    const data = get(bigScatterData);

    if (filterParams.selectedAnimal.length > 0) {
        let filteredData = data.filter(d => filterParams.selectedAnimal.includes(d.topgroup));
        bigScatterData.set(filteredData)
    }
}