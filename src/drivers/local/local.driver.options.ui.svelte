<script>
    import { MODULE_NAME } from "../../const";
    import { Elements } from "not-bulma";
    import DEFALT_OPTIONS from "./local.driver.options";
    const { UITitle } = Elements.Various;
    const UIBox = Elements.Blocks.UIBox;

    export let value = { ...DEFALT_OPTIONS };
</script>

<UIBox>
    <UITitle title={`${MODULE_NAME}:driver_local_title`} />
    <pre>{JSON.stringify(value, 0, 4)}</pre>
</UIBox>
