const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("../const");
module.exports = {
    ui: {
        component: "UIFileMetadata",
        placeholder: `${MODULE_NAME}:field_metadata_placeholder`,
        label: `${MODULE_NAME}:field_metadata_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        required: false,
    },
};
