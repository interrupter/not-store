// @ts-check

const MODEL_NAME = "Store";
const { MODULE_NAME } = require("../const.cjs");
const notNode = require("not-node");
const notStore = require("../store.cjs");
const notStoreProcessors = require("../store.processors.cjs");

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
    static async listDrivers() {
        return notStore.listDrivers();
    }

    static async listProcessors() {
        return notStoreProcessors.list();
    }

    static async test({ targetId }) {
        const storeConfig = await getModel().getOne(targetId);
        const store = await notStore.getDriverForConfig(storeConfig.toObject());
        return await store.test();
    }

    static async importJSON({identity, importJSON}){
        if(Array.isArray(importJSON)){
            return await Promise.all(importJSON.map(item=>getModel().add(item)));
        }else{
            return await getModel().add(importJSON);
        }        
    }
}

module.exports[MODEL_NAME] = StoreLogic;
