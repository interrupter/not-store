<script>
    import { COMPONENTS } from "not-bulma/src/frame";

    export let _componentName;
    export let errors = false;
    export let fieldname = "options";
    export let formErrors = false;
    export let formLevelError = false;
    export let icon = false;
    export let label = "";
    export let placeholder = "empty select item";
    export let readonly = false;
    export let required = false;
    export let valid = true;
    export let validated = false;
    export let value;
</script>

<svelte:component
    this={COMPONENTS.get(_componentName)}
    bind:value
    on:change
    bind:errors
    bind:fieldname
    bind:formErrors
    bind:formLevelError
    bind:icon
    bind:label
    bind:placeholder
    bind:readonly
    bind:required
    bind:valid
    bind:validated
/>
