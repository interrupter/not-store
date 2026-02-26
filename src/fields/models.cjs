const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("../const.cjs");
module.exports = {    
    model: {
        required: true,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        type: [Schema.Types.String],
    },
    ui: {
        component: "UISelect",
        multiple: true,
        label: `${MODULE_NAME}:field_models_label`,
        placeholder: `${MODULE_NAME}:field_models_placeholder`,
    },
};
