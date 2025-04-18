<script>
	/**
	 * This component manages which item is most in view for scroll triggering
	 * example:
	 * <Scrolly
	 * 	bind:value={scrollIndex}
	 * >
	 * **items here**
	 * </Scrolly>
	 *
	 * optional params with defaults
	 * <Scrolly root={null} top={0} bottom={0} increments={100}>
	 */
	import { onMount } from "svelte";
	export let root = null;
	export let top = 0;
	export let bottom = 0;
	export let increments = 100;
	export let value = undefined;
	export let container;

	const steps = [];
	const threshold = [];

	let nodes = [];
	let intersectionObservers = [];

	$: top, bottom, update();
	let previousRatios = new Array(steps.length).fill(0);

	const update = () => {
		if (!nodes.length) return;
		nodes.forEach(createObserver);
	};

	const mostInView = () => {
		let maxRatio = 0;
		let maxIndex = -1;
		let hasExitedLastStep = false;
		for (let i = 0; i < steps.length; i++) {
			if (steps[i] > maxRatio) {
				maxRatio = steps[i];
				maxIndex = i;
			}

			// Check if the step has exited (was in view, now not in view)
			if (previousRatios[i] > 0 && steps[i] === 0) {
				// Step has exited
				if (i === steps.length - 1) {
					// Handle exiting the last step
					hasExitedLastStep = true;
				}
			}

			// Update the previousRatios for the next tick
			previousRatios[i] = steps[i];
		}


		if (maxRatio > 0) {
			// Set value to the most visible step
			value = maxIndex;
		} else if (hasExitedLastStep) {
			// Only set to exitStep if the last step has been scrolled past
			value = "exit";
		} else {
			// If no steps are in view and we haven't passed the last step, it might mean we're above the first step
			value = undefined;
		}
	};


	const createObserver = (node, index) => {
		const handleIntersect = (e) => {
			const intersecting = e[0].isIntersecting;
			const ratio = e[0].intersectionRatio;
			steps[index] = ratio;
			mostInView();
		};

		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin, threshold };

		if (intersectionObservers[index]) intersectionObservers[index].disconnect();

		const io = new IntersectionObserver(handleIntersect, options);
		io.observe(node);
		intersectionObservers[index] = io;
	};

	onMount(() => {
		for (let i = 0; i < increments + 1; i++) {
			threshold.push(i / increments);
		}
		nodes = container.querySelectorAll(":scope > *:not(iframe)");
		update();
	});
</script>

<div bind:this={container}>
	<slot />
</div>

<style>
	div {
		position: relative;
		z-index: 900;
		padding: 0 0.75rem;
		pointer-events: none;
	}
</style>