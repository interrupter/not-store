const MODEL_NAME = "Store";
const { MODULE_NAME } = require("../const.js");
const notNode = require("not-node");
const notStore = require("../store.js");
const notStoreProcessors = require('../store.processors.js');

const {
    Log,
    LogAction,
    say,
    phrase,
    config,
    getModel,
    getModelSchema,
    getLogic,
    getModelUser,
} = notNode.Bootstrap.notBootstrapLogic({
    target: module,
    MODEL_NAME,
    MODULE_NAME,
});


const StoreGenericLogic = notNode.Generic.GenericLogic({
    MODEL_NAME,
    MODULE_NAME,
    Log,
    LogAction,
    say,
    phrase,
    config,
    getModel,
    getModelSchema,
    getLogic,
    getModelUser,
});

module.exports.thisLogicName = MODEL_NAME;

class StoreLogic extends StoreGenericLogic {
    static async listDrivers(){
        return notStore.listDrivers();
    }

    static async listProcessors(){
        return notStoreProcessors.list();
    }
}

module.exports[MODEL_NAME] = StoreLogic;
