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

    const CLASSES = "is-small";

    onMount(() => {
        id = value.id;
        name = value.name;
        options = value.options;
        updateUI(name);
        console.log(JSON.stringify(processors, null, 4));
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
            classes: CLASSES,
        },
        {
            icon: "angle-down",
            action: () => {
                console.log("move down", value);
                dispatch("down", index);
            },
            classes: CLASSES,
        },
        {
            icon: "minus",
            action: () => {
                console.log("remove", index);
                dispatch("remove", index);
            },
            color: "danger",
            classes: CLASSES,
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
                classes={CLASSES}
            />
        </div>
    </UIColumn>
    {#if !readonly}
        <UIColumn classes="is-4">
            <UIButtons values={ACTIONS} right={true} classes={CLASSES} />
        </UIColumn>
    {/if}
</UIColumns>
{#if optionsUI && COMPONENTS.get(optionsUI)}
    <svelte:component
        this={COMPONENTS.get(optionsUI)}
        bind:value={options}
        bind:readonly
        on:change={onOptionsChange}
    />
{/if}
