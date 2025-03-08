<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { uniques } from 'layercake';
	import * as d3 from "d3";
	import { Delaunay } from 'd3-delaunay';
	import { bigScatterData, highlightWine } from "$stores/misc.js";
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');
  
	/** @type {String|undefined} [stroke] – An optional stroke color, which is likely only useful for testing to make sure the shapes drew correctly. */
	export let stroke = undefined;
	export let chartScrollIndex;
  
	function mouseoverCircle(point) {
		console.log(point)

	  d3.selectAll(".wine-circle.active").style("opacity", 0.1).style("fill", "#38425D");

	  d3.selectAll(`#circle-${point.data.id}`)
	  	.style("opacity", 0.8)
		.style("fill", "#CFCABF")
		.transition(500)
		.attr("r", 10)
		.each(function () {
			this.parentNode.appendChild(this); // Append to the end of the parent
		});

	  highlightWine.set(point.data)
	}

	function mouseleaveCircle(point) {
		d3.selectAll(".wine-circle circle")
		.style("opacity", 0.5)
		.style("fill", "#38425D")
		.transition(500)
		.attr("r", 4);

		highlightWine.set(undefined)
	}

	$: console.log({chartScrollIndex})
  
	$: points = chartScrollIndex < 5 
		? $data[0].map(d => {
				const point = [$xGet(d), $yGet(d)];
				point.data = d;
				return point;
		})
		: $data[1].map(d => {
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