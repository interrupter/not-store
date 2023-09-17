<script>
    import UINamedNumbersList from "not-bulma/src/elements/form/ui.named.numbers.list.svelte";
    import { MODULE_NAME } from "../../../const.cjs";
    import { SHARP_RESIZE_FIT_VARIANTS } from "./sharp.const.cjs";
    import notPath from "not-path";

    import Common from "not-bulma/src/frame/common";
    import { onMount, createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    import { Elements } from "not-bulma";
    import {
        UITextfield,
        UILabel,
        UISelect,
        UISwitch,
    } from "not-bulma/src/elements/form";
    const { UIButton } = Elements.Buttons;
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    import DEFAULT_OPTIONS from "./image.thumbs.create.options.cjs";

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
        {#if Object.hasOwn(value, "resize")}
            <UILabel
                id="form-field-switch-resize.fit"
                label={`${MODULE_NAME}:field_store_processor_image.thumbs.create_options_resize.fit`}
            />
            <UISelect
                variants={SHARP_RESIZE_FIT_VARIANTS.map((t) => {
                    return { id: t, title: t };
                })}
                bind:readonly
                bind:value={value.resize.fit}
                on:change={onChange}
                fieldname="resize.fit"
            />
        {/if}
    </div>
    {#if Object.hasOwn(value, "sizes")}
        <UINamedNumbersList
            bind:value={value.sizes}
            bind:readonly
            label={`${MODULE_NAME}:field_store_processor_image.thumbs.create_options_sizes`}
            on:change={onChange}
            fieldname="sizes"
        />
    {/if}
    <div class="field"><UIButton {...RESET_OPTIONS_BUTTON} /></div>
</UIBox>
