const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("not-store/src/const");

module.exports = {
    ui: {
        component: "FUIStoreProcessors",
        placeholder: `${MODULE_NAME}:field_processors_placeholder`,
        label: `${MODULE_NAME}:field_processors_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        default: {},
        required: false,
    },
};