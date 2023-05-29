const { MODULE_NAME } = require("not-store/src/const");
//DB related validation tools
const notNode = require("not-node");

module.exports = notNode.Generic.GenericGetByIdForm({
    MODULE_NAME,
    actionName: "delete",
});
