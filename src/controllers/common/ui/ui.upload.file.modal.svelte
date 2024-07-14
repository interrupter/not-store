<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { notCommon } from "not-bulma";

    import UIUpload from "../../../standalone/upload.svelte";
    import { UIModal } from "not-bulma/src/elements/modal";

    export let show = false;
    export let storeName = "";
    export let title = "Загрузка файла";

    export let fieldname = "file";
    export let accept = "image/*";
    export let multiple = true;

    const closeButton = {
        title: "Закрыть",
        color: "warning",
        action: () => {
            show = false;
        },
    };

    function onFilesAdded({ detail }) {
        console.log("onFilesAdded", detail);
        const nsStore = notCommon.getApp().getService("nsStore");
        nsStore
            .onFilesAdded(storeName, detail)
            .then((results) => {
                notCommon.log("file upload results", results);
                if (results.error.length === 0) {
                    dispatch("resolve", results.success);
                } else {
                    dispatch("reject", results.error);
                }
                show = false;
            })
            .catch((er) => {
                notCommon.report(er);
                dispatch("reject", er);
                show = false;
            });
    }
</script>

<UIModal {show} {closeButton} {title}>
    <UIUpload
        bind:id={storeName}
        show={true}
        on:filesAdded={onFilesAdded}
        short={true}
        {fieldname}
        {accept}
        {multiple}
    />
</UIModal>
