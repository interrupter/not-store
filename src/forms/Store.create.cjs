const getIP = require("not-node").Auth.getIP;
const { MODULE_NAME } = require("../const.cjs");
//DB related validation tools
const Form = require("not-node").Form;
//form
const FIELDS = [
    ["activeUser", "not-node//requiredObject"],
    ["data", `${MODULE_NAME}//_Store_data`],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:StoreCreateForm`;

/**
 *
 **/
module.exports = class StoreCreateForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    /**
     * Extracts data
     * @param {ExpressRequest} req expressjs request object
     * @return {Object}        forma data
     **/
    extract(req) {
        const ip = getIP(req);
        const instructions = {
            name: ["fromBody", "xss"],
            driver: ["fromBody", "xss"],
            options: "fromBody",
            processors: "fromBody",
            active: "fromBody",
        };
        const data = this.extractByInstructions(req, instructions);
        return {
            activeUser: req.user,
            ip,
            data,
        };
    }
};
