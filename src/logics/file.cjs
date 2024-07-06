// @ts-check
const { MODULE_NAME } = require("../const.cjs");
const MODEL_NAME = "File";
module.exports.thisLogicName = MODEL_NAME;

const getApp = require("not-node/src/getApp");
const GenericLogic = require("not-node/src/logic/generic");

const FileLogic = GenericLogic({
    MODEL_NAME,
    MODULE_NAME,
    actions: {
        delete: require("./actions/delete"),
        deleteAllInStore: require("./actions/deleteAllInStore"),
        get: require("./actions/get"),
        getOwn: require("./actions/getOwn"),
        list: require("./actions/list"),
        listAndCount: require("./actions/listAndCount"),
        upload: require("./actions/upload"),
    },
    actionsSets: [],
    afterActions: {},
    beforeActions: {},
    target: module,
});

module.exports[MODEL_NAME] = FileLogic;
