const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    model: {
        required: false,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        type: String,
    },
    ui: {
        component: "UITextfield",
        label: `${MODULE_NAME}:field_variant_label`,
        placeholder: `${MODULE_NAME}:field_variant_placeholder`,
        readonly: true,
    },
};
