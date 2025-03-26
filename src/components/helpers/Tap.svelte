<script>
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import { createEventDispatcher } from "svelte";
	import { currAnimalSlide } from "$stores/misc.js";

	export let debug = false;
	export let enableKeyboard = false;
	export let full = false;
	export let showArrows = false; // boolean or array of directions
	export let directions = ["left", "right"];
	export let size = "100px";
	export let arrowStrokeWidth = "2";
	export let arrowPosition = "center"; // start, center, end

	const dispatch = createEventDispatcher();
	let innerHeight;

	$: getW = (dir) =>
		Array.isArray(size) ? size[directions.indexOf(dir)] : full ? "100%" : size;
	$: getH = (dir) =>
		["up", "down"].includes(dir) ? size : full ? "100%" : size;

	$: onKeyDown = (e) => {
		const dir = e.key.replace("Arrow", "").toLowerCase();
		const hasDir = directions.includes(dir);
		if (enableKeyboard && hasDir) {
			e.preventDefault();
			dispatch("tap", dir);
		}
	};

	$: visibleArrows = directions.filter((d) =>
		typeof showArrows === "boolean" ? showArrows : showArrows.includes(d)
	);
</script>

<svelte:window on:keydown={onKeyDown} bind:innerHeight />

<section class:debug style="height: {innerHeight}px;">
	{#each directions as dir}
		<button
			on:click={dispatch("tap", dir)}
			aria-label={dir}
			class="{dir} {arrowPosition}"
			class:full
			disabled={dir == "left" && $currAnimalSlide == 0
				|| dir == "right" && $currAnimalSlide == 15}
		>
			{#if visibleArrows.includes(dir)}
				<span class="arrow-span">
					{#if dir === "left"}
						<ChevronLeft color={"#181A1F"} strokeWidth={arrowStrokeWidth} />
					{:else if dir === "right"}
						<ChevronRight color={"#181A1F"} strokeWidth={arrowStrokeWidth} />
					{/if}
				</span>
			{/if}
		</button>
	{/each}
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: var(--z-overlay);
		pointer-events: none;
	}

	button {
		position: absolute;
		cursor: pointer;
		background: var(--wine-gold);
		border-radius: 0;
		outline: none;
		border: none;
		box-shadow: none;
		pointer-events: auto;
		display: flex;
		width: 80px;
		height: 80px;
	}

	.arrow-span {
		width: 36px;
		height: 36px;
	}

	button.left::before {
		content: "";
		width: 100%;
		height: 100%;
		background: var(--wine-gold);
		border-radius: 50%;
		position: absolute;
		right: -50%;
		top: 0;
	}

	button.right::before {
		content: "";
		width: 100%;
		height: 100%;
		background: var(--wine-gold);
		border-radius: 50%;
		position: absolute;
		left: -50%;
		top: 0;
	}

	button:disabled {
		opacity: 0.2;
		cursor: not-allowed;
	}

	button:not([disabled]):hover { 
		background-color: var(--wine-dark-gold);
	}

	button:not([disabled]):hover::before { 
		background-color: var(--wine-dark-gold);
	}

	.left {
		left: -70px;
		top: 0;
		/* text-align: left; */
	}

	.right {
		right: -70px;
		top: 0;
		/* text-align: right; */
	}

	.left.start,
	.right.start {
		align-items: flex-start;
	}

	.left.center,
	.right.center {
		top: 50%;
		transform: translateY(-50%);
	}

	.left.end,
	.right.end {
		bottom: 0;
		top: auto;
	}

	.up {
		top: 0;
		left: 0;
		/* text-align: center; */
	}

	.down {
		bottom: 0;
		left: 0;
		/* text-align: center; */
	}

	.up.center,
	.down.center {
		left: 50%;
		transform: translateX(-50%);
	}

	.up.end,
	.down.end {
		right: 0;
		left: auto;
	}

	/* full positions */
	.full.left.start,
	.full.right.start {
		align-items: flex-start;
	}

	.full.left.center,
	.full.right.center {
		align-items: center;
	}

	.full.left.end,
	.full.right.end {
		align-items: flex-end;
	}

	.full.up.start,
	.full.down.start {
		justify-content: flex-start;
	}

	.full.up.center,
	.full.down.center {
		justify-content: center;
	}

	.full.up.end,
	.full.down-end {
		justify-content: flex-end;
	}

	span {
		display: inline-block;
		line-height: 1;
	}

	.left span {
		position: absolute;
		right: -40%;
		top: 50%;
		transform: translateY(-50%);
	}

	.right span {
		position: absolute;
		left: -40%;
		top: 50%;
		transform: translateY(-50%);
	}

	.debug .left {
		background: red;
		opacity: 0.5;
	}

	.debug .right {
		background: red;
		opacity: 0.5;
	}

	.debug .up {
		background: orange;
		opacity: 0.5;
	}

	.debug .down {
		background: orange;
		opacity: 0.5;
	}

	@media(max-width: 700px) {
		button {
			width: 60px;
			height: 60px;
		}

		.left {
			left: -50px;
		}

		.right {
			right: -50px;
		}

		.arrow-span {
			width: 30px;
			height: 30px;
		}
	}
</style>
