// @ts-check
const store = require("../../").notStore;
const {MODULE_NAME} = require("../const.cjs");
const config = require("not-config").readerForModule("store");
const log = require("not-log")(module, 'Model//File');

const MODEL_NAME = "File";

const FIELDS = [
    //original
    ["parent",`${MODULE_NAME}//parentFile`],
    "variant",
    //unique identifier in DB
    "uuid",
    //original name, or changed by user
    ["name", {}, "filename"],
    //file type
    "extension",
    //store name
    "store",
    //object collection of data generated by processors
    "info", //complex object with all additional information about file
    //unique identifier in FS.
    //could be path /some/path/to/file.ext,    
    "path",
    //or it could be object with cloud locations information
    "cloud",
    //size of file in bytes
    "size",
    //owner
    ["userIp", {}, "ip"],
    ["userId", 'not-node//userId'],
    ["session", { required: !!config.get("sessionRequired") }],    
    //dates
    "createdAt",
    "updatedAt",
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
            let rec = await this.findOne(query).populate('children');
            if (!rec) {
                return false;
            }
            const storage = await store.get(rec.store);
            if (!storage) {
                return false;
            }
            //removing file
            const plainObj = rec.toObject();
            const [, info] = await storage.delete(plainObj);
            //updating document as closed
            await rec.close({ info });
            if (!plainObj.parent){
                const children = await this.listAll({__latest: true, parent: plainObj._id});
                if(children && children.length){
                    await Promise.all(
                        children.map(
                            child => this.getOneByIdAndRemove(child._id, sessionId)
                        )
                    );
                }
            }
            return rec;
        } catch (e) {
            log.error(e);
            return false;
        }
    },
};

exports.thisMethods = {};

exports.thisVirtuals = {
    'children': {
        ref: MODEL_NAME,
        localField: '_id',
        foreignField: 'parent',
        match: { __closed: false, __latest: true }
    }
};