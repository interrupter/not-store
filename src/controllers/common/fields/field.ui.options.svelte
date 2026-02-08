<script>
    import { COMPONENTS } from "not-bulma/src/frame";

    let {
        _componentName,
        errors = false,
        fieldname = "options",
        formErrors = false,
        formLevelError = false,
        icon = false,
        label = "",
        placeholder = "empty select item",
        readonly = false,
        required = false,
        valid = true,
        validated = false,
        value,
        onchange = () => {},
    } = $props();
</script>

<svelte:component
    this={COMPONENTS.get(_componentName)}
    {value}
    {onchange}
    {errors}
    {fieldname}
    {formErrors}
    {formLevelError}
    {icon}
    {label}
    {placeholder}
    {readonly}
    {required}
    {valid}
    {validated}
/>
