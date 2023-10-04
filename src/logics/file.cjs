const { MODULE_NAME } = require("../const.cjs");

// @ts-check
const path = require("node:path");

const notNode = require("not-node");
const Log = require("not-log")(module, "logics");
const config = require("not-config").readerForModule("store");

const store = require("../../").notStore;
const {
    HttpExceptionNotFound,
    HttpExceptionBadRequest,
} = require("not-node/src/exceptions/http");
const {
    notStoreFileLogicExceptionDeleteDBError,
    notStoreFileLogicExceptionDeleteUserSessionIsNotValid,
} = require("../exceptions/logic.file.exceptions.cjs");

const notError = require("not-error/src/error.node.cjs");

const MODEL_NAME = "File";
exports.thisLogicName = MODEL_NAME;

const getModel = () => {
    return notNode.Application.getModel(`${MODULE_NAME}//${MODEL_NAME}`);
};

class File {
    static async uploadFile(storeBucket, file, info, owner) {
        try {
            const App = notNode.Application;
            const fileFormat =
                info?.format ||
                info?.mimetype ||
                path.parse(info.name).ext.replace(".", "");
            const uploadResult = await storeBucket.upload(file, {
                format: fileFormat,
            });
            console.log("uploadResult", uploadResult);
            if (uploadResult instanceof notError) {
                throw uploadResult;
            }
            const [, fileInfo] = uploadResult;
            const File = App.getModel("File");
            let fileName = info?.name || fileInfo?.name_tmp;
            const extension = fileInfo?.metadata?.format || fileFormat;
            App.logger.info(
                `add file(${fileName}) to store(${storeBucket.name}) `,
                info,
                fileInfo,
                extension
            );

            let fileData = {
                uuid: fileInfo.uuid,
                name: fileInfo.uuid,
                extension,
                store: storeBucket.name,
                info: fileInfo || {},
                path: fileInfo.path,
                size: fileInfo?.size || 0,
                //ownership
                session: owner.session,
                userIp: owner.ip,
                userId: owner.id,
            };
            App.logger.debug(fileData);
            return File.add(fileData);
        } catch (e) {
            Log.error(e);
            notNode.Application.report(e);
        }
    }

    static #eachFile(func, files) {
        if (files && Object.keys(files).length > 0) {
            for (let t of Object.keys(files)) {
                let fileField = files[t];
                if (Array.isArray(fileField)) {
                    Object.keys(fileField).forEach((fileFieldKey) => {
                        func(fileField[fileFieldKey]);
                    });
                } else {
                    func(fileField);
                }
            }
        }
    }

    static #packFileFieldToSlimFormatAndInitUpload(
        oneFileFromField,
        storeBucket,
        owner
    ) {
        let slimInfo = {
            name: oneFileFromField.name,
            size: oneFileFromField.size,
            format: oneFileFromField.format,
        };
        return this.uploadFile(
            storeBucket,
            oneFileFromField.data,
            slimInfo,
            owner
        );
    }

    static #createUploads(files, storeBucket, owner) {
        let uploads = [];
        this.#eachFile((fileField) => {
            uploads.push(
                this.#packFileFieldToSlimFormatAndInitUpload(
                    fileField,
                    storeBucket,
                    owner
                )
            );
        }, files);
        return uploads;
    }

    /**
     *
     *
     * @static
     * @param {object} LogicParams {
     *         bucket = "client",
     *         sessionId,
     *         userIp,
     *         ownerId,
     *         files,
     *     }
     * @return {Promise<object>}
     * @memberof File
     */
    static async upload({
        bucket = "client",
        sessionId,
        userIp,
        ownerId,
        files,
    }) {
        Log.debug("file.createNew");
        Log.debug(files);
        if (config.get("sessionRequired")) {
            if (!sessionId) {
                throw new notError("User session is undefined", { userIp });
            }
        }
        const storeBucket = await store.get(bucket);
        if (storeBucket) {
            let uploads = this.#createUploads(files, storeBucket, {
                session: sessionId,
                ip: userIp,
                id: ownerId,
            });
            if (uploads.length) {
                let results = await Promise.allSettled(uploads);
                let errors = results.some((item) => item.status === "rejected");
                Log.debug(
                    "data saved to db " +
                        (errors ? "with" : "without") +
                        " errors"
                );
                Log.debug("store.add.then.return/redirect");
                if (errors) {
                    throw new notError("Uploads not saved", { results });
                } else {
                    return results;
                }
            } else {
                throw new notError("Uploads list is empty");
            }
        } else {
            throw new notError("store.add error, bucket is not exist", {
                bucket,
            });
        }
    }

    static async list({ size, skip, filter, sorter }) {
        const App = notNode.Application;
        try {
            let File = App.getModel("File");
            let result = await File.listAndPopulate(
                skip,
                size,
                sorter,
                filter,
                []
            );
            return result;
        } catch (e) {
            throw new notError("store.list error", {}, e);
        }
    }

    static async listAndCount({ activeUserId, activeUser, query, ip, root }) {
        const App = notNode.Application;
        try {
            let File = App.getModel("File");
            let result = await File.listAndCount(
                query.skip,
                query.size,
                query.sorter,
                query.filter,
                query.search,
                []
            );
            return result;
        } catch (e) {
            throw new notError("store.list error", {}, e);
        }
    }

    static async delete({ targetId, identity }) {
        let docFile = await this.loadOneFile(targetId, identity);
        const storage = await store.get(docFile.store);
        if (!storage) {
            throw new HttpExceptionNotFound({
                params: { targetId, identity, tags: ["file.delete", "store"] },
            });
        }
        const objFile = docFile.toObject();
        const result = await storage.delete(objFile.path, objFile.info);
        if (Array.isArray(result)) {
            const [, info] = result;
            //updating document as closed
            await docFile.close({ info });
            return docFile.toObject();
        } else if (result instanceof notError) {
            throw result;
        } else {
            throw new HttpExceptionBadRequest({
                params: {
                    targetId,
                    identity,
                    tags: ["file.delete", "unknown"],
                },
            });
        }
    }

    static async loadOneFile(targetId, identity) {
        try {
            const File = getModel();
            const sessionRequired = config.get("sessionRequired");
            let result;
            //if super users
            if (identity.admin || identity.root) {
                result = await File.findOneById(targetId);
            }
            //if authenticated users
            else if (identity.auth) {
                result = await File.findOneByIdAndOwnerId(
                    targetId,
                    identity.uid
                );
            }
            //guest users
            else if (sessionRequired) {
                result = await File.findOneByIdAndSession(
                    targetId,
                    identity.sid
                );
            }
            if (result) {
                return result;
            }
            throw new HttpExceptionNotFound({
                params: {
                    targetId,
                    identity,
                    sessionRequired,
                },
            });
        } catch (e) {
            if (e instanceof HttpExceptionNotFound) {
                throw e;
            } else {
                throw new HttpExceptionNotFound({
                    params: { targetId, identity },
                    cause: e,
                });
            }
        }
    }
}

exports[MODEL_NAME] = File;
