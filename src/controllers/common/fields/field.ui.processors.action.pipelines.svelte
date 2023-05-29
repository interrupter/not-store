<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { UITitle } from "not-bulma/src/elements/various";
    import { UIBox } from "not-bulma/src/elements/block";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import FUIProcessorsPipeline from "not-store/src/controllers/common/fields/field.ui.processors.pipeline.svelte";
    export let value = {
        pre: [],
        post: [],
    };
    export let action;
    export let actions = [];
    export let processors = [];

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
            dispatch("change");
        }
    }

    function addPre() {
        add("pre");
    }

    function addPost() {
        add("post");
    }

    function onChangePost({ detail }) {
        value.post = detail.value;
        value = value;
        dispatch("change");
    }
    function onChangePre({ detail }) {
        value.pre = detail.value;
        value = value;
        dispatch("change");
    }
</script>

{#if processors.length}
    <UIBox>
        <UIColumns>
            <UIColumn classes="is-5">
                <FUIProcessorsPipeline
                    bind:pipeline={value.pre}
                    title="pre"
                    on:add={addPre}
                    on:change={onChangePre}
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
                    bind:pipeline={value.post}
                    title="post"
                    on:add={addPost}
                    on:change={onChangePost}
                    {action}
                    {actions}
                    {processors}
                />
            </UIColumn>
        </UIColumns>
    </UIBox>
{/if}
