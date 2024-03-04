const { MODULE_NAME } = require("../const.cjs");
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
    defaultAccessRule: true
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

    static async _test(req,res,next, prepared){
        return await getLogic().test({...prepared});
    }

    static async _importFromJSON(req, res, next, prepared){
        const importJSON = await notNode.Common.tryParseAsync(req.body.import, undefined, true);
        return await getLogic().importJSON({...prepared, importJSON});
    }

    static async _exportToJSON(req, res, next, prepared){        
        return await getLogic().listAll({...prepared});
    }
}

module.exports = StoreRoute;
