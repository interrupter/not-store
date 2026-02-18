<script>
    import { UITitle } from "not-bulma/src/elements/various";
    import { UIBox } from "not-bulma/src/elements/block";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import FUIProcessorsPipeline from "./field.ui.processors.pipeline.svelte";
    let {
        value = {
            pre: [],
            post: [],
        },
        action,
        actions = [],
        processors = [],
        readonly = false,
        onchange = () => {},
    } = $props();

    function add(to) {
        if (processors.length) {
            value[to].push({
                id: Math.random(),
                name: processors[0].id,
                options: JSON.parse(
                    JSON.stringify(processors[0].optionsDefault)
                ),
            });
            value[to] = value[to];
            value = value;
            onchange({ action, value: $state.snapshot(value) });
        }
    }

    function addPre() {
        add("pre");
    }

    function addPost() {
        add("post");
    }

    function onChangePost(detail) {
        value.post = detail.value;
        value = value;
        onchange({ action, value: $state.snapshot(value) });
    }
    function onChangePre(detail) {
        value.pre = detail.value;
        value = value;
        onchange({ action, value: $state.snapshot(value) });
    }
</script>

{#if processors.length}
    <UIBox>
        <UIColumns>
            <UIColumn classes="is-5">
                <FUIProcessorsPipeline
                    {readonly}
                    pipeline={value.pre}
                    title="pre"
                    onadd={addPre}
                    onchange={onChangePre}
                    {action}
                    {actions}
                    {processors}
                />
            </UIColumn>
            <UIColumn classes="is-2">
                <UITitle title={action} size={4} />
            </UIColumn>
            <UIColumn classes="is-5">
                <FUIProcessorsPipeline
                    {readonly}
                    pipeline={value.post}
                    title="post"
                    onadd={addPost}
                    onchange={onChangePost}
                    {action}
                    {actions}
                    {processors}
                />
            </UIColumn>
        </UIColumns>
    </UIBox>
{/if}
