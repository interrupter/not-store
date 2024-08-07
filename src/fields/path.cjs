const { MODULE_NAME } = require("../const.cjs");

const Schema = require("mongoose").Schema;

module.exports = {
    model: {
        required: false,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        type: Schema.Types.Mixed,
    },
    ui: {
        component: "UITexteditor",
        label: `${MODULE_NAME}:field_path_label`,
        placeholder: `${MODULE_NAME}:field_path_placeholder`,
    },
};
