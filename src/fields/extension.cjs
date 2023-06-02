const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    ui: {
        component: "UITextfield",
        placeholder: `${MODULE_NAME}:field_extension_placeholder`,
        label: `${MODULE_NAME}:field_extension_label`,
    },
    model: {
        type: String,
        searchable: true,
        required: true,
    },
};
