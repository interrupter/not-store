// @ts-check
const store = require("../../").notStore;
const { DOCUMENT_OWNER_FIELD_NAME } = require("not-node/src/auth/const.js");
const { MODULE_NAME } = require("../const.cjs");
const config = require("not-config").readerForModule("store");
const log = require("not-log")(module, "Model//File");

const MODEL_NAME = "File";

const FIELDS = [
    //original
    ["parent", `${MODULE_NAME}//parentFile`],
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
    [DOCUMENT_OWNER_FIELD_NAME, "not-node//owner"],
    "not-node//ownerModel",
    ["session", { required: !!config.get("sessionRequired") }],
    //dates
    "createdAt",
    "updatedAt",
];

exports.thisModelName = MODEL_NAME;

exports.enrich = {
    increment: true,
    incrementOptions: {
        filter: ["store"], //fileID field counters unique for each Store
    },
    validators: true,
    versioning: true,
};

exports.FIELDS = FIELDS;

exports.schemaOptions = {
    timestamps: true,
};

exports.thisStatics = {
    //
    async closeOneAndRemoveFile(rec, childrenToo = false) {
        try {
            const storage = await store.get(rec.store);
            if (!storage) {
                return false;
            }
            //removing file
            const plainObj = rec.toObject();
            const result = await storage.delete(plainObj);
            if (result instanceof Error) {
                throw result;
            }
            const [, info] = result;
            //updating document as closed
            await rec.close({ info });
            //removing children elements
            if (childrenToo) {
                const children = await this.listAll({
                    __latest: true,
                    parent: plainObj._id,
                });
                if (children && children.length) {
                    await Promise.all(
                        children.map((child) =>
                            this.closeOneAndRemoveFile(child, childrenToo)
                        )
                    );
                }
                plainObj.children = children.map((child) => child.toObject());
            }
            return plainObj;
        } catch (e) {
            log.error(e);
            return e;
        }
    },
    //
    async deleteAllInStore(storeName, filter = {}, childrenToo = false) {
        try {
            const list = await this.listAll({
                store: storeName,
                ...filter,
            });
            return await Promise.all(
                list.map((file) =>
                    this.closeOneAndRemoveFile(file, childrenToo)
                )
            );
        } catch (e) {
            log.error(e);
        }
    },
    //
    async deleteAllOriginalInStore(
        storeName,
        filter = {},
        childrenToo = false
    ) {
        try {
            return await this.deleteAllInStore(
                storeName,
                {
                    ...filter,
                    parent: { $exists: false },
                },
                childrenToo
            );
        } catch (e) {
            log.error(e);
        }
    },
    //
    async getOneByIdAndRemove(_id, sessionId) {
        try {
            let query = {
                __closed: false,
                __latest: true,
                _id,
            };
            if (sessionId) {
                query.session = sessionId;
            }
            let rec = await this.findOne(query);
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
            if (!plainObj.parent) {
                const children = await this.listAll({
                    __latest: true,
                    parent: plainObj._id,
                });
                if (children && children.length) {
                    await Promise.all(
                        children.map((child) =>
                            this.getOneByIdAndRemove(child._id, sessionId)
                        )
                    );
                }
            }
            return rec;
        } catch (e) {
            log.error(e);
            return e;
        }
    },
    //
    async setPreviewURL(targetId, previewURL) {
        try {
            let query = {
                __closed: false,
                __latest: true,
                _id: targetId,
            };
            let rec = await this.findOne(query);
            rec.info.previewURL = previewURL;
            rec.markModified("info.previewURL");
            await rec.save();
        } catch (e) {
            log.error(e);
        }
    },
    async setVariantURL(targetId, variant, URL) {
        try {
            let query = {
                __closed: false,
                __latest: true,
                _id: targetId,
            };
            let rec = await this.findOne(query);
            if (!rec.info?.variantURL) {
                rec.info.variantURL = {};
            }
            rec.info.variantURL[variant] = URL;
            rec.markModified("info.variantURL");
            await rec.save();
        } catch (e) {
            log.error(e);
        }
    },
    async unsetPreviewURL(targetId) {
        try {
            let query = {
                __closed: false,
                __latest: true,
                _id: targetId,
            };
            let rec = await this.findOne(query);
            rec.info.previewURL = "";
            rec.markModified("info.previewURL");
            await rec.save();
        } catch (e) {
            log.error(e);
        }
    },
    async unsetVariantURL(targetId, variant) {
        try {
            let query = {
                __closed: false,
                __latest: true,
                _id: targetId,
            };
            let rec = await this.findOne(query);
            if (rec?.info?.variantURL[variant]) {
                rec.info.variantURL[variant] = "";
                rec.markModified("info.variantURL");
                await rec.save();
            }
        } catch (e) {
            log.error(e);
        }
    },
};

exports.thisMethods = {};

exports.thisVirtuals = {
    children: {
        foreignField: "parent",
        localField: "_id",
        match: { __closed: false, __latest: true },
        ref: MODEL_NAME,
    },
};
