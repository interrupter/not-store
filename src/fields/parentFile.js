const {Schema} = require('mongoose');
const { MODULE_NAME } = require("not-store/src/const.cjs");
const MODEL_NAME = 'File';

module.exports = {
    ui: {
        component: "UITextfield",
        placeholder: `${MODULE_NAME}:field_parentFile_placeholder`,
        label: `${MODULE_NAME}:field_parentFile_label`,
    },
    model: {
        type: Schema.Types.ObjectId,        
        required: false,
        ref: MODEL_NAME,
        match: {__closed: false, __latest: true}
    },
};
