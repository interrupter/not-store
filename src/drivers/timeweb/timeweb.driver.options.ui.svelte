<script>
    import { onMount, createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();
    import { MODULE_NAME, OPT_ACLs } from "../../const";
    import { Elements } from "not-bulma";
    import DEFALT_OPTIONS from "./timeweb.driver.options";
    import {
        UITextfield,
        UILabel,
        UISelect,
        UISwitch,
    } from "not-bulma/src/elements/form";
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    export let value = { ...DEFALT_OPTIONS };
    export let fieldname = "options";
    export let readonly = false;

    let valueIsValid = false;

    onMount(() => {
        initValue();
    });

    const valueTypeIsNotOK = () => {
        return (
            typeof value !== "object" ||
            typeof value == "string" ||
            Array.isArray(value)
        );
    };

    const initValue = () => {
        if (valueTypeIsNotOK()) {
            value = { ...DEFALT_OPTIONS };
        }
        valueIsValid = true;
    };

    const onChange = ({ detail }) => {
        initValue();
        value[detail.field] = detail.value;
        value = value;
        dispatch("change", {
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
                bind:readonly
                bind:value={value.ACL}
                on:change={onChange}
                fieldname="ACL"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-accessKeyId"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_accessKeyId`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.accessKeyId}
                on:change={onChange}
                fieldname="accessKeyId"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-secretAccessKey"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_secretAccessKey`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.secretAccessKey}
                on:change={onChange}
                fieldname="secretAccessKey"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-apiVersion"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_apiVersion`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.apiVersion}
                on:change={onChange}
                fieldname="apiVersion"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-endpoint"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_endpoint`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.endpoint}
                on:change={onChange}
                fieldname="endpoint"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-region"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_region`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.region}
                on:change={onChange}
                fieldname="region"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-switch-s3ForcePathStyle"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_s3ForcePathStyle`}
            />
            <UISwitch
                bind:readonly
                bind:value={value.s3ForcePathStyle}
                on:change={onChange}
                fieldname="s3ForcePathStyle"
            />
        </div>

        <div class="field">
            <UILabel
                id="form-field-textfield-bucket"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_bucket`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.bucket}
                on:change={onChange}
                fieldname="bucket"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-path"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_path`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.path}
                on:change={onChange}
                fieldname="path"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-textfield-tmp"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_tmp`}
            />
            <UITextfield
                bind:readonly
                bind:value={value.tmp}
                on:change={onChange}
                fieldname="tmp"
            />
        </div>
        <div class="field">
            <UILabel
                id="form-field-switch-groupFiles"
                label={`${MODULE_NAME}:field_store_driver_timeweb_options_groupFiles`}
            />
            <UISwitch
                bind:readonly
                bind:value={value.groupFiles}
                on:change={onChange}
                fieldname="groupFiles"
            />
        </div>
    </UIBox>
{/if}
