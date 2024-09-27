const { MODULE_NAME } = require("../const.cjs");

const Schema = require("mongoose").Schema;

module.exports = {
    parent: 'not-node//requiredObject',
    model: {
        required: false,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        type: Schema.Types.Mixed,
    },
    ui: {
        component: "FUIStoreOptions",
        label: `${MODULE_NAME}:field_options_label`,
        placeholder: `${MODULE_NAME}:field_options_placeholder`,
    },
};
