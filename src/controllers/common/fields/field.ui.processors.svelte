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

    onMount(() => {
        checkProcessorsContent();
    });

    function addProcessor(detail) {
        const { action, processorName, place } = detail;
    }

    function onChange({ action: actionName, value: actionPipelines }) {
        value[actionName] = actionPipelines;
        value = value;
        onchange({
            field: fieldname,
            value: $state.snapshot(value),
        });
    }
</script>

{#if value}
    {#each actions as action}
        <FUIProcessorsActionPipelines
            onchange={onChange}
            value={value[action]}
            {readonly}
            {action}
            {actions}
            {processors}
        />
    {/each}
{/if}
