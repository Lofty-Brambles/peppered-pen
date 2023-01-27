<script lang="ts">
	export let dimensions = "3rem";
	export let navMenuID = "nav";
	export let expanded = false;

	const toggle = () => {
		expanded = !expanded;
	};
</script>

<button
	type="button"
	aria-controls={navMenuID}
	aria-expanded={expanded}
	aria-label={`${expanded ? "Close" : "Open"} the navigation menu`}
	style={`--dimensions: calc(${dimensions} + 0.5rem)`}
	on:click={toggle}
>
	<svg
		width={dimensions}
		height={dimensions}
		viewBox="0-2 31 46"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g transform="matrix(1,0,0,1,-389.5,-264.004)">
			<g>
				<g transform="matrix(1,0,0,1,0,5)">
					<path
						class="mover"
						d="M390,270L420,270L420,270C420,270 420.195,250.19 405,265C389.805,279.81 390,279.967 390,279.967"
					/>
				</g>
				<g
					transform="matrix(1,1.22465e-16,1.22465e-16,-1,0.00024296,564.935)"
				>
					<path
						class="mover"
						d="M390,270L420,270L420,270C420,270 420.195,250.19 405,265C389.805,279.81 390,279.967 390,279.967"
					/>
				</g>
				<path d="M390,284.967L420,284.967" />
			</g>
		</g>
	</svg>
</button>

<style lang="sass">
	@use "../../utilities/utils" as *

	button
		cursor: pointer
		+box(var(--dimensions))
		+flex()

		background-color: transparent
		border: none
		border-radius: 0.5rem
		padding: 0

		&:hover
			background-color: var(--btn-hover)

	svg
		fill-rule: evenodd
		clip-rule: evenodd
		stroke-linecap: round
		stroke-linejoin: round
		stroke-miterlimit: 1.5

	path
		fill: none
		stroke: var(--base)
		stroke-width: 0.25rem
	
	.mover
		stroke-dasharray: 30, 75.39
		transition: all 0.6s cubic-bezier(0.6, 0.33, 0.67, 1.29)

	button[aria-expanded='true'] .mover
		stroke-dasharray: 75.39
		stroke-dashoffset: -60
</style>
