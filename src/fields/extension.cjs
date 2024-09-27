const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    parent: 'not-node//codeName',
    model: {
        required: true,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        searchable: true,
        type: String,
    },
    ui: {
        component: "UITextfield",
        label: `${MODULE_NAME}:field_extension_label`,
        placeholder: `${MODULE_NAME}:field_extension_placeholder`,
    },
};
