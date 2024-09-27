const { MODULE_NAME } = require("../const.cjs");
module.exports = {
    parent: 'not-node//codeName',
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
