<script>
	import { getContext } from "svelte";
	import { line, curveStepAfter } from "d3";

	const { data, xGet, yGet, xScale, } = getContext("LayerCake");

	export let stroke = "#CFCABF";

	export let curve = curveStepAfter;

	$: path = line().x($xGet).y($yGet).curve(curve);
	$: pathD = path($data);
</script>

<path d={pathD} {stroke} />

<style>
	path {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
