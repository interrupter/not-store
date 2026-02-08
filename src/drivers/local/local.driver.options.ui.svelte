<script>
    import { MODULE_NAME } from "../../const.cjs";
    import { Elements } from "not-bulma";
    import DEFALT_OPTIONS from "./local.driver.options.cjs";
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    let { value = { ...DEFALT_OPTIONS } } = $props();
</script>

<UIBox>
    <UITitle title={`${MODULE_NAME}:driver_local_title`} />
    <pre>{JSON.stringify(value, 0, 4)}</pre>
</UIBox>
