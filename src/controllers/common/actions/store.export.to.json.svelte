<script>
    export let value = {};

    $: json = value && JSON.stringify(value, null, 4);
</script>

<pre>{json}</pre>
