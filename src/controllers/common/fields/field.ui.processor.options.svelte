<script>
    import { COMPONENTS } from "not-bulma/src/frame";
    import { UIButtons } from "not-bulma/src/elements/button";
    import { UISelect } from "not-bulma/src/elements/form";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import { UITitle } from "not-bulma/src/elements/various";
    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let index;
    export let value;
    export let processors = [];
    export let readonly = false;

    let id = Math.random();
    let name = "generic";
    let options = {};
    let optionsUI;

    onMount(() => {
        id = value.id;
        name = value.name;
        options = value.options;
        updateUI(name);
    });

    function updateUI() {
        const proc = processors.find((item) => {
            return item.id === name;
        });
        if (proc) {
            if (proc.optionsUI) {
                optionsUI = proc.optionsUI;
            } else {
                optionsUI = undefined;
                options = {};
            }
        }
    }

    function onOptionsChange() {
        value.options = options;
        value = value;
        dispatch("change", { index, value });
    }

    function onProcessorChange({ detail }) {
        const proc = processors.find((item) => {
            return item.id === detail.value;
        });
        console.log("processor change", proc);
        if (proc) {
            if (proc.optionsUI) {
                optionsUI = proc.optionsUI;
            } else {
                optionsUI = undefined;
                options = {};
            }
            value.name = detail.value;
            value.options = options;
            value = value;
            dispatch("change", { index, value });
        }
    }

    const ACTIONS = [
        {
            icon: "angle-up",
            action: () => {
                console.log("move up", value);
                dispatch("up", index);
            },
            classes: "is-small",
        },
        {
            icon: "angle-down",
            action: () => {
                console.log("move down", value);
                dispatch("down", index);
            },
            classes: "is-small",
        },
        {
            icon: "minus",
            action: () => {
                console.log("remove", index);
                dispatch("remove", index);
            },
            color: "danger",
            classes: "is-small",
        },
    ];
</script>

<UIColumns>
    <UIColumn classes="is-8">
        <div class="field is-narrow">
            <UISelect
                variants={processors}
                bind:readonly
                bind:value={name}
                on:change={onProcessorChange}
                fieldname="processor"
                classes="is-small"
            />
        </div>
    </UIColumn>
    {#if !readonly}
        <UIColumn classes="is-4">
            <UIButtons values={ACTIONS} right={true} classes="is-small" />
        </UIColumn>
    {/if}
</UIColumns>
{#if optionsUI}
    <svelte:component
        this={COMPONENTS.get(optionsUI)}
        bind:value={options}
        bind:readonly
        on:change={onOptionsChange}
    />
{/if}
