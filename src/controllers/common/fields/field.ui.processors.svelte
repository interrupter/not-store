<script>
    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import FUIProcessorsActionPipelines from "./field.ui.processors.action.pipelines.svelte";

    import { COMPONENTS } from "not-bulma/src/frame";

    export let fieldname = "processors";
    export let value;
    export let readonly = false;

    export let actions = [];
    export let processors = [];

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

    function addProcessor({ detail }) {
        const { action, processorName, place } = detail;
    }

    function onChange() {
        dispatch("change", {
            field: fieldname,
            value,
        });
    }
</script>

{#if actions}
    {#each actions as action}
        <FUIProcessorsActionPipelines
            on:change={onChange}
            bind:value={value[action]}
            bind:readonly
            {action}
            {actions}
            {processors}
        />
    {/each}
{/if}
