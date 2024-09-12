const Log = require("not-log")(module, "routes");
const MODEL_NAME = "File";
const { MODULE_NAME } = require("../const.cjs");

const notNode = require("not-node"),
    { notAppIdentity } = notNode,
    notError = require("not-error").notError;

const {
    //	say,
    //	config,
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
    static async create(req, res) {
        const App = notNode.Application;
        if (req.files) {
            const identity = notAppIdentity.extractAuthData(req);
            let store = "client";
            if (identity.admin) {
                store = req.params.store ? req.params.store : "client";
            }

            let query = {
                files: req.files,
                identity,
                store,
            };
            return await App.getLogic("not-store//File").upload(query);
        } else {
            throw new Error("Empty files list");
        }
    }

    static async _create(req, res) {
        const App = notNode.Application;
        const store = req.params.store ? req.params.store : "server";
        if (req.files) {
            let query = {
                files: req.files,
                identity: notAppIdentity.extractAuthData(req),
                store,
            };
            return await App.getLogic("not-store//File").upload(query);
        } else {
            throw new Error("Empty files list");
        }
    }

    static async _delete(req, res) {
        const App = notNode.Application;
        try {
            let fileId = req.params._id;
            let query = {
                identity: notAppIdentity.extractAuthData(req),
                targetId: fileId,
            };
            let result = await App.getLogic("not-store//File").delete(query);
            return result;
        } catch (e) {
            throw new notError("File delete error", {
                admin: true,
                params: req.params,
                sid: false,
            });
        }
    }

    static async delete(req, res) {
        const App = notNode.Application;
        try {
            let fileId = req.params._id;
            let query = {
                identity: notAppIdentity.extractAuthData(req),
                targetId: fileId,
            };
            let result = await App.getLogic("not-store//File").delete(query);
            return result;
        } catch (e) {
            throw new notError("File delete error", {
                admin: false,
                params: req.params,
                sid: false,
            });
        }
    }
}

module.exports = FileRoute;
