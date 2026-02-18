<script>
    import { onMount } from "svelte";

    import { MODULE_NAME, OPT_ACLs } from "../../const.cjs";
    import { Elements } from "not-bulma";
    import * as DEFAULT_OPTIONS from "./timeweb.driver.options.cjs";
    import {
        UITextfield,
        UILabel,
        UISelect,
        UISwitch,
    } from "not-bulma/src/elements/form";

    const UIBox = Elements.Blocks.UIBox;

    let {
        value = { ...DEFAULT_OPTIONS },
        fieldname = "options",
        readonly = false,
        onchange = () => {},
    } = $props();

    let valueIsValid = false;

    const valueTypeIsNotOK = () => {
        return (
            typeof value !== "object" ||
            typeof value == "string" ||
            Array.isArray(value)
        );
    };

    const initValue = () => {
        if (valueTypeIsNotOK()) {
            value = { ...DEFAULT_OPTIONS };
        }
        valueIsValid = true;
    };

    initValue();

    const onChange = (detail) => {
        initValue();
        value[detail.field] = detail.value;
        value = value;
        onchange({
            field: fieldname,
            value,
        });
    };
</script>

{#if valueIsValid}
    <UIBox>
        <div class="field">
            <UILabel
                id="form-field-textfield-ACL"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_ACL`}
            />
            <UISelect
                variants={OPT_ACLs.map((val) => {
                    return { id: val, title: val };
                })}
                {readonly}
                value={value.ACL}
                onchange={onChange}
                fieldname="ACL"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-accessKeyId"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_accessKeyId`}
            />
            <UITextfield
                {readonly}
                value={value.accessKeyId}
                onchange={onChange}
                fieldname="accessKeyId"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-secretAccessKey"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_secretAccessKey`}
            />
            <UITextfield
                {readonly}
                value={value.secretAccessKey}
                onchange={onChange}
                fieldname="secretAccessKey"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-apiVersion"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_apiVersion`}
            />
            <UITextfield
                {readonly}
                value={value.apiVersion}
                onchange={onChange}
                fieldname="apiVersion"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-endpoint"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_endpoint`}
            />
            <UITextfield
                {readonly}
                value={value.endpoint}
                onchange={onChange}
                fieldname="endpoint"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-region"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_region`}
            />
            <UITextfield
                {readonly}
                value={value.region}
                onchange={onChange}
                fieldname="region"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-switch-s3ForcePathStyle"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_s3ForcePathStyle`}
            />
            <UISwitch
                {readonly}
                value={value.s3ForcePathStyle}
                onchange={onChange}
                fieldname="s3ForcePathStyle"
            />
        </div>

        <div class="field">
            <UILabel
                id="form-field-textfield-bucket"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_bucket`}
            />
            <UITextfield
                {readonly}
                value={value.bucket}
                onchange={onChange}
                fieldname="bucket"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-path"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_path`}
            />
            <UITextfield
                {readonly}
                value={value.path}
                onchange={onChange}
                fieldname="path"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-tmp"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_tmp`}
            />
            <UITextfield
                {readonly}
                value={value.tmp}
                onchange={onChange}
                fieldname="tmp"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-switch-groupFiles"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_groupFiles`}
            />
            <UISwitch
                {readonly}
                value={value.groupFiles}
                onchange={onChange}
                fieldname="groupFiles"
            />
        </div>
    </UIBox>
{/if}
