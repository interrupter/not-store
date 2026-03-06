<script>
    import { MODULE_NAME } from "./../../../const.cjs";

    import notPath from "not-path";

    import Common from "not-bulma/src/frame/common";
    import { onMount } from "svelte";

    import { Elements } from "not-bulma";
    import {
        UISwitch,
        UITextfield,
        UILabel,
    } from "not-bulma/src/elements/form";

    const { UIButton } = Elements.Buttons;
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    import DEFAULT_OPTIONS from "./image.parent.preview.options.cjs";

    let {
        value = Common.copyObj(DEFAULT_OPTIONS),
        fieldname = "options",
        readonly = false,
        onchange = () => {},
    } = $props();

    function onChangeVariant(event) {
        value.variant = event.value;
        value = value;
        console.log("options variant", value.variant);
        onchange({
            field: fieldname,
            value,
        });
    }

    function onChangeAll(event) {
        value.all = event.value;
        value = value;
        console.log("options all", value.all);
        onchange({
            field: fieldname,
            value,
        });
    }

    const RESET_OPTIONS_BUTTON = {
        title: "not-store:processors_options_reset_button_label",
        action() {
            value = Common.copyObj(DEFAULT_OPTIONS);
        },
    };
</script>

<UIBox>
    {#if Object.hasOwn(value, "variant")}
        <div class="field">
            <UILabel
                id="form-field-textfield-variant"
                label={`${MODULE_NAME}:field_store_processor_image.parent.preview_options_variant`}
            />
            <UITextfield
                {readonly}
                disabled={value.all}
                value={value.variant}
                onchange={onChangeVariant}
                fieldname="variant"
            />
        </div>
    {/if}
    {#if Object.hasOwn(value, "all")}
        <div class="field">
            <UISwitch
                label="Все"
                {readonly}
                value={value.all}
                onchange={onChangeAll}
                fieldname="all"
            />
        </div>
    {/if}

    <div class="field mt-4"><UIButton {...RESET_OPTIONS_BUTTON} /></div>
</UIBox>
