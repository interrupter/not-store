const { MODULE_NAME } = require("../const.cjs");

const Schema = require("mongoose").Schema;

module.exports = {
    parent: "not-node//codeName",
    model: {
        required: false,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },        
        default: ''
    },
    ui: {
        component: "UITexteditor",
        label: `${MODULE_NAME}:field_path_label`,
        placeholder: `${MODULE_NAME}:field_path_placeholder`,
    },
};
