<script>
	import { chartView } from "$stores/misc.js";

	export let label;
	export let style = "inner";
	export let options = ["on", "off"];
	export let value = options[0];

	$: checked = $chartView === "scatter";

	const id = `toggle-${Math.floor(Math.random() * 1000000)}`;

	const handleClick = () => {
		checked = !checked;
		$chartView = checked ? "scatter" : "histogram";
	};
</script>

<div class="toggle toggle--{style}">
	<span class="label" {id}>{label}</span>
	<button
		role="switch"
		aria-checked={checked}
		aria-labelledby={id}
		on:click={handleClick}
	>
		{#if style === "inner"}
			<span>{options[0]}</span>
			<span>{options[1]}</span>
		{/if}
	</button>
</div>

<style>
	.toggle {
		z-index: 1000;
		width: 65%;
		margin: 0 auto;
		font-family: var(--sans);
	}
	.toggle button,
	.label {
		font-family: inherit;
		font-size: var(--12px);
		text-transform: uppercase;
		color: var(--wine-black);
	}

	.label {
		color: var(--wine-tan);
	}

	.toggle--inner [role="switch"][aria-checked="true"] :first-child,
	[role="switch"][aria-checked="false"] :last-child {
		display: inline-block;
		border-radius: 4px;
		background: var(--wine-red);
		color: var(--wine-black);
	}

	.toggle--inner button {
		padding: 0.5em;
		font-size: var(--16px);
		text-transform: capitalize;
		background-color: var(--wine-tan);
	}

	.toggle--inner button span {
		user-select: none;
		pointer-events: none;
		display: inline-block;
		line-height: 1;
		padding: 0.25em;
	}

	.toggle--inner button:focus {
		/* box-shadow: 0 0 4px 0 var(--color-focus); */
	}

	.toggle--slider {
		display: flex;
		align-items: center;
	}

	.toggle--slider button {
		width: 3.5em;
		height: 2em;
		position: relative;
		margin-left: 0.5em;
		background: var(--wine-tan);
		transition: background-color 0.5s ease-in-out, transform 0.5s ease-in-out;
	}

	.toggle--slider button:focus {
		/* box-shadow: 0 0px 4px var(--color-focus); */
	}
	.toggle--slider button[aria-checked="true"] {
		background-color: var(--wine-red);
		transition: transform 0.5s;
	}

	.toggle--slider button:focus {
		/* box-shadow: 0 0 4px 0 var(--color-focus); */
	}
</style>
