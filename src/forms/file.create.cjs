const {
    MODULE_NAME,
    DEFAULT_SERVER_STORE,
    DEFAULT_USER_STORE,
} = require("../const.cjs");
const MODEL_NAME = "File";
//DB related validation tools
const Form = require("not-node").Form;

/**
 *
 **/
module.exports = class FileCreateForm extends Form {
    constructor({ app }) {
        super({ MODULE_NAME, MODEL_NAME, app, actionName: "create" });
    }

    async afterExtract(input, req) {
        input = await super.afterExtract(input, req);
        input.files = req.files;
        if (input.identity.root || input.identity.admin) {
            input.store = input.data.store || DEFAULT_SERVER_STORE;
        } else {
            input.store =
                super.config.get("defaultUserStore") || DEFAULT_USER_STORE;
        }
        delete input.data.store;
        return input;
    }
};
