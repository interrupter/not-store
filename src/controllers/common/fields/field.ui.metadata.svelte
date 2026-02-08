<script>
    import UICommon from "not-bulma/src/elements/common";

    let {
        inputStarted = false,
        value = "",
        placeholder = "input some text here, please",
        fieldname = "textfield",
        icon = false,
        required = true,
        disabled = false,
        readonly = false,
        valid = true,
        validated = false,
        errors = false,
        formErrors = false,
        formLevelError = false,
        onchange = () => {},
    } = $props();

    let iconClasses = $derived(
        (icon ? " has-icons-left " : "") + " has-icons-right "
    );
    let allErrors = $derived(
        [].concat(errors ? errors : [], formErrors ? formErrors : [])
    );
    let showErrors = $derived(!(validated && valid) && inputStarted);
    let invalid = $derived(valid === false || formLevelError);
    let validationClasses = $derived(
        valid === true || !inputStarted ? UICommon.CLASS_OK : UICommon.CLASS_ERR
    );

    function onBlur(/*ev*/) {
        let data = {
            field: fieldname,
            value,
        };
        inputStarted = true;
        onchange(data);
        return true;
    }

    function onInput(ev) {
        let data = {
            field: fieldname,
            value: ev.currentTarget.value,
        };
        inputStarted = true;
        onchange(data);
        return true;
    }
</script>

<div class="control {iconClasses}">
    {#if readonly}
        <p>{value}</p>
    {:else}
        <input
            id="form-field-textfield-{fieldname}"
            class="input {validationClasses}"
            type="text"
            name={fieldname}
            {invalid}
            {disabled}
            {required}
            {readonly}
            {placeholder}
            {value}
            autocomplete={fieldname}
            aria-controls="input-field-helper-{fieldname}"
            onchange={onBlur}
            oninput={onInput}
            aria-describedby="input-field-helper-{fieldname}"
        />
        {#if icon}
            <span class="icon is-small is-left"
                ><i class="fas fa-{icon}"></i></span
            >
        {/if}
        {#if validated === true}
            <span class="icon is-small is-right">
                {#if valid === true}
                    <i class="fas fa-check"></i>
                {:else if valid === false}
                    <i class="fas fa-exclamation-triangle"></i>
                {/if}
            </span>
        {/if}
    {/if}
</div>
