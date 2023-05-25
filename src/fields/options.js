const { MODULE_NAME } = require("../const");

const Schema = require("mongoose").Schema;

module.exports = {
    ui: {
        component: "FUIStoreOptions",
        placeholder: `${MODULE_NAME}:field_options_placeholder`,
        label: `${MODULE_NAME}:field_options_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        required: false,
    },
};
