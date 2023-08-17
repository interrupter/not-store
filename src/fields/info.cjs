const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("not-store/src/const.cjs");
module.exports = {
    ui: {
        component: "UIFileInfo",
        placeholder: `${MODULE_NAME}:field_info_placeholder`,
        label: `${MODULE_NAME}:field_info_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        required: false,
    },
};
