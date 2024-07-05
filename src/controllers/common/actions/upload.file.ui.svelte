<script>
    import { notCommon } from "not-bulma";
    import { UISelect } from "not-bulma/src/elements/form";
    import { UIButton } from "not-bulma/src/elements/button";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import UIUpload from "../../../standalone/upload.svelte";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let storeName = "";

    let stores = [];

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

    function onFileSelect({ detail }) {
        const data = {
            storeName: storeName,
            files: detail,
        };
        console.log("file selected", data);
        dispatch("filesAdded", data);
    }
</script>

<UIColumns>
    <UIColumn>
        <UISelect
            placeholder="Все хранилища"
            bind:value={storeName}
            bind:variants={stores}
            on:change={({ detail }) => {
                if (detail.value === "__CLEAR__") {
                    storeName = "";
                } else {
                    storeName = detail.value;
                }
            }}
        />
    </UIColumn>
</UIColumns>

{#if storeName}
    <UIUpload bind:id={storeName} show={true} on:filesAdded={onFileSelect} />
{/if}
