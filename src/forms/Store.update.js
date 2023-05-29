const { MODULE_NAME } = require("not-store/src/const");
const Form = require("not-node").Form;
const getIP = require("not-node").Auth.getIP;
const MODEL_NAME = "Store";

const FIELDS = [
    ["targetId", { required: true }, "not-node//objectId"],
    ["activeUser", "not-node//requiredObject"],
    ["data", `${MODULE_NAME}//_${MODEL_NAME}_data`], //sub forms validators should start with underscore
    ["ip", "not-node//ip"],
];
const FORM_NAME = `${MODULE_NAME}:StoreUpdateForm`;

module.exports = class StoreUpdateForm extends Form {
    constructor({ app }) {
        super({ FIELDS, FORM_NAME, app });
    }

    extract(req) {
        const instructions = {
            name: ["fromBody", "xss"],
            driver: ["fromBody", "xss"],
            options: "fromBody",
            processors: "fromBody",
            active: "fromBody",
        };
        const data = this.extractByInstructions(req, instructions);
        return {
            targetId: req.params._id.toString(),
            activeUser: req.user,
            data,
            ip: getIP(req),
        };
    }
};
