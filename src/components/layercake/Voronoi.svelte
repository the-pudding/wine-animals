<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { uniques } from 'layercake';
	import * as d3 from "d3";
	import { Delaunay } from 'd3-delaunay';
	import { bigScatterData, highlightWine } from "$stores/misc.js";
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');
  
	/** @type {String|undefined} [stroke] – An optional stroke color, which is likely only useful for testing to make sure the shapes drew correctly. */
	export let stroke = undefined;
  
	function mouseoverCircle(point) {

	  d3.selectAll(".circle-explore.active").style("opacity", 0.1).style("fill", "#363B45").style("stroke", "#363B45");

	  d3.selectAll(`#circle-${point.data.id}`).style("opacity", 0.8).style("fill", "#d0c8a8").style("stroke", "#ffffff");

	  highlightWine.set(point.data)
	}

	function mouseleaveCircle(point) {
		d3.selectAll(".circle-explore.active").style("opacity", 0.8).style("fill", "#d0c8a8").style("stroke", "#ffffff");

		highlightWine.set(undefined)
	}
  
	$: points = $data[0].map(d => {
	  const point = [$xGet(d), $yGet(d)];
	  point.data = d;
	  return point;
	});
  
	$: uniquePoints = uniques(points, d => d.join(), false);
  
	$: voronoi = d3.Delaunay.from(uniquePoints).voronoi([0, 0, $width, $height]);
  </script>
  
  {#each uniquePoints as point, i}
	<path
		id={`voronoi-${point.data.id}`}
		class={$bigScatterData.includes(point.data) ? "voronoi-cell active" : " voronoi-cell inactive"}
	  d={voronoi.renderCell(i)}
	  on:mouseover={() => {
		mouseoverCircle(point);
	  }}
	  on:mouseleave={() => {
		mouseleaveCircle(point);
	  }}
	  on:focus={() => {
		mouseoverCircle(point);
	  }}
	  role="tooltip"
	></path>
  {/each}
  
  <style>
	.voronoi-cell {
	  fill: none;
	  stroke: none;
	  pointer-events: all;
	  outline: none;
	  cursor: pointer;
	}
	.voronoi-cell.inactive {
		pointer-events: none;
	}
  </style>