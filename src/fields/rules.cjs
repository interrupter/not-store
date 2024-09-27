const { MODULE_NAME } = require("../const.cjs");
const Mixed = require("mongoose").Schema.Types.Mixed;

module.exports = {
    parent: 'not-node//requiredObject',
    model: {
        required: true,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        searchable: true,
        sortable: true,
        type: Mixed,
    },
    ui: {
        component: "UIJSON",
        label: `${MODULE_NAME}:field_rules_label`,
        placeholder: `${MODULE_NAME}:field_rules_placeholder`,
    },
};
