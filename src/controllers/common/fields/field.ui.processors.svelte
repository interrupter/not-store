<script>
    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import FUIProcessorsActionPipelines from "not-store/src/controllers/common/fields/field.ui.processors.action.pipelines.svelte";
    import FUIProcessorsControl from "./field.ui.processors.control.svelte";

    import { COMPONENTS } from "not-bulma/src/frame";

    export let fieldname = "processors";
    export let value;

    export let actions = [];
    export let processors = [];

    onMount(() => {
        checkProcessorsContent();
    });

    function checkProcessorsContent() {
        console.log(
            "processors content before check",
            JSON.stringify(value, null, 4)
        );
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
        console.log(
            "processors content after check",
            JSON.stringify(value, null, 4)
        );
    }

    function addProcessor({ detail }) {
        const { action, processorName, place } = detail;
        console.log(addProcessor, action, processorName, place);
    }

    function onChange() {
        console.log("action pipelines changed");
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
            {action}
            {actions}
            {processors}
        />
    {/each}
{/if}
