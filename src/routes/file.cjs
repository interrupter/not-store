const Log = require("not-log")(module, "routes");
const MODEL_NAME = "File";
const { MODULE_NAME } = require("../const.cjs");

const notNode = require("not-node"),
    { notAppIdentity } = notNode,
    notError = require("not-error").notError;

const {
    //	say,
    config,
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
        return await notNode.Application.getLogic("not-store//File").upload(
            prepared
        );
    }

    static async _create(req, res, next, prepared) {
        return await notNode.Application.getLogic("not-store//File").upload(
            prepared
        );
    }

    static async _listAndCountOriginal(req, res, next, prepared) {
        return await notNode.Application.getLogic(
            "not-store//File"
        ).listAndCountOriginal(prepared);
    }
}

module.exports = FileRoute;
