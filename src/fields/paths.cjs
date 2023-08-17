const { MODULE_NAME } = require("not-store/src/const.cjs");

const Schema = require("mongoose").Schema;

module.exports = {
    ui: {
        component: "UITexteditor",
        placeholder: `${MODULE_NAME}:field_paths_placeholder`,
        label: `${MODULE_NAME}:field_paths_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        required: false,
    },
};
