<script>
    let { value } = $props();
</script>

{#if value}
    <pre>{JSON.stringify(value, null, 4)}</pre>
{/if}
