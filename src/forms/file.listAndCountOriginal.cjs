const notNode = require("not-node");
const { MODULE_NAME } = require("../const.cjs");

module.exports = notNode.Generic.GenericListAndCountForm({
    MODULE_NAME,
    MODEL_NAME: "File",
    actionName: "listAndCountOriginal",
});
