// @ts-check
const store = require("../../").notStore;
const config = require("not-config").readerForModule("store");
const notError = require("not-error/src/error.node.cjs");
const MODEL_NAME = "File";

const FIELDS = [
    "uuid", //unique identifier in DB
    ["name", {}, "filename"], //original name, or changed by user
    "extension", //file type
    "store", //store name
    "info", ////object collection of data generated by processors, complex object with all additional information about file
    "path", //unique identifier in FS;could be path /some/path/to/file.ext;or it could be Key of object in Cloud
    "size", //size of file in bytes
    ["userIp", {}, "ip"], //owner ip
    "userId", //owner _id
    ["session", { required: !!config.get("sessionRequired") }], //if configured to use sessions as
    "createdAt", //dates
    "updatedAt", //dates
];

exports.thisModelName = MODEL_NAME;

exports.enrich = {
    versioning: true,
    increment: true,
    incrementOptions: {
        filter: ["store"], //fileID field counters unique for each Store
    },
    validators: true,
};

exports.FIELDS = FIELDS;

exports.schemaOptions = {
    timestamps: true,
};

const queryLatestsVersion = (query) => {
    query.__latest = true;
    query.__closed = false;
    return query;
};

exports.thisStatics = {
    async findOneById(_id) {
        const query = queryLatestsVersion({ _id });
        return await this.findOne(query);
    },

    async findOneByIdAndOwnerId(_id, userId) {
        const query = queryLatestsVersion({
            _id,
            userId,
        });
        return await this.findOne(query);
    },

    async findOneByIdAndSession(_id, session) {
        let query = queryLatestsVersion({ _id, session: session });
        return await this.findOne(query);
    },

    async removeOneByQuery(query) {
        let rec = await this.findOne(queryLatestsVersion(query));
        if (!rec) {
            return false;
        }
        const storage = await store.get(rec.store);
        if (!storage) {
            return false;
        }
        //removing file
        const plainObj = rec.toObject();
        const result = await storage.delete(plainObj.path, plainObj.info);
        if (result instanceof notError) {
            return result;
        } else {
            const [, info] = result;
            //updating document as closed
            await rec.close({ info });
            return rec;
        }
    },
};

exports.thisMethods = {};
