const { MODULE_NAME } = require("not-store/src/const.cjs");

module.exports = {
    ui: {
        component: "UITextfield",
        placeholder: `${MODULE_NAME}:field_store_placeholder`,
        label: `${MODULE_NAME}:field_store_label`,
    },
    model: {
        type: String,
        searchable: true,
        required: true,
    },
};
