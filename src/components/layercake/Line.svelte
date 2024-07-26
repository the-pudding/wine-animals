<script>
	import { getContext } from "svelte";
	import { line, curveLinear, curveStepAfter } from "d3";

	const { data, xGet, yGet } = getContext("LayerCake");

	export let stroke = "#000000";

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
