const { MODULE_NAME } = require("not-store/src/const.cjs");

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
        label: `${MODULE_NAME}:field_paths_label`,
        placeholder: `${MODULE_NAME}:field_paths_placeholder`,
    },
};
