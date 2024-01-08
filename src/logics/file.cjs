// @ts-check
const {MODULE_NAME} = require('../const.cjs');
const notNode = require("not-node");
const Log = require("not-log")(module, "logics");
const config = require("not-config").readerForModule("store");

const store = require("../../").notStore;
const mongoose = require("mongoose");
const notError = require("not-error/src/error.node.cjs");

const NAME = "File";
exports.thisLogicName = NAME;

const getModel = ()=>notNode.Application.getModel(`${MODULE_NAME}//${NAME}`);

class File {
    static async get({identity, targetId}){
        return await getModel().getOne(targetId, [{ path: 'userId', select: '_id userID username' }]);
    }

    static async uploadFile(storeBucket, file, info, owner) {
        try {
            const App = notNode.Application;
            const uploadResult = await storeBucket.upload(file, {});
            if(uploadResult instanceof notError){
                throw uploadResult;
            }
            const [result, fileInfo] = uploadResult;
            const File = App.getModel("File");
            let fileName = info?.name || fileInfo?.name_tmp;
            App.logger.debug(
                "store.add.then",
                storeBucket.name,
                fileName,
                fileInfo
            );
            let fileData = {
                uuid: fileInfo.uuid,
                name: fileInfo.uuid,
                extension: fileInfo?.metadata?.format || info?.mimetype,
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
            let result = await File.listAndCount(query.skip, query.size, query.sorter, query.filter, query.search,[]);
            return result;
        } catch (e) {
            throw new notError("store.list error", {}, e);
        }
    }

    static async delete({ fileId, sessionId = undefined, admin = false }) {
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            throw new notError("delete error; fileId is not ObjectId", {
                fileId,
                sid: sessionId,
                admin,
            });
        } else {
            const App = notNode.Application;
            let File = App.getModel("File");

            if (admin) {
                let result = File.getOneByIdAndRemove(fileId, undefined);
                if (result) {
                    return result;
                } else {
                    throw new Error("delete error; db error");
                }
            } else if (
                typeof sessionId !== "undefined" &&
                sessionId !== null &&
                sessionId &&
                sessionId.length > 10
            ) {
                let result = File.getOneByIdAndRemove(fileId, sessionId);
                if (result) {
                    return { status: "ok" };
                } else {
                    return { status: "failed" };
                }
            } else {
                throw new notError("delete error; no user session id", {
                    fileId,
                    sid: sessionId,
                    admin,
                });
            }
        }
    }
}

exports[NAME] = File;
