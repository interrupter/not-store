<script>
    import { notCommon } from "not-bulma";
    import { UISelect } from "not-bulma/src/elements/form";
    import { UIButton } from "not-bulma/src/elements/button";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let filter = {
        bucket: "",
    };

    let buckets = [];

    function setFilter() {
        dispatch("change", filter);
    }

    onMount(() => {
        notCommon
            .getApp()
            .getInterface("store")({})
            .setFilter({ active: true })
            .$listAndCount()
            .then((result) => {
                if (result && result.status === "ok") {
                    buckets.push(
                        ...result.result.list.map((itm) => {
                            return {
                                id: itm.name,
                                title: itm.name,
                            };
                        })
                    );
                    buckets = buckets;
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
        <UISelect
            placeholder="Все хранилища"
            bind:value={filter.bucket}
            bind:variants={buckets}
            on:change={({ detail }) => {
                if (detail.value === "__CLEAR__") {
                    filter.bucket = "";
                } else {
                    filter.bucket = detail.value;
                }
            }}
        />
    </UIColumn>
    <UIColumn>
        <UIButton action={setFilter} title="Применить" color="primary" />
    </UIColumn>
</UIColumns>
