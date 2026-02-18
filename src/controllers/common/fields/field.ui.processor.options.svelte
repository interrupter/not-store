<script>
    import { COMPONENTS } from "not-bulma/src/frame";
    import { UIButtons } from "not-bulma/src/elements/button";
    import { UISelect } from "not-bulma/src/elements/form";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import { UITitle } from "not-bulma/src/elements/various";
    import { onMount } from "svelte";

    let {
        index,
        value,
        processors = [],
        readonly = false,
        onchange = () => {},
        onup = () => {},
        ondown = () => {},
        onremove = () => {},
    } = $props();

    let id = Math.random();
    let optionsUI = $state("");

    const CLASSES = "is-small";

    onMount(() => {
        id = value.id;

        updateUI();
        console.log(JSON.stringify(processors, null, 4));
    });

    function updateUI() {
        const proc = processors.find((item) => {
            return item.id === value.name;
        });
        if (proc) {
            if (proc.optionsUI) {
                optionsUI = proc.optionsUI;
            } else {
                optionsUI = undefined;
                value.options = {};
            }
        }
    }

    function onOptionsChange(event) {
        console.log("options changes", event);
        value.options = event.value;
        value = value;
        console.log("options changed", $state.snapshot(value));
        onchange({ index, value: $state.snapshot(value) });
    }

    function onProcessorChange(detail) {
        const proc = processors.find((item) => {
            return item.id === detail.value;
        });
        if (proc) {
            if (proc.optionsUI) {
                optionsUI = proc.optionsUI;
            } else {
                optionsUI = undefined;
                value.options = {};
            }
            value.name = detail.value;
            value = value;
            onchange({ index, value });
        }
    }

    const ACTIONS = [
        {
            id: 1,
            icon: "angle-up",
            action: () => {
                console.log("move up", value);
                onup(index);
            },
            class: CLASSES,
        },
        {
            id: 2,
            icon: "angle-down",
            action: () => {
                console.log("move down", value);
                ondown(index);
            },
            class: CLASSES,
        },
        {
            id: 3,
            icon: "minus",
            action: () => {
                console.log("remove", index);
                onremove(index);
            },
            color: "danger",
            class: CLASSES,
        },
    ];
</script>

<UIColumns>
    <UIColumn classes="is-8">
        <div class="field is-narrow">
            <UISelect
                variants={processors}
                {readonly}
                value={value.name}
                onchange={onProcessorChange}
                fieldname="processor"
                class={CLASSES}
            />
        </div>
    </UIColumn>
    {#if !readonly}
        <UIColumn classes="is-4">
            <UIButtons values={ACTIONS} right={true} classes={CLASSES} />
        </UIColumn>
    {/if}
</UIColumns>

{#if optionsUI}
    <svelte:component
        this={COMPONENTS.get(optionsUI)}
        value={value.options}
        {readonly}
        onchange={onOptionsChange}
    />
{/if}
