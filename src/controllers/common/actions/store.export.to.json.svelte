<script>
    let { value } = $props();

    let json = $state("{}");

    $effect(() => {
        json = value && JSON.stringify(value, null, 4);
    });
</script>

<pre>{json}</pre>
