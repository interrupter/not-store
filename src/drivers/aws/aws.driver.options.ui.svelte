<script>
    import { MODULE_NAME } from "../../const";
    import { Elements } from "not-bulma";
    const { UITitle } = Elements.Various;
    import DEFALT_OPTIONS from "./aws.driver.options";

    const UIBox = Elements.Blocks.UIBox;

    export let value = { ...DEFALT_OPTIONS };
</script>

<UIBox>
    <UITitle title={`${MODULE_NAME}:driver_aws_title`} />
    <pre>{JSON.stringify(value, 0, 4)}</pre>
</UIBox>
