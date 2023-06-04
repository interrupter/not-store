<script>
    import FUIProcessorOptions from "./field.ui.processor.options.svelte";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import { Elements, Frame } from "not-bulma";
    import { notCommon } from "not-bulma/src/frame";
    const { UITitle } = Elements.Various;
    const { UIButton } = Elements.Buttons;

    const size = 6;
    const icon = "plus";

    export let fieldname = "pipeline";
    export let title = "pre";
    export let pipeline = [];
    export let processors = [];
    export let action;
    export let readonly = false;

    function actionAdd() {
        dispatch("add");
    }

    function moveUp({ detail }) {
        const index = detail;
        notCommon.moveItem(pipeline, index, index - 1);
        pipeline = pipeline;
        dispatch("change", { field: fieldname, value: pipeline });
    }

    function moveDown({ detail }) {
        const index = detail;
        notCommon.moveItem(pipeline, index, index + 1);
        pipeline = pipeline;
        dispatch("change", { field: fieldname, value: pipeline });
    }

    function onChange({ detail }) {
        const { index, value } = detail;
        pipeline[index] = value;
        pipeline = pipeline;
        dispatch("change", { field: fieldname, value: pipeline });
    }

    function removeItem({ detail }) {
        pipeline.splice(detail, 1);
        pipeline = pipeline;
        dispatch("change", { field: fieldname, value: pipeline });
    }
</script>

<div>
    <UITitle {title} {size} />
    {#each pipeline as processor, index (processor.id)}
        <FUIProcessorOptions
            bind:readonly
            value={processor}
            {processors}
            {action}
            {index}
            on:remove={removeItem}
            on:change={onChange}
            on:up={moveUp}
            on:down={moveDown}
        />
    {/each}
    {#if !readonly}
        <UIButton {icon} action={actionAdd} />
    {/if}
</div>
