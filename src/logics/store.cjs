// @ts-check

const MODEL_NAME = "Store";
const { MODULE_NAME } = require("../const.cjs");
const notNode = require("not-node");
const notStore = require("../store.cjs");
const notStoreProcessors = require("../store.processors.cjs");

const {
    Log,
    LogAction,
    config,
    getLogic,
    getModel,
    getModelSchema,
    getModelUser,
    phrase,
    say,
} = notNode.Bootstrap.notBootstrapLogic({
    MODEL_NAME,
    MODULE_NAME,
    target: module,
});

const StoreGenericLogic = notNode.Generic.GenericLogic({
    Log,
    LogAction,
    MODEL_NAME,
    MODULE_NAME,
    config,
    getLogic,
    getModel,
    getModelSchema,
    getModelUser,
    phrase,
    say,
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

    static async importJSON({ importJSON }) {
        if (Array.isArray(importJSON)) {
            return await Promise.all(
                importJSON.map((item) => getModel().add(item))
            );
        } else {
            return await getModel().add(importJSON);
        }
    }
}

module.exports[MODEL_NAME] = StoreLogic;
