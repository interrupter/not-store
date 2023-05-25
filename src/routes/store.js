const { MODULE_NAME } = require("../const");
const MODEL_NAME = "Store";
const notNode = require("not-node");

const {
    //	say,
    //	config,
    //	Log,
    before,
    after,
    getLogic,
    //	getModel,
    //	getModelSchema,
} = notNode.Bootstrap.notBootstrapRoute({
    target: module,
    MODEL_NAME,
    MODULE_NAME,
    defaultAccessRule: true,
});

const StoreGenericRoute = notNode.Generic.GenericRoute({
    before,
    after,
    getLogic,
});

class StoreRoute extends StoreGenericRoute {
    static async _listDrivers(/*req, res, next, prepared*/) {
        return await getLogic().listDrivers();
    }

    static async _listProcessors(/*req, res, next, prepared*/) {
        return await getLogic().listProcessors();
    }
}

module.exports = StoreRoute;
