<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { uniques } from 'layercake';
	import * as d3 from "d3";
	import { Delaunay } from 'd3-delaunay';
	import { bigScatterData, highlightWine, tooltipType } from "$stores/misc.js";
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');
  
	/** @type {String|undefined} [stroke] – An optional stroke color, which is likely only useful for testing to make sure the shapes drew correctly. */
	export let stroke = undefined;
	export let chartScrollIndex;
  
	function mouseoverCircle(point) {
		// console.log(point)
	
		tooltipType.set("bottle")

		d3.selectAll(".wine-circle circle").style("opacity", 0.3).style("fill", "#38425D");

		d3.selectAll(`#circle-${point.data.id}`)
			.style("opacity", 1)
			.style("fill", "#CFCABF")
			.transition(500)
			.attr("r", 10)
			.each(function () {
				this.parentNode.appendChild(this); // Append to the end of the parent
			});

		setTooltip(point.data)
	}

	function mouseleaveCircle(point) {
		d3.selectAll(".wine-circle circle")
		.style("opacity", 0.8)
		.style("fill", "#38425D")
		.transition(500)
		.attr("r", 4);

		// let tooltip = d3.selectAll("#universal-tooltip");
		// tooltip.classed("visible", false);
	}

	function setTooltip(data) {
		let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", true);

		tooltip.select("img").attr("src", `./assets/images/vivinoLabels/img_${data.id}.png`);

		tooltip.select(".wine-name").text(data.name);
		tooltip.select(".winery-name").text(`${data.winery}, ${data.country}`);
		tooltip.select(".animal").text(`${data.topgroup}`);
		tooltip.select(".type").text(`${data.type}`);
		tooltip.select(".price").text(`$${data.price.toFixed(2)}`); // Add `$` for price formatting
		tooltip.select(".rating").text(`${data.rating} stars`);
		
	}
  
	$: points = $data[1].map(d => {
				const point = [$xGet(d), $yGet(d)];
				point.data = d;
				return point;
		})
  
	$: uniquePoints = uniques(points, d => d.join(), false);
  
	$: voronoi = d3.Delaunay.from(uniquePoints).voronoi([0, 0, $width, $height]);
  </script>
  
  {#each uniquePoints as point, i}
	<path
		id={`voronoi-${point.data.id}`}
		class={"voronoi-cell"}
        class:active={chartScrollIndex >= 5 && chartScrollIndex < 9 
            || chartScrollIndex == 9 && point.data.topgroup.includes("bird")
            || chartScrollIndex == 10 && point.data.topgroup.includes("cattle")
            || chartScrollIndex == 11 && point.data.topgroup.includes("cat")
            || chartScrollIndex == 13
            || chartScrollIndex == "exit"}
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
	  pointer-events: none;
	  outline: none;
	  cursor: pointer;
	}
	.voronoi-cell.active {
		pointer-events: all;
	}
  </style>