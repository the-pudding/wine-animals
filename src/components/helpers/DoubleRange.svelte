<script>
	import { clamp } from 'yootils';
	import filterScatterData from "$utils/filterScatterData.js";
	import { selectedPriceRangeSTORE, selectedRatingRangeSTORE, selectedYearRangeSTORE } from "$stores/misc.js";
	export let start = 0;
	export let end = 1;
	export let min = 0;
	export let max = 1;
    export let valType;
	let leftHandle;
	let rightHandle;
	let body;
	let slider;
	let animationFrame;

	// Calculate normalized values for rendering
	$: normalizedStart = (start - min) / (max - min);
	$: normalizedEnd = (end - min) / (max - min);


	// Throttle changes
	function debounce(callback, delay) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => callback(...args), delay);
		};
	}

	function throttle(callback, limit) {
		let waiting = false;
		return (...args) => {
			if (!waiting) {
				callback(...args);
				waiting = true;
				setTimeout(() => (waiting = false), limit);
			}
		};
	}

	// Function to denormalize the values back to actual range
	function denormalize(value) {
		return min + value * (max - min);
	}

    // Function to round to the nearest 0.5
	function roundToNearestHalf(value) {
		return `${Math.round(value * 2) / 2} stars`;
	}

	// Dynamically update data-content for handles
	$: leftHandle?.setAttribute('data-content', 
        valType == "price" ? 
        `$${Math.round(start)}` :
        valType == "rating" ?
        `${roundToNearestHalf(start)}` :
        `${Math.round(start)}` );
    $: rightHandle?.setAttribute('data-content', 
        valType == "price" ? 
        `$${Math.round(end)}` :
        valType == "rating" ?
        `${roundToNearestHalf(end)}` :
        `${Math.round(end)}` );

	// Make range draggable
	function draggable(node) {
		let x, y;

		function handleMousedown(event) {
			if (event.type === 'touchstart') {
				event = event.touches[0];
			}
			x = event.clientX;
			y = event.clientY;

			node.dispatchEvent(
				new CustomEvent('dragstart', { detail: { x, y } })
			);

			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('touchmove', handleMousemove);
			window.addEventListener('touchend', handleMouseup);
		}

		function handleMousemove(event) {
			if (event.type === 'touchmove') {
				event = event.changedTouches[0];
			}

			const dx = event.clientX - x;
			const dy = event.clientY - y;

			x = event.clientX;
			y = event.clientY;

			node.dispatchEvent(
				new CustomEvent('dragmove', { detail: { x, y, dx, dy } })
			);
		}

		function handleMouseup() {
			node.dispatchEvent(
				new CustomEvent('dragend', { detail: { x, y } })
			);

			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleMousemove);
			window.removeEventListener('touchend', handleMouseup);
		}

		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('touchstart', handleMousedown);

		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('touchstart', handleMousedown);
			}
		};
	}

	function setHandlePosition(which) {
		return function (evt) {
			const { left, right } = slider.getBoundingClientRect();
			const parentWidth = right - left;
			const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);

			cancelAnimationFrame(animationFrame);
			animationFrame = requestAnimationFrame(() => {
				if (which === 'start') {
					start = denormalize(p);
					end = Math.max(end, start);
				} else {
					start = Math.min(start, denormalize(p));
					end = denormalize(p);
				}
			});

			updateStores(start, end, valType);
		};
	}

	function setHandlesFromBody(evt) {
		const { width } = body.getBoundingClientRect();
		const { left, right } = slider.getBoundingClientRect();
		const parentWidth = right - left;
		const leftHandleLeft = leftHandle.getBoundingClientRect().left;
		const pxStart = clamp((leftHandleLeft + evt.detail.dx) - left, 0, parentWidth - width);
		const pxEnd = clamp(pxStart + width, width, parentWidth);
		const pStart = pxStart / parentWidth;
		const pEnd = pxEnd / parentWidth;
		start = denormalize(pStart);
		end = denormalize(pEnd);

		updateStores(start, end, valType);
	}

	const updateStores = debounce((start, end, valType) => {
		if (valType == "price") {
			selectedPriceRangeSTORE.set([start, end]);
		} else if (valType == "rating") {
			selectedRatingRangeSTORE.set([start, end]);
		} else {
			selectedYearRangeSTORE.set([start, end]);
		}
	}, 50);
</script>

<div class="double-range-container">
	<div class="slider" bind:this={slider}>
		<div
			class="body"
			bind:this={body}
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{setHandlesFromBody}"
			style="left: {100 * normalizedStart}%; right: {100 * (1 - normalizedEnd)}%;"
		></div>
		<div
			class="handle"
			bind:this={leftHandle}
			data-which="start"
			data-content="0"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{throttle(setHandlePosition('start'))}"
			style="left: {100 * normalizedStart}%;"
		></div>
		<div
			class="handle"
			bind:this={rightHandle}
			data-which="end"
			data-content="100"
			use:draggable
			on:dragmove|preventDefault|stopPropagation="{throttle(setHandlePosition('end'))}"
			style="left: {100 * normalizedEnd}%;"
		></div>
	</div>
</div>

<style>
	.double-range-container {
		width: 100%;
		height: 20px;
		user-select: none;
		box-sizing: border-box;
		white-space: nowrap
	}
	.slider {
		position: relative;
		width: 100%;
		height: 6px;
		top: 50%;
		transform: translate(0, -50%);
		background-color: var(--wine-med-gray);
	}
	.handle {
		position: absolute;
		top: 50%;
        transform: translate(0%, -50%);
		width: 0;
		height: 0;
        width: 24px;
		height: 24px;
		background-color: var(--wine-tan);
		border: 2px solid var(--wine-black);
        border-radius: 50%;
		transition: left 0.1s linear;
	}
    .handle[data-which="start"] {
        left: -16px;
    }
    .handle[data-which="end"] {
        right: -16px;
    }
	.handle[data-which]:after {
        content: attr(data-content);
        color: var(--wine-tan);
		font-family: var(--sans);
		font-weight: 700;
        position: absolute;
        white-space: nowrap;
        top: 20px;
    }
	.body {
		top: 0;
		position: absolute;
		background-color: var(--wine-dark-tan);
		bottom: 0;
	}
</style>