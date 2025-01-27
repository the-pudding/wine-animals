<script>
	// svelte event created via dispatch
	export let evt = {};
	export let offset = -35;

	let top;
	let left;

	let parentID;
	let topgroup;

	$: if (evt.detail) {
		parentID = (evt.detail.e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id).split("_")[1];
		topgroup = evt.detail.props.topgroup
		top = `${evt.detail.e.layerY + offset}px`;
		left = `${evt.detail.e.layerX}px`;
	}
</script>

{#if evt.detail && parentID !== undefined && topgroup !== undefined}
	{#if parentID == topgroup}
		<div style:top style:left>
			<small>
				<slot detail={evt.detail} />
			</small>
		</div>
	{/if}
{/if}

<style>
	div {
		position: absolute;
		width: 10em;
		border: 1px solid var(--color-gray-300);
		background: var(--color-white);
		transform: translate(-50%, -100%);
		padding: 0.5em;
		z-index: var(--z-top);
	}
</style>
