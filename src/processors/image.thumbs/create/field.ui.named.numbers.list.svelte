<script>
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import { UIButton } from "not-bulma/src/elements/button";
    import { UINumber, UITextfield } from "not-bulma/src/elements/form";
    import { UITitle } from "not-bulma/src/elements/various";

    export let value = {};
    export let label = "named numbers list";

    $: list = Object.keys(value).map((name) => {
        return {
            id: name,
            title: name,
            number: value[name],
        };
    });

    function remove(id) {
        if (Object.hasOwn(value, id)) {
            delete value[id];
            value = value;
        }
    }

    function add() {
        const id = newVal.id.trim();
        const number = parseInt(newVal.number);
        if (id && id !== "" && !isNaN(number) && !Object.hasOwn(value, id)) {
            value[id] = number;
        }
    }

    const createNewVal = () => {
        return {
            id: "new value",
            number: 0,
        };
    };

    let newVal = createNewVal();
</script>

<UITitle title={label} size={5} />
{#each list as item (item.id)}
    <UIColumns>
        <UIColumn classes="is-6">
            {item.title}
        </UIColumn>
        <UIColumn classes="is-4">
            {item.number}
        </UIColumn>
        <UIColumn classes="is-2">
            <UIButton icon={"minus"} action={() => remove(item.id)} />
        </UIColumn>
    </UIColumns>
{/each}
<UIColumns>
    <UIColumn classes="is-6">
        <UITextfield bind:value={newVal.id} />
    </UIColumn>
    <UIColumn classes="is-4">
        <UINumber bind:value={newVal.number} />
    </UIColumn>
    <UIColumn classes="is-2">
        <UIButton icon={"plus"} action={() => add()} />
    </UIColumn>
</UIColumns>
