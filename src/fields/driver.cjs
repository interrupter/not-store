const { MODULE_NAME } = require("../const.cjs");
module.exports = {
    ui: {
        component: "UISelect",
        placeholder: `${MODULE_NAME}:field_driver_placeholder`,
        label: `${MODULE_NAME}:field_driver_label`,
        variantsSource: "drivers",
    },
    model: {
        type: String,
        searchable: true,
        required: true,
    },
};
