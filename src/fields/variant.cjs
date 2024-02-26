const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    ui: {
        component: "UITextfield",
        placeholder: `${MODULE_NAME}:field_variant_placeholder`,
        label: `${MODULE_NAME}:field_variant_label`,
        readonly: true
    },
    model: {
        type: String,
        required: false,
    },
};
