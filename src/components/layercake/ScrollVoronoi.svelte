<script>
	import { getContext } from 'svelte';
	import { uniques } from 'layercake';
	import { Delaunay } from 'd3-delaunay';
	import { selectAll, select } from 'd3-selection';
	import { tooltipType, lockedSelection } from "$stores/misc.js";
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');

	export let chartScrollIndex;

	let pointsData;
  
	function mouseoverCircle(point) {
		// console.log(point)
	
		tooltipType.set("bottle")

		selectAll(".wine-circle circle").style("opacity", 0.3).style("fill", "#38425D");

		selectAll(`#circle-${point.data.id}`)
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
		selectAll(".wine-circle circle")
			.style("opacity", 0.8)
			.style("fill", "#38425D")
			.transition(500)
			.attr("r", 4);
	}

	function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}.svg`
    }

	function setTooltip(data) {
		let tooltip = select("#universal-tooltip");
		tooltip.classed("visible", true);

		tooltip.select("img").attr("src", `./assets/images/vivinoLabels/img_${data.id}.png`);

		tooltip.select(".wine-name").text(data.name);
		tooltip.select(".winery-name").text(`${data.winery}, ${data.country}`);
		tooltip.select(".animal").text(`${data.topgroup}`);
		tooltip.select(".type").text(`${data.type}`);
		tooltip.select(".price").text(`$${data.price.toFixed(2)}`); // Add `$` for price formatting
		tooltip.select(".rating").html(
			`${data.rating}
			<span class="stars"><img alt="stars" src="./assets/images/stars/${formatStars(data.rating)}" /></span>`
		);
		
	}

	function setPointsData(chartScrollIndex) {
		if (chartScrollIndex == 9) {
			pointsData = $data[1].filter(d => d.topgroup.includes("amphibian/reptile"));
		} else if (chartScrollIndex == 10) {	
			pointsData = $data[1].filter(d => d.topgroup.includes("cat") || !d.topgroup.includes("cattle"));
		} else if (chartScrollIndex == 11) {
			pointsData = $data[1].filter(d => d.topgroup.includes("pig"));
		} else if (chartScrollIndex == 12) {
			pointsData = $data[1].filter(d => d.topgroup.includes("bird"));
		} else {
			pointsData = $data[1];
		}
	}

	$: setPointsData(chartScrollIndex);
  
	$: points = pointsData.map(d => {
				const point = [$xGet(d), $yGet(d)];
				point.data = d;
				return point;
		})
  
	$: uniquePoints = uniques(points, d => d.join(), false);
	$: voronoi = Delaunay.from(uniquePoints).voronoi([0, 0, $width, $height]);

	$: if (!$lockedSelection) {
		mouseleaveCircle();
	}
  </script>
  
  {#each uniquePoints as point, i}
	<path
		id={`voronoi-${point.data.id}`}
		class={"voronoi-cell"}
        class:active={
			(chartScrollIndex == 14) ||
			(chartScrollIndex == "exit")
		}
	  d={voronoi.renderCell(i)}
	  aria-label="scatterplot tooltip"
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
	  pointer-events: none;
	}
	.voronoi-cell.active {
		pointer-events: all;
	}
  </style>