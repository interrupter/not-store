<script>
    import FUIProcessorOptions from "./field.ui.processor.options.svelte";

    import { Elements, Frame } from "not-bulma";
    import { notCommon } from "not-bulma/src/frame";
    const { UITitle } = Elements.Various;
    const { UIButton } = Elements.Buttons;

    const size = 6;
    const icon = "plus";

    let {
        fieldname = "pipeline",
        title = "pre",
        pipeline = [],
        processors = [],
        action,
        readonly = false,
        onadd = () => {},
        onchange = () => {},
    } = $props();

    function moveUp(detail) {
        const index = detail;
        notCommon.moveItem(pipeline, index, index - 1);
        pipeline = pipeline;
        onchange({ field: fieldname, value: $state.snapshot(pipeline) });
    }

    function moveDown(detail) {
        const index = detail;
        notCommon.moveItem(pipeline, index, index + 1);
        pipeline = pipeline;
        onchange({ field: fieldname, value: $state.snapshot(pipeline) });
    }

    function onChange(detail) {
        const { index, value } = detail;
        pipeline[index] = value;
        pipeline = pipeline;
        console.log("pipeline changed", $state.snapshot(pipeline));
        onchange({ field: fieldname, value: $state.snapshot(pipeline) });
    }

    function removeItem(detail) {
        pipeline.splice(detail, 1);
        pipeline = pipeline;
        onchange({ field: fieldname, value: $state.snapshot(pipeline) });
    }
</script>

<div>
    <UITitle {title} {size} />
    {#each pipeline as processor, index (processor.id)}
        <FUIProcessorOptions
            {readonly}
            value={processor}
            {processors}
            {action}
            {index}
            onremove={removeItem}
            onchange={onChange}
            onup={moveUp}
            ondown={moveDown}
        />
    {/each}
    {#if !readonly}
        <UIButton {icon} action={onadd} />
    {/if}
</div>
