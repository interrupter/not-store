const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    ui: {
        component: "UITextfield",
        placeholder: `${MODULE_NAME}:field_filename_placeholder`,
        label: `${MODULE_NAME}:field_filename_label`,
    },
    model: {
        type: String,
        searchable: true,
        required: true,
    },
};
