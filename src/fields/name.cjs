const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    ui: {
        component: "UITextfield",
        label: `${MODULE_NAME}:field_name_label`,
        placeholder: `${MODULE_NAME}:field_name_placeholder`,
    },
    model: {
        type: String,
        required: true,
        searchable: true,
        sortable: true,
        unique: true,
        safe: {
            update: ["@owner", "root", "admin"],
            read: ["@owner", "root", "admin"],
        },
    },
};
