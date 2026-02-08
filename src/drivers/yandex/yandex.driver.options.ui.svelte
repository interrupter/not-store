<script>
    import { MODULE_NAME } from "../../const.cjs";
    import { Elements } from "not-bulma";
    const { UITitle } = Elements.Various;
    import DEFALT_OPTIONS from "./yandex.driver.options.cjs";

    const UIBox = Elements.Blocks.UIBox;

    let { value = { ...DEFALT_OPTIONS } } = $props();
</script>

<UIBox>
    <UITitle title={`${MODULE_NAME}:driver_yandex_title`} />
    <pre>{JSON.stringify(value, 0, 4)}</pre>
</UIBox>
