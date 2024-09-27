const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    parent: 'not-node//requiredObject',
    model: {
        default: {},
        required: false,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        type: Schema.Types.Mixed,
    },
    ui: {
        component: "FUIStoreProcessors",
        label: `${MODULE_NAME}:field_processors_label`,
        placeholder: `${MODULE_NAME}:field_processors_placeholder`,
    },
};
