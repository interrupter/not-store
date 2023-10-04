const notNode = require("not-node");
const { MODULE_NAME } = require("../const.cjs");

const FORM_ARGS = { MODULE_NAME, MODEL_NAME: "File", actionName: "delete" };
const FileDeleteForm = notNode.Generic.GenericGetByIdForm(FORM_ARGS);

module.exports = FileDeleteForm;
