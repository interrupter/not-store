const MODEL_NAME = "File";
const { MODULE_NAME } = require("../const.cjs");

const notNode = require("not-node");

const {
    //	say,
    //config,
    after,
    //	Log,
    before,
    getLogic,
    //	getModel,
    //	getModelSchema,
} = notNode.Bootstrap.notBootstrapRoute({
    defaultAccessRule: true,
    MODEL_NAME,
    MODULE_NAME,
    target: module,
});

const FileGenericRoute = notNode.Generic.GenericRoute({
    after,
    before,
    getLogic,
});

class FileRoute extends FileGenericRoute {
    static async create(req, res, next, prepared) {
        return await getLogic(prepared).upload(prepared);
    }

    static async _create(req, res, next, prepared) {
        return await FileRoute.create(req, res, next, prepared);
    }

    static async listAndCountOriginal(req, res, next, prepared) {
        if (prepared.identity.admin) {
            return await getLogic(prepared).listAndCountOriginal(prepared);
        } else {
            return await getLogic(prepared).listAndCountOriginalOwn(prepared);
        }
    }

    static async _listAndCountOriginal(req, res, next, prepared) {
        return await getLogic(prepared).listAndCountOriginal(prepared);
    }
}

module.exports = FileRoute;
