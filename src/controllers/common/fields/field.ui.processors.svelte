<script>
    import { onMount } from "svelte";

    import FUIProcessorsActionPipelines from "./field.ui.processors.action.pipelines.svelte";

    import { COMPONENTS } from "not-bulma/src/frame";

    let {
        fieldname = "processors",
        value,
        readonly = false,
        actions = [],
        processors = [],
        onchange = () => {},
    } = $props();

    onMount(() => {
        checkProcessorsContent();
    });

    function checkProcessorsContent() {
        if (
            typeof value === "undefined" ||
            typeof value !== "object" ||
            value === "" ||
            Array.isArray(value)
        ) {
            value = {};
        }
        actions.forEach((action) => {
            if (!Object.hasOwn(value, action)) {
                value[action] = { pre: [], post: [] };
            }
        });
        value = value;
    }

    function addProcessor(detail) {
        const { action, processorName, place } = detail;
    }

    function onChange() {
        onchange({
            field: fieldname,
            value,
        });
    }
</script>

{#if actions && value}
    {#each actions as action}
        <FUIProcessorsActionPipelines
            onchange={onChange}
            value={value[action]}
            readonly
            {action}
            {actions}
            {processors}
        />
    {/each}
{/if}
