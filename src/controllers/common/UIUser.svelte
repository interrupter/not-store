<script>
    export let value;
</script>

{#if value?.username}
    {value.userID} # '{value.username}' ({value._id})
{:else}
    {value}
{/if}
