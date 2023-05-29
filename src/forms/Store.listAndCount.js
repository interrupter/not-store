const notNode = require("not-node");
const { MODULE_NAME } = require("not-store/src/const");

module.exports = notNode.Generic.GenericListAndCountForm({
    MODULE_NAME,
    MODEL_NAME: "Store",
    actionName: "listAndCount",
});
