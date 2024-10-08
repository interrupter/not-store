const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("../const.cjs");
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
        component: "UIFileInfo",
        label: `${MODULE_NAME}:field_info_label`,
        placeholder: `${MODULE_NAME}:field_info_placeholder`,
    },
};
