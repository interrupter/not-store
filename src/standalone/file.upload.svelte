<script>
    let {
        uploaded = false,
        data = {
            name: "default.file.name",
            size: 1000,
            preview: false,
        },
    } = $props();
</script>

<div class="tile file is-3 is-child" data-id={data.id}>
    {#if !uploaded}
        <progress class="progress is-link"></progress>
    {/if}
    {#if typeof data.preview === "string"}
        <figure class="image is-4by3">
            <img alt={data.name} src={data.preview} />
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
        width: 100%;
        object-fit: cover;
        transition: 0.5s ease;
        backface-visibility: hidden;
    }

    .image:hover img {
        opacity: 0.3;
    }
</style>
