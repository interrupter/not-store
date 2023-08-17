const Log = require("not-log")(module, "routes");
const MODEL_NAME = "File";
const {MODULE_NAME} = require('../const.cjs');

const notNode = require("not-node"),
    {notAppIdentity} = notNode,    
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
    defaultAccessRule: true
});


const FileGenericRoute = notNode.Generic.GenericRoute({
    before,
    after,
    getLogic,
});

class FileRoute extends FileGenericRoute {
    static async _list(req, res){
        const App = notNode.Application;
        try {
            let File = App.getLogic("File"),
                thisSchema = App.getModelSchema("File"),
                { size, skip } = query.pager.process(req) || {
                    size: 200,
                    skip: 0,
                    page: 0,
                },
                filter = query.filter.process(req, thisSchema),
                sorter = query.sorter.process(req, thisSchema);
            Log.info("this is _list filter", req.query, filter);
            return await File.list({ skip, size, sorter, filter });
        } catch (e) {
            throw new notError("store._list error", {}, e);            
        }
    }

    static async list(req, res){
        const App = notNode.Application;
        try {
            let File = App.getLogic("File"),
                thisSchema = App.getModelSchema("File"),
                { size, skip } = query.pager.process(req) || {
                    size: 200,
                    skip: 0,
                    page: 0,
                },
                filter = query.filter.process(req, thisSchema),
                sorter = query.sorter.process(req, thisSchema);
            Log.info("this is list filter", req.query, filter);
            if (!filter) {
                filter = {};
            }
            filter = query.filter.modifyRules(filter, {
                session: Auth.getSessionId(req),
            });
            return await File.list({ skip, size, sorter, filter });
        } catch (e) {
            throw new notError("store.list error", {}, e);
        }
    }

    static async create(req,res){
        const App = notNode.Application;
        const {sid, ip, uid} = notAppIdentity.extractAuthData(req);    
        if (req.files) {
            let query = {
                bucket:     "client",
                files:      req.files,
                userIp:     ip,
                ownerId:    uid,
                sessionId:  sid,
                admin:      false,
            };
            return await App.getLogic("not-store//File").upload(query);
        } else {
            throw new Error("Empty files list");
        }
    }

    static async _create(req,res){
        const App = notNode.Application;
        const {sid, ip, uid} = notAppIdentity.extractAuthData(req);    
        const bucket = req.params.bucket ? req.params.bucket : "server";
        if (req.files) {
            let query = {
                bucket,
                sessionId: sid,
                ownerId: uid,
                files: req.files,
                userIp: ip,
                admin: true,
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
                fileId,
                sessionId: undefined,
                admin: true,
            };
            let result = await App.getLogic("not-store//File").delete(query);
            return result.code || 200;
        } catch (e) {
            throw new notError("File delete error", {
                    params: req.params,
                    sid: false,
                    admin: true,
                });
        }
    };
    
    static async delete (req, res) {
        const App = notNode.Application;
        try {
            let fileId = req.params._id,
                sessionId = Auth.getSessionId(req);
            let query = {
                fileId,
                sessionId,
                admin: false,
            };
            let result = await App.getLogic("not-store//File").delete(query);
            return result.code || 200;
        } catch (e) {
            throw new notError("File delete error", {
                    params: req.params,
                    sid: false,
                    admin: false,
                });
        }
    };
};

module.exports = FileRoute;
