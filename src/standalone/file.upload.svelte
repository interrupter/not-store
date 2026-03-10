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

<div class="cell" data-id={data.id}>
    {#if !uploaded}
        <progress class="progress is-link"></progress>
    {/if}
    {#if typeof data.preview === "string"}
        <figure class="image is-4by3">
            <img alt={data.name} src={data.preview} />
        </figure>
    {/if}
</div>
