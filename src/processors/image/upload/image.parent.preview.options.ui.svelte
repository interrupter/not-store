<script>
    import { MODULE_NAME } from "not-store/src/const.cjs";

    import notPath from "not-path";

    import Common from "not-bulma/src/frame/common";
    import { onMount, createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    import { Elements } from "not-bulma";
    import { UITextfield, UILabel } from "not-bulma/src/elements/form";
    const { UIButton } = Elements.Buttons;
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    import DEFAULT_OPTIONS from "./image.parent.preview.options.cjs";

    export let value = Common.copyObj(DEFAULT_OPTIONS);

    export let fieldname = "options";
    export let readonly = false;

    const onChange = ({ detail }) => {
        notPath.set(`:${detail.field}`, value, {}, detail.value);
        value = value;
        dispatch("change", {
            field: fieldname,
            value,
        });
    };

    const RESET_OPTIONS_BUTTON = {
        title: "not-store:processors_options_reset_button_label",
        action() {
            value = Common.copyObj(DEFAULT_OPTIONS);
        },
    };
</script>

<UIBox>
    <div class="field">
        {#if Object.hasOwn(value, "variant")}
            <UILabel
                id="form-field-textfield-variant"
                label={`${MODULE_NAME}:field_store_processor_image.parent.preview_options_variant`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.variant}
                on:change={onChange}
                fieldname="variant"
            />
        {/if}
    </div>
    <div class="field"><UIButton {...RESET_OPTIONS_BUTTON} /></div>
</UIBox>
