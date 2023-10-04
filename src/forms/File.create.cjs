const { MODULE_NAME } = require("../const.cjs");
//DB related validation tools
const Form = require("not-node").Form;
//form
const FIELDS = [
    ["activeUserId", { required: true }, "not-node//objectId"],
    ["activeUser", "not-node//requiredObject"],
    ["store", `${MODULE_NAME}//store`],
    ["files", "not-node//requiredObject"],
];

const FORM_NAME = `${MODULE_NAME}:FileCreateForm`;

/**
 *
 **/
module.exports = class FileCreateForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app, MODULE_NAME, MODEL_NAME: "File" });
    }

    async afterExtract(prepared, req) {
        const instructions = {
            store: ["fromParams", "xss"],
        };
        const data = this.extractByInstructions(req, instructions);
        prepared.store = data.store;
        prepared.files = req.files;
        return prepared;
    }
};
