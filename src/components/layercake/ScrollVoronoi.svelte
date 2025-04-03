<script>
	import { getContext } from 'svelte';
	import { uniques } from 'layercake';
	import { Delaunay } from 'd3-delaunay';
	import { selectAll, select } from 'd3-selection';
	import { tooltipType, tooltipData, lockedSelection, stealPriceNum, stealRatingNum } from "$stores/misc.js";
	import viewport from "$stores/viewport.js";
  
	const { data, xGet, yGet, width, height } = getContext('LayerCake');

	export let chartScrollIndex;

	// SCREENSIZE
	$: w = $viewport.width;
	$: h = $viewport.height;
	$: isMobile = w <= 720;

	let pointsData;
	let selectedPoint;
  
	function mouseoverCircle(point) {
		tooltipType.set("bottle")

		selectAll(".wine-circle circle")
			.style("opacity", 0.3)

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
	
	function mouseClickCircle(point) {
		selectedPoint = point;
		tooltipType.set("bottle")

		selectAll(".wine-circle circle")
			.style("opacity", 0.3)

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

		selectAll(`#circle-${point.data.id}`)
			.style("opacity", 0.8)
			.style("fill", function() {
				let fill =  (point.data.price <= $stealPriceNum && point.data.rating >= $stealRatingNum) ? "#3E5C4B" : "#475171";
				return fill
			})
			.transition(500)
			.attr("r", 5)
	}

	function formatStars(rating) {
        let string = rating + "";
        let ratingReplaced = string.replace(".", "_");
        return `star${ratingReplaced}.svg`
    }

	function setTooltip(data) {
		tooltipData.set(data);
		tooltipType.set("bottle");
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

	$: if (!$lockedSelection && selectedPoint) {
		mouseleaveCircle(selectedPoint);
	}
  </script>
  
  {#each uniquePoints as point, i}
	<path
		id={`voronoi-${point.data.id}`}
		class={"voronoi-cell"}
        class:active={
			((chartScrollIndex == 14) || (chartScrollIndex == "exit"))
			&& !isMobile
		}
	  d={voronoi.renderCell(i)}
	  aria-label="scatterplot tooltip"
	  on:mouseover={() => {
		if (!$lockedSelection && !isMobile) mouseoverCircle(point);
	  }}
	  on:mouseleave={() => {
		if (!$lockedSelection  && !isMobile) mouseleaveCircle(point);
	  }}
	  on:focus={() => {
		if (!$lockedSelection  && !isMobile) mouseoverCircle(point);
	  }}
	  on:click={() => {
		if(!isMobile) {
			lockedSelection.set(true);
			mouseClickCircle(point);
		}
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