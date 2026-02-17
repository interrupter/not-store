<script>
    import { notCommon } from "not-bulma";

    import UIUpload from "../../../standalone/upload.svelte";
    import { UIModal } from "not-bulma/src/elements/modal";

    let {
        show = false,
        storeName = "",
        title = "Загрузка файла",
        fieldname = "file",
        accept = "image/*",
        multiple = true,
        onresolve = () => {},
        onreject = () => {},
    } = $props();

    const closeButton = {
        title: "Закрыть",
        color: "warning",
        action: () => {
            show = false;
        },
    };

    function onFilesAdded(detail) {
        console.log("onFilesAdded", detail);
        const nsStore = notCommon.getApp().getService("nsStore");
        nsStore
            .onFilesAdded(storeName, detail)
            .then((results) => {
                notCommon.log("file upload results", results);
                if (results.error.length === 0) {
                    onresolve(results.success);
                } else {
                    onreject(results.error);
                }
                show = false;
            })
            .catch((er) => {
                notCommon.report(er);
                onreject(er);
                show = false;
            });
    }
</script>

<UIModal {show} {closeButton} {title}>
    <UIUpload
        id={storeName}
        show={true}
        {onFilesAdded}
        short={true}
        {fieldname}
        {accept}
        {multiple}
    />
</UIModal>
