<script>
    import { notCommon } from "not-bulma";
    import { UISelect } from "not-bulma/src/elements/form";
    import { UIButton } from "not-bulma/src/elements/button";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import UIUpload from "../../../standalone/upload.svelte";

    import { onMount } from "svelte";

    let {
        storeName = "",
        onchange = () => {},
        onFilesAdded = () => {},
    } = $props();

    let stores = [];

    function setFilter() {
        onchange(filter);
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

    function onFileSelect(detail) {
        const data = {
            storeName: storeName,
            files: detail,
        };
        //console.log("file selected", data);
        onFilesAdded(data);
    }
</script>

<UIColumns>
    <UIColumn>
        <UISelect
            placeholder="Все хранилища"
            bind:value={storeName}
            bind:variants={stores}
            onchange={(detail) => {
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
    <UIUpload bind:id={storeName} show={true} onFilesAdded={onFileSelect} />
{/if}
