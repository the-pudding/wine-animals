import { browser } from "$app/environment";
import { readable } from "svelte/store";

export default readable("none", (set) => {
	let ticking = false;
	let lastScrollY = 0;
	let lastDirection = "none"; // Initial state

	const updateScrollDirection = () => {
		const currentScrollY = window.scrollY;
		const direction = currentScrollY > lastScrollY ? "down" : currentScrollY < lastScrollY ? "up" : lastDirection;

		if (direction !== lastDirection) {
			set(direction);
			lastDirection = direction;
		}

		lastScrollY = currentScrollY;
		ticking = false;
	};

	const onScroll = () => {
		if (!ticking) {
			requestAnimationFrame(updateScrollDirection);
			ticking = true;
		}
	};

	if (browser) document.addEventListener("scroll", onScroll);

	return () => {
		if (browser) document.removeEventListener("scroll", onScroll);
	};
});
