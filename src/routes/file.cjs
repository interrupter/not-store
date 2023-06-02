const Log = require("not-log")(module, "routes");

const UserActions = [],
    AdminActions = ["listAndCount", "get", "getRaw"],
    MODEL_NAME = "File",
    MODEL_OPTIONS = {
        MODEL_NAME,
        MODEL_TITLE: "Файл",
        populate: {
            listAndCount: ["userId"],
        },
        RESPONSE: {
            full: ["get", "getRaw", "create"],
        },
    },
    modMeta = require("not-meta");

const notNode = require("not-node"),
    Auth = require("not-node").Auth,
    query = require("not-filter"),
    notError = require("not-error").notError;

exports.before = () => {};

exports._list = async function (req, res) {
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
        let result = await File.list({ skip, size, sorter, filter });
        res.status(200).json(result);
    } catch (e) {
        App.report(new notError("store._list error", {}, e));
        res.status(500).json({ status: "error" });
    }
};

exports.list = async function (req, res) {
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
        let result = await File.list({ skip, size, sorter, filter });
        res.status(200).json(result);
    } catch (e) {
        App.report(new notError("store.list error", {}, e));
        res.status(500).json({ status: "error" });
    }
};

exports.create = async (req, res) => {
    const App = notNode.Application;
    try {
        let sessionId = Auth.getSessionId(req),
            userIp = Auth.getIP(req),
            userId = Auth.getUserId(req);
        if (req.files) {
            let query = {
                bucket: "client",
                files: req.files,
                userIp,
                ownerId: userId,
                sessionId,
                admin: false,
            };
            let result = await App.getLogic("not-store//File").upload(query);
            res.status(result.code || 200).json(result);
        } else {
            throw new Error("Empty files list");
        }
    } catch (e) {
        App.report(
            new notError("File upload error", {
                sid: Auth.getSessionId(req),
                userIp: Auth.getIP(req),
                admin: false,
            })
        );
        res.status(500).json({ status: "error" });
    }
};

exports._create = async (req, res) => {
    const App = notNode.Application;
    try {
        let userIp = Auth.getIP(req),
            userId = Auth.getUserId(req),
            bucket = req.params.bucket ? req.params.bucket : "server",
            sessionId = req.query.session ? req.query.session : undefined;
        if (req.files) {
            let query = {
                bucket,
                sessionId,
                ownerId: userId,
                files: req.files,
                userIp,
                admin: true,
            };
            let result = await App.getLogic("not-store//File").upload(query);
            res.status(result.code || 200).json(result);
        } else {
            throw new Error("Empty files list");
        }
    } catch (e) {
        App.report(
            new notError("File upload error", {
                sid: Auth.getSessionId(req),
                userIp: Auth.getIP(req),
                admin: true,
            })
        );
        res.status(500).json({ status: "error" });
    }
};

exports._delete = async function (req, res) {
    const App = notNode.Application;
    try {
        let fileId = req.params._id;
        let query = {
            fileId,
            sessionId: undefined,
            admin: true,
        };
        let result = await App.getLogic("not-store//File").delete(query);
        res.status(result.code || 200).json(result);
    } catch (e) {
        App.report(
            new notError("File delete error", {
                params: req.params,
                sid: false,
                admin: true,
            })
        );
        res.status(500).json({ status: "error", message: e.message });
    }
};

exports.delete = async function (req, res) {
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
        res.status(result.code || 200).json(result);
    } catch (e) {
        App.report(
            new notError("File delete error", {
                params: req.params,
                sid: false,
                admin: false,
            })
        );
        res.status(500).json({ status: "error" });
    }
};

modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, "_");
modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);
