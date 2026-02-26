<script>
    import UITitle from "not-bulma/src/elements/various/ui.title.svelte";
    import { UIButton } from "not-bulma/src/elements/button";

    import { UIColumns, UIColumn } from "not-bulma/src/elements/layout";
    import { UISelect, UITextfield } from "not-bulma/src/elements/form";

    import { UIField, UILabel, UIControl } from "not-bulma/src/elements/input";

    import { notCommon } from "not-bulma/src/frame";
    import { UISuccess, UIError } from "not-bulma/src/elements/notification";

    let { stores = [], models = [], variants = {} } = $props();

    let selectedStoreId = $state("");
    let newStoreName = $state("");
    let selectedModelsIds = $state([]);

    function onStoreChange({ field, value }) {
        selectedStoreId = value;
    }

    function onModelsChange({ field, value }) {
        selectedModelsIds = value;
    }

    console.log("stores", variants.stores);

    let loadingFilesStat = $state(false);
    let resultSuccess = $state(false);
    let resultError = $state(false);
    let resultMessage = $state("");

    function loadFiles() {
        loadingFilesStat = true;
        console.log("Selected target store:", $state.snapshot(selectedStoreId));
        console.log(
            "Selected source models:",
            $state.snapshot(selectedModelsIds).join(", ")
        );
        loadingFilesStat = true;
        resultError = false;
        resultSuccess = false;
        notCommon
            .getApp()
            .getModel("transfer")
            .setData({
                storeName: selectedStoreId,
                models: $state.snapshot(selectedModelsIds),
                newStoreName,
            })
            .$statsForFilesByModels({})
            .then((res) => {
                console.log("result", res);
                if (notCommon.isError(res)) {
                    resultError = true;
                    resultSuccess = false;
                    resultMessage = res.message;
                } else {
                    resultError = false;
                    resultSuccess = true;
                    resultMessage = "";
                }
            })
            .catch((e) => {
                resultError = true;
                resultSuccess = false;
                resultMessage = e.message;
            })
            .finally(() => {
                loadingFilesStat = false;
            });
    }
</script>

<UITitle
    title={"Перенос данных"}
    subtitle={"все файлы привязанные к выбранным моделям будут перемещены в новое хранилище"}
></UITitle>

<UIColumns>
    <UIColumn>
        <UIField>
            <UILabel label="not-store:field_target_store_label" />
            <UIControl>
                <UISelect
                    fieldname={"targetStore"}
                    variants={variants.stores}
                    value={selectedStoreId}
                    onchange={onStoreChange}
                    required={true}
                    emptyValueTitle={"Куда перемещаем?"}
                />
            </UIControl>
        </UIField>
        <UIField>
            <UILabel label="not-store:field_new_store_name_label" />
            <UIControl>
                <UITextfield
                    class={"mt-4"}
                    fieldname="newStoreName"
                    value=""
                    onchange={({ value }) => (newStoreName = value)}
                    placeholder="Изменить название хранилища?"
                /></UIControl
            >
        </UIField>
        <UIField>
            <UILabel label="not-store:field_source_models_label" />
            <UIControl>
                <UISelect
                    class={"mt-4"}
                    fieldname={"sourceModels"}
                    multiple={true}
                    size={20}
                    variants={variants.models}
                    value={selectedModelsIds}
                    onchange={onModelsChange}
                    required={true}
                    emptyValueTitle={"Из каких моделей?"}
                />
            </UIControl>
        </UIField>
    </UIColumn>
    <UIColumn
        ><UIButton onclick={loadFiles} loading={loadingFilesStat}
            >Перенести файлы</UIButton
        >
        {#if resultSuccess}
            <UISuccess
                class="mt-4"
                title="Перенос завершен"
                message="Перенос данных успешно завершен"
            ></UISuccess>
        {/if}
        {#if resultError}
            <UIError
                class="mt-4"
                title="Перенос прерван"
                message={resultMessage}
            ></UIError>
        {/if}
    </UIColumn>
</UIColumns>
