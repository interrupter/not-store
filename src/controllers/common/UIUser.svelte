<script>
    let { value } = $props();
</script>

{#if value?.username}
    {value.userID} # '{value.username}' ({value._id})
{:else}
    {value}
{/if}
