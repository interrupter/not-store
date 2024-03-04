<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import UITextarea from "not-bulma/src/elements/form/ui.textarea.svelte";
    import UIButton from "not-bulma/src/elements/button/ui.button.svelte";
    import { MODULE_NAME } from "../../../const.cjs";
    export let value = "";
    export let loading = false;
</script>

<UITextarea bind:value rows={20} disabled={loading} placeholder={""} />

<UIButton
    action={() => {
        dispatch("import", value);
    }}
    color={"primary"}
    disabled={loading}
    {loading}
    title={`${MODULE_NAME}:action_import_from_json_title`}
/>
