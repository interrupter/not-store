const getIP = require("not-node").Auth.getIP;
const { MODULE_NAME } = require("../const.cjs");
//DB related validation tools
const Form = require("not-node").Form;
//form
const FIELDS = [
    ["activeUser", "not-node//requiredObject"],
    ["bucket", `${MODULE_NAME}//_Bucket_data`],
    ["ip", "not-node//ip"],
];

const FORM_NAME = `${MODULE_NAME}:FileCreateForm`;

/**
 *
 **/
module.exports = class FileCreateForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    /**
     * Extracts data
     * @param {import('not-node/src/types').notNodeExpressRequest} req expressjs request object
     * @return {Object}        forma data
     **/
    extract(req) {
        const ip = getIP(req);
        const instructions = {
            bucket: ["fromParams", "xss"],
        };
        const data = this.extractByInstructions(req, instructions);
        return {            
            activeUser: req.user,
            ip,
            bucket: data.bucket,
            files: req.files,
        };
    }
};
