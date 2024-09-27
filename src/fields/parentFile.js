const { Schema } = require("mongoose");
const { MODULE_NAME } = require("../const.cjs");
const MODEL_NAME = "File";

module.exports = {
    parent: 'not-node//objectId',
    model: {
        match: { __closed: false, __latest: true },
        ref: MODEL_NAME,
        required: false,
        safe: {
            read: ["@owner", "root", "admin"],
            update: ["@owner", "root", "admin"],
        },
        type: Schema.Types.ObjectId,
    },
    ui: {
        component: "UITextfield",
        label: `${MODULE_NAME}:field_parentFile_label`,
        placeholder: `${MODULE_NAME}:field_parentFile_placeholder`,
    },
};
