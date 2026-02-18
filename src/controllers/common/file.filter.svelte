<script>
    import { notCommon } from "not-bulma";
    import {
        UISelect,
        UITextfield,
        UISwitch,
    } from "not-bulma/src/elements/form";

    import { UIButton } from "not-bulma/src/elements/button";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";

    import { onMount } from "svelte";

    let {
        filter = {
            store: "",
            name: "",
            extension: "",
        },
        stores = [],
        search = "",
        onSearchChange = () => {},
        onchange = () => {},
        onlyOriginal = false,
    } = $props();

    function getActionName() {
        return onlyOriginal ? "listAndCountOriginal" : "listAndCount";
    }

    function setFilter() {
        let copyFilter = {};
        Object.keys(filter).forEach((key) => {
            if (typeof filter[key] === "string" && filter[key].length === 0) {
                return;
            }
            copyFilter[key] = filter[key];
        });
        onchange({ filter: copyFilter, actionName: getActionName() });
    }

    let _stores = $state(stores);

    onMount(() => {
        notCommon
            .getApp()
            .getInterface("store")({})
            .setFilter({})
            .$listAndCount()
            .then((result) => {
                if (result && result.status === "ok") {
                    _stores.push(
                        ...result.result.list.map((itm) => {
                            return {
                                id: itm.name,
                                title: itm.name,
                            };
                        })
                    );
                    _stores = _stores;
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
            value={search}
            placeholder="Поиск"
            onchange={(detail) => {
                const search = detail.value.trim();
                onSearchChange(search);
            }}
        />
    </UIColumn>
</UIColumns>
<UIColumns>
    <UIColumn>
        <UISelect
            placeholder="Все хранилища"
            value={filter.store}
            variants={_stores}
            onchange={(detail) => {
                if (detail.value === "__CLEAR__") {
                    filter.store = "";
                } else {
                    filter.store = detail.value;
                }
            }}
        />
    </UIColumn>
    <UIColumn>
        <UISwitch label="Оригиналы" value={onlyOriginal} />
    </UIColumn>
    <UIColumn>
        <UITextfield placeholder="Название" value={filter.name} />
    </UIColumn>
    <UIColumn>
        <UITextfield placeholder="Тип" value={filter.extension} />
    </UIColumn>
    <UIColumn>
        <UIButton action={setFilter} title="Применить" color="primary" />
    </UIColumn>
</UIColumns>
