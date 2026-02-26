const { MODULE_NAME } = require("not-store/src/const.cjs");
const MODEL_NAME = "Transfer";

const _TransferForm = require("not-node/src/generic/forms/form._data")({
    MODULE_NAME,
    MODEL_NAME,
    FIELDS: ['models']
});

module.exports = _TransferForm;
