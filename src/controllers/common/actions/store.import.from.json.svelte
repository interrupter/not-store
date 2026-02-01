<script>
    import UITextarea from "not-bulma/src/elements/form/ui.textarea.svelte";
    import UIButton from "not-bulma/src/elements/button/ui.button.svelte";
    import { MODULE_NAME } from "../../../const.cjs";

    /**
     * @typedef {Object} Props
     * @property {string} [value]
     * @property {boolean} [loading]
     * @property {function} [onimport]
     */

    /** @type {Props} */
    let { value = $bindable(""), loading, onimport = () => {} } = $props();
</script>

<UITextarea bind:value rows={20} disabled={loading} placeholder={""} />

<UIButton
    action={() => {
        onimport(value);
    }}
    color={"primary"}
    disabled={loading}
    {loading}
    title={`${MODULE_NAME}:action_import_from_json_title`}
/>
