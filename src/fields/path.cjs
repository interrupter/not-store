const { MODULE_NAME } = require("../const.cjs");

const Schema = require("mongoose").Schema;

module.exports = {
    ui: {
        component: "UITexteditor",
        placeholder: `${MODULE_NAME}:field_path_placeholder`,
        label: `${MODULE_NAME}:field_path_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        required: false,
    },
};
