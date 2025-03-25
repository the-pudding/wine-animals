<script>
	import wordmark from "$svg/wordmark-blackletter.svg";
</script>

<header>
	<div class="wordmark">
		<a href="https://pudding.cool" aria-label="The Pudding" target="_self"
			>{@html wordmark}</a
		>
	</div>
</header>

<style>
	header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 900;
		pointer-events: none;
	}
	.wordmark {
		max-width: 10em;
		margin: 0 auto;
		padding: 1em 0;
		pointer-events: auto;
	}

	.wordmark a {
		border: none;
		display: block;
		color: var(--color-fg);
	}

	.wordmark a:hover {
		background-color: transparent;
	}

	:global(header .wordmark svg) {
		width: 100%;
	}

	:global(header .wordmark svg path) {
		/* fill: black; */
		fill: var(--wine-tan);
	}
</style>
