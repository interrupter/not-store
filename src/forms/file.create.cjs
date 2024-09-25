const {
    MODULE_NAME,
    DEFAULT_SERVER_STORE,
    DEFAULT_USER_STORE,
    DEFAULT_GUEST_STORE,
} = require("../const.cjs");
const MODEL_NAME = "File";
//DB related validation tools
const Form = require("not-node").Form;

/**
 *
 **/
module.exports = class FileCreateForm extends Form {
    constructor({ app, config }) {
        super({ MODULE_NAME, MODEL_NAME, app, config, actionName: "create" });
    }

    async afterExtract(input, req) {
        input = await super.afterExtract(input, req);
        input.files = req.files;
        if (input.identity.root || input.identity.admin) {
            input.store =
                input.data.store ||
                super.config.get("defaultServerStore") ||
                DEFAULT_SERVER_STORE;
        } else if (input.identity.auth) {
            input.store =
                super.config.get("defaultUserStore") || DEFAULT_USER_STORE;
        } else {
            input.store =
                super.config.get("defaultGuestStore") || DEFAULT_GUEST_STORE;
        }
        delete input.data.store;
        return input;
    }
};
