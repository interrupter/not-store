const {
    notStoreRouteFileExceptionFileDeleteError,
} = require("../exceptions/route.file.exceptions.cjs");
const { HttpExceptionForbidden } = require("not-node/src/exceptions/http");
const Log = require("not-log")(module, "routes");
const MODEL_NAME = "File";
const { MODULE_NAME } = require("../const.cjs");

const notNode = require("not-node"),
    notError = require("not-error/src/error.node.cjs");

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

const FileGenericRoute = notNode.Generic.GenericRoute({
    before,
    after,
    getLogic,
});

class FileRoute extends FileGenericRoute {
    static throwOnRootAccess = HttpExceptionForbidden;

    static async create(req, res, next, prepared) {
        return getLogic().upload(prepared);
    }

    /**
     *
     *
     * @static
     * @param       {import('not-node/src/types').notNodeExpressRequest}    req
     * @param       {import('express').Response}                            res
     * @param       {Function}                                              next
     * @param       {import('not-node/src/types').PreparedData}             prepared
     * @return      {Promise<Array<Object>>}
     * @memberof    FileRoute
     */
    static async list(req, res, next, prepared) {
        try {
            Log.info("this is list filter", prepared.query);
            return await getLogic().list({ ...prepared.query });
        } catch (e) {
            throw new notError("store.list error", {}, e);
        }
    }

    static async delete(req, res, next, prepared) {
        try {
            return await getLogic().delete(prepared);
        } catch (e) {
            throw new notStoreRouteFileExceptionFileDeleteError(prepared, e);
        }
    }
}

module.exports = FileRoute;
