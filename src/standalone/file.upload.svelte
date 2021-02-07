<script>
	export let uploaded = false;
	export let data = {
		name: 'default.file.name',
		size: 1000,
		preview: false
	};
</script>



<div class="tile file is-3 is-child" data-id="{data.id}">
	{#if !uploaded}
	<progress class="progress is-link"></progress>
	{/if}
	{#if data.preview}
	<figure class="image is-4by3 is-fullwidth">
		<img alt={data.name} src="{data.preview}" />
	</figure>
	{/if}
</div>


<style>
	.file {
		float: left;
		margin: 1em;
		padding: 0.5em;
	}

	figure.image {
		overflow: hidden;
	}

	figure.image img {
		opacity: 1;
		display: block;
		object-fit: cover;
		transition: .5s ease;
		backface-visibility: hidden;
	}

	.image:hover img {
		opacity: 0.3;
	}

</style>
