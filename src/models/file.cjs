const store = require("../../").notStore;
const config = require("not-config").readerForModule("store");

const MODEL_NAME = "File";

const FIELDS = [
    "uuid",
    ["name", {}, "filename"],
    "extension",
    "bucket",
    "metadata",
    "path",
    ["userIp", {}, "ip"],
    "userId",
    ["session", { required: !!config.get("sessionRequired") }],
    "size",
];

exports.thisModelName = MODEL_NAME;

exports.enrich = {
    versioning: true,
    increment: true,
    validators: true,
};

exports.FIELDS = FIELDS;

exports.schemaOptions = {
    timestamps: true,
};

exports.thisStatics = {
    async getOneByIdAndRemove(_id, sessionId) {
        try {
            let query = {
                _id,
                __latest: true,
                __closed: false,
            };
            if (sessionId) {
                query["session"] = sessionId;
            }
            let rec = await this.findOne(query);
            if (rec) {
                await rec.close();
                await store.delete(rec.bucket, rec.metadata);
                return rec;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
};

exports.thisMethods = {};
