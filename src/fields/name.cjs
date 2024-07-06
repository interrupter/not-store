const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    model: {
        required: true,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        searchable: true,
        sortable: true,
        type: String,
        unique: true,
    },
    ui: {
        component: "UITextfield",
        label: `${MODULE_NAME}:field_name_label`,
        placeholder: `${MODULE_NAME}:field_name_placeholder`,
    },
};
