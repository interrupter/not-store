const { MODULE_NAME } = require("../const.cjs");
const MODEL_NAME = "Store";

const _StoreForm = require("not-node/src/generic/forms/form._data")({
    MODULE_NAME,
    MODEL_NAME,
});

module.exports = _StoreForm;
