const { MODULE_NAME } = require("not-store/src/const.cjs");

const Schema = require("mongoose").Schema;

module.exports = {
    ui: {
        component: "UIJSON",
        placeholder: `${MODULE_NAME}:field_cloud_placeholder`,
        label: `${MODULE_NAME}:field_cloud_label`,
    },
    model: {
        type: Schema.Types.Mixed,
        required: false,
    },
};
