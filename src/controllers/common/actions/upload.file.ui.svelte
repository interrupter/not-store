<script>
    import { notCommon } from "not-bulma";
    import { UISelect } from "not-bulma/src/elements/form";
    import { UIButton } from "not-bulma/src/elements/button";
    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import UIUpload from "../../../standalone/upload.svelte";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let bucket = "";

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

    function onFileSelect({ detail }) {
        const data = {
            bucket,
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
            bind:value={bucket}
            bind:variants={buckets}
            on:change={({ detail }) => {
                if (detail.value === "__CLEAR__") {
                    bucket = "";
                } else {
                    bucket = detail.value;
                }
            }}
        />
    </UIColumn>
</UIColumns>

{#if bucket}
    <UIUpload bind:id={bucket} show={true} on:filesAdded={onFileSelect} />
{/if}
