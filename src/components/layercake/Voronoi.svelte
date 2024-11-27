<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { uniques } from 'layercake';
	import * as d3 from "d3";
	import { Delaunay } from 'd3-delaunay';
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');
  
	/** @type {String|undefined} [stroke] – An optional stroke color, which is likely only useful for testing to make sure the shapes drew correctly. */
	export let stroke = undefined;
  
	function mouseoverCircle(point) {
	  console.log(point, point.data);

	  d3.selectAll(".circle-explore").style("opacity", 0.1).style("fill", "#363B45").style("stroke", "#363B45");

	  d3.selectAll(`#circle-${point.data.id}`).style("opacity", 0.8).style("fill", "#d0c8a8").style("stroke", "#ffffff");
	}

	function mouseleaveCircle(point) {
		d3.selectAll(".circle-explore").style("opacity", 0.8).style("fill", "#d0c8a8").style("stroke", "#ffffff");
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
	  class="voronoi-cell"
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
	}
  </style>