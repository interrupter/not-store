<script>
    import { notCommon } from "not-bulma";
    import { UISelect, UITextfield } from "not-bulma/src/elements/form";
    import { UIButton } from "not-bulma/src/elements/button";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let filter = {
        store: "",
        name: "",
        extension: "",
    };

    let stores = [];
    let search = "";

    function setFilter() {
        let copyFilter = {};
        Object.keys(filter).forEach((key) => {
            if (typeof filter[key] === "string" && filter[key].length === 0) {
                return;
            }
            copyFilter[key] = filter[key];
        });
        dispatch("change", copyFilter);
    }

    onMount(() => {
        notCommon
            .getApp()
            .getInterface("store")({})
            .setFilter({ active: true })
            .$listAndCount()
            .then((result) => {
                if (result && result.status === "ok") {
                    stores.push(
                        ...result.result.list.map((itm) => {
                            return {
                                id: itm.name,
                                title: itm.name,
                            };
                        })
                    );
                    stores = stores;
                }
                notCommon.log(result);
            })
            .catch((e) => {
                notCommon.report(e);
            });
    });
</script>

<UIColumns>
    <UIColumn>
        <UITextfield
            bind:value={search}
            placeholder="Поиск"
            on:change={({ detail }) => {
                const search = detail.value.trim();
                dispatch("searchChange", search);
            }}
        />
    </UIColumn>
</UIColumns>
<UIColumns>
    <UIColumn>
        <UISelect
            placeholder="Все хранилища"
            bind:value={filter.store}
            bind:variants={stores}
            on:change={({ detail }) => {
                if (detail.value === "__CLEAR__") {
                    filter.store = "";
                } else {
                    filter.store = detail.value;
                }
            }}
        />
    </UIColumn>
    <UIColumn>
        <UITextfield placeholder="Название" bind:value={filter.name} />
    </UIColumn>
    <UIColumn>
        <UITextfield placeholder="Тип" bind:value={filter.extension} />
    </UIColumn>
    <UIColumn>
        <UIButton action={setFilter} title="Применить" color="primary" />
    </UIColumn>
</UIColumns>
