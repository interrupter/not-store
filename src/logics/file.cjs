const notNode = require("not-node");
const Log = require("not-log")(module, "logics");
const config = require("not-config").readerForModule("store");

const store = require("../../").notStore;
const mongoose = require("mongoose");
const { notError } = require("not-error");

const NAME = "File";
exports.thisLogicName = NAME;



class File {
    static async uploadFile(storeBucket, file, info, owner) {
        try {
            const App = notNode.Application;
            const fileInfo = await storeBucket.add(file);
            const File = App.getModel("File");
            let fileName = info?.name || fileInfo?.name_tmp;
            App.logger.debug("store.add.then", storeBucket.name, fileName, fileInfo);
            let fileData = {
                uuid: fileInfo.uuid,
                bucket: storeBucket.name,
                name: fileInfo.uuid,
                extension: fileInfo?.metadata?.format || info?.mimetype,
                path: fileInfo.path,
                paths: fileInfo?.paths,
                size: fileInfo?.size || 0,
                //additional information
                info: fileInfo || {},            
                width: fileInfo?.metadata?.width || 0,
                height: fileInfo?.metadata?.height || 0,
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
    
    static createUploads(files, storeBucket, owner) {
        let uploads = [];
        let slimFiles = {};
        if (files && Object.keys(files).length > 0) {
            for (let t of Object.keys(files)) {
                let fileField = files[t];
                if (Array.isArray(fileField)) {
                    slimFiles[t] = [];
                    Object.keys(fileField).forEach((fileFieldKey) => {
                        let oneFileFromField = fileField[fileFieldKey];
                        let slimInfo = {
                            name: oneFileFromField.name,
                            size: oneFileFromField.size,
                            format: oneFileFromField.format,
                        };
                        slimFiles[t].push(slimInfo);
                        uploads.push(
                            this.uploadFile(
                                storeBucket,
                                oneFileFromField.data,
                                slimInfo,
                                owner
                            )
                        );
                    });
                } else {
                    let slimInfo = {
                        name: fileField.name,
                        size: fileField.size,
                        format: fileField.format,
                    };
                    slimFiles[t] = slimInfo;
                    uploads.push(
                        this.uploadFile(storeBucket, fileField.data, slimInfo, owner)
                    );
                }
            }
        }
        return uploads;
    }

    static async upload({
        bucket = "client",
        sessionId,
        userIp,
        ownerId,
        files,
        /*  admin = false,
			ownerModel = 'User'*/
    }) {
        const App = notNode.Application;
        Log.debug("file.createNew");
        Log.debug(files);
        if (config.get("sessionRequired")) {
            if (!sessionId) {
                throw new notError("User session is undefined", { userIp });                
            }
        }
        const storeBucket = await store.get(bucket);
        if (storeBucket) {
            let uploads = this.createUploads(files, storeBucket, {
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
            throw new notError("store.add error, bucket is not exist", { bucket });
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
