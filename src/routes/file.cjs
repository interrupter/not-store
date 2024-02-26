const Log = require("not-log")(module, "routes");
const MODEL_NAME = "File";
const { MODULE_NAME } = require("../const.cjs");

const notNode = require("not-node"),
    { notAppIdentity } = notNode,
    notError = require("not-error").notError;

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

    static async create(req, res) {
        const App = notNode.Application;        
        if (req.files) {
            let query = {
                bucket: "client",
                files: req.files,
                identity: notAppIdentity.extractAuthData(req)
            };
            return await App.getLogic("not-store//File").upload(query);
        } else {
            throw new Error("Empty files list");
        }
    }

    static async _create(req, res) {
        const App = notNode.Application;
        
        const bucket = req.params.bucket ? req.params.bucket : "server";
        if (req.files) {
            let query = {
                bucket,
                identity: notAppIdentity.extractAuthData(req),
                files: req.files,                
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
                targetId: fileId,
                identity: notAppIdentity.extractAuthData(req),
            };
            let result = await App.getLogic("not-store//File").delete(query);
            return result;
        } catch (e) {
            throw new notError("File delete error", {
                params: req.params,
                sid: false,
                admin: true,
            });
        }
    }

    static async delete(req, res) {
        const App = notNode.Application;
        try {
            let fileId = req.params._id;
            let query = {
                targetId: fileId,
                identity: notAppIdentity.extractAuthData(req),
            };
            let result = await App.getLogic("not-store//File").delete(query);
            return result;
        } catch (e) {
            throw new notError("File delete error", {
                params: req.params,
                sid: false,
                admin: false,
            });
        }
    }
}

module.exports = FileRoute;
