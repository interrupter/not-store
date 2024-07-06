const { MODULE_NAME } = require("../const.cjs");
module.exports = {
    model: {
        required: true,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        searchable: true,
        type: String,
    },
    ui: {
        component: "UISelect",
        label: `${MODULE_NAME}:field_driver_label`,
        placeholder: `${MODULE_NAME}:field_driver_placeholder`,
        variantsSource: "drivers",
    },
};
