const { MODULE_NAME } = require("not-store/src/const.cjs");

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
    },
    ui: {
        component: "UITextfield",
        label: `${MODULE_NAME}:field_store_label`,
        placeholder: `${MODULE_NAME}:field_store_placeholder`,
    },
};
