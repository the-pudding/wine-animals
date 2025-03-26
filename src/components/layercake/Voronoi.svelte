<script>
	import { getContext } from 'svelte';
	import { uniques } from 'layercake';
	import * as d3 from "d3";
	import { tooltipType, lockedSelection } from "$stores/misc.js";
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');
  
	export let stroke = undefined;
	export let chartScrollIndex;
  
	function mouseoverCircle(point) {
		// console.log(point)

		tooltipType.set("bottle")

		d3.selectAll("#animal-cards .card-wine-circle circle, .circle-explore").style("opacity", 0.3).style("fill", "#38425D");

		d3.selectAll(`#animal-cards #card-wine-circle-${point.data.id}, #animal-cards #circle-${point.data.id}`)
			.transition()
            .duration(500)
			.style("opacity", 1)
			.style("fill", "#CFCABF")
			.attr("r", 10)
			.each(function () {
				this.parentNode.appendChild(this); // Append to the end of the parent
			});

		setTooltip(point.data)
	}

	function mouseleaveCircle(point) {
		d3.selectAll("#animal-cards .card-wine-circle circle, #animal-cards .circle-explore")
			.transition()
			.duration(500)
			.style("opacity", 0.8)
			.style("fill", "#38425D")
			.attr("r", 4);
	}

	function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}.svg`
    }

	function setTooltip(data) {
		let tooltip = d3.select("#universal-tooltip");
		tooltip.classed("visible", true);

		tooltip.select("img").attr("src", `./assets/images/vivinoLabels/img_${data.id}.png`);

		tooltip.select(".wine-name").text(data.name);
		tooltip.select(".winery-name").text(`${data.winery}, ${data.country}`);
		tooltip.select(".animal").html(
			`${data.topgroup}
		 	<span class="chevron"><img alt="stars" src="./assets/images/chevron-right.png" /></span>
			${data.finalAnimal}`);
		tooltip.select(".type").text(`${data.type}`);
		tooltip.select(".price").text(`$${data.price.toFixed(2)}`); // Add `$` for price formatting
		tooltip.select(".rating").html(
			`${data.rating}
			<span class="stars"><img alt="stars" src="./assets/images/stars/${formatStars(data.rating)}" /></span>`
		);	
	}
  
	$: points = $data[0].map(d => {
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
		class={"voronoi-cell active"}
	  d={voronoi.renderCell(i)}
	  on:mouseover={() => {
		if (!$lockedSelection) mouseoverCircle(point);
	  }}
	  on:mouseleave={() => {
		if (!$lockedSelection) mouseleaveCircle(point);
	  }}
	  on:focus={() => {
		if (!$lockedSelection) mouseoverCircle(point);
	  }}
	  on:click={() => {
		lockedSelection.set(true);
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