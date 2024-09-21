const { MODULE_NAME } = require("../const.cjs");
//DB related validation tools
const notNode = require("not-node");

module.exports = notNode.Generic.GenericGetByIdForm({
    MODULE_NAME,
    actionName: "getRaw",
});
