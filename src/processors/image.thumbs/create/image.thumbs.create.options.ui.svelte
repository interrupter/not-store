<script>
    import FUINamedNumbersList from "./field.ui.named.numbers.list.svelte";
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
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    import DEFAULT_OPTIONS from "./image.thumbs.create.options.cjs";

    export let value = Common.copyObj(DEFAULT_OPTIONS);

    export let fieldname = "options";
    export let readonly = false;

    const onChange = ({ detail }) => {
        notPath.set(`:${detail.field}`, value, {}, detail.value);
        dispatch("change", {
            field: fieldname,
        });
    };
</script>

<UIBox>
    <div class="field">
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
    </div>
    <div class="field">
        <UILabel
            id="form-field-switch-saveOriginal"
            label={`${MODULE_NAME}:field_store_processor_image.thumbs.create_options_saveOriginal`}
        />
        <UISwitch
            bind:readonly
            bind:value={value.saveOriginal}
            on:change={onChange}
            fieldname="saveOriginal"
        />
    </div>
    <FUINamedNumbersList
        bind:value={value.sizes}
        label={`${MODULE_NAME}:field_store_processor_image.thumbs.create_options_sizes`}
    />
</UIBox>
