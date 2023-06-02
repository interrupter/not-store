const { MODULE_NAME } = require("../const.cjs");

const Form = require("not-node").Form;

const FIELDS = [
    `${MODULE_NAME}//name`,
    `${MODULE_NAME}//driver`,
    `${MODULE_NAME}//options`,
    `${MODULE_NAME}//processors`,
    "not-node//active",
];

const FORM_NAME = `${MODULE_NAME}:_StoreDataForm`;

//const validateTitle = require("./validators/title.js");

module.exports = class _DataForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    extract(data) {
        return data;
    }

    getFormValidationRules() {
        return [
            //add validators here
            //validateTitle,
        ];
    }
};
