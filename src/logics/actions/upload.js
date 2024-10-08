const { DOCUMENT_OWNER_FIELD_NAME } = require("not-node/src/auth/const.js");
const {
    LogicCreateActionException,
} = require("not-node/src/exceptions/action");
const notError = require("not-error/src/error.node.cjs");
const store = require("../../store.cjs");
const mime2ext = require("../../mime2ext.cjs");
const { objHas, partCopyObjExcept } = require("not-node/src/common");

const {
    INFO_EXCEPT_LIST,
    OPT_INFO_CHILDREN,
    OPT_INFO_PARENT,
    OPT_INFO_PREVIEW,
    OPT_INFO_VARIANT,
} = require("../../const.cjs");

module.exports = class UploadAction {
    static async run(logic, actionName, { files, identity, store: storeName }) {
        try {
            logic.logDebugAction(actionName, identity);
            this.normalizeInputFiles(files);

            const storeBucket = await store.get(storeName);
            if (!storeBucket) {
                throw new notError("Store bucket is not exist", {
                    storeName,
                });
            }
            const results = await this.uploadSets(
                logic,
                identity,
                files,
                storeBucket
            );
            if (this.resultsIsPartiallySuccessful(results)) {
                if (!logic.config.get("keepPartiallySuccessful")) {
                    await this.removeFiles(results, storeBucket);
                }
            }
            logic.logAction(actionName, identity, {
                errors: this.getErroredResults(files, results),
                files: this.getFilesInfo(files, true),
            });
            return this.simplifyResults(results);
        } catch (e) {
            throw new LogicCreateActionException(
                {
                    actionName,
                    activeUserId: identity?.uid,
                    role: identity?.role,
                    store: storeName,
                },
                e
            );
        }
    }

    static countErrors(results) {
        let n = 0;
        results.forEach((item) => {
            if (item.status === "rejected") {
                n++;
            }
        });
        return n;
    }

    /**
     *
     *
     * @static
     * @param {*} logic
     * @param {import('not-node/src/types').notAppIdentityData} identity
     * @param {*} filesSet
     * @param {*} storeBucket
     * @return {Promise<import('../../types.cjs').UploadResultsSet>}
     */
    static async uploadSet(logic, identity, filesSet, storeBucket) {
        return Promise.allSettled(
            filesSet.map((file) =>
                this.uploadFile(logic, storeBucket, file, identity)
            )
        );
    }

    /**
     *
     * @param {*} logic
     * @param {import('not-node/src/types').notAppIdentityData} identity
     * @param {import('../../types.cjs').FilesSets} filesSets
     * @param {*} storeBucket
     * @returns {Promise<import('../../types.cjs').UploadResultsSets>}
     */
    static async uploadSets(logic, identity, filesSets, storeBucket) {
        let resultsSets = {};
        for (let setName of Object.keys(filesSets)) {
            resultsSets[setName] = await this.uploadSet(
                logic,
                identity,
                filesSets[setName],
                storeBucket
            );
        }
        return resultsSets;
    }

    /**
     *
     *
     * @param {import('../../types.cjs').FilesSets} files
     * @param {import('../../types.cjs').UploadResultsSets} results
     * @returns {Object<String, Array<import('../../types.cjs').UploadError>>}
     */
    static getErroredResults(files, results) {
        const errored = {};
        Object.keys(files).forEach((setName) => {
            files[setName].forEach((file, index) => {
                if (results[setName][index].status === "rejected") {
                    if (!Array.isArray(errored[setName])) {
                        errored[setName] = [];
                    }
                    const fileError = {
                        ...this.getFileInfo(file),
                        error: results[setName][index].reason,
                    };
                    errored[setName].push(fileError);
                }
            });
        });
        return errored;
    }

    /**
     * Ensures that each prop is an array
     * @param {Object<string, Array<Object> | Object>} files
     * @return {import('../../types.cjs').FilesSets}
     */
    static normalizeInputFiles(files) {
        Object.keys(files).forEach((setName) => {
            if (Array.isArray(files[setName])) {
                files[setName] = files[setName].map((itm) =>
                    this.getFileInfo(itm)
                );
            } else {
                files[setName] = [this.getFileInfo(files[setName])];
            }
        });
        return files;
    }

    static resultsIsPartiallySuccessful(results) {
        let totalErrorsCount = 0;
        Object.keys(results).forEach((setName) => {
            totalErrorsCount += this.countErrors(results[setName]);
        });
        return totalErrorsCount;
    }

    /**
     *
     *
     * @static
     * @param {Object} file
     * @return {import('../../types.cjs').FileInfo}
     */
    static getFileInfo(file, noData = false) {
        return {
            data: noData ? undefined : file.data,
            format: file?.format || mime2ext.convert(file?.mimetype),
            info: file?.info || {},
            mimetype: file?.mimetype,
            name: file.name,
            size: file?.size || 0,
        };
    }

    static getFilesInfo(filesSets, noData) {
        const res = {};
        Object.keys(filesSets).forEach((setName) => {
            res[setName] = filesSets[setName].map((itm) =>
                this.getFileInfo(itm, noData)
            );
        });
        return res;
    }

    static async removeFiles(results, storeBucket) {
        for (let setName of Object.keys(results)) {
            await Promise.allSettled(
                results[setName].map((itm) => {
                    if (itm.status !== "rejected") {
                        console.error(itm);
                    }
                })
            );
        }
    }

    static simplifyResults(results) {
        const simply = {};
        Object.keys(results).forEach((setName) => {
            simply[setName] = results[setName].map((itm) => itm.value);
        });
        return simply;
    }

    /**
     *
     *
     * @static
     * @param {*} logic
     * @param {*} storeBucket
     * @param {import('../../types.cjs').FileInfo} file
     * @param {import('not-node/src/types').notAppIdentityData} identity
     * @return {Promise<import('mongoose').Document>}
     */
    static async uploadFile(logic, storeBucket, file, identity) {
        const uploadResult = await storeBucket.upload(
            file.data,
            file.info || {}
        );
        if (uploadResult instanceof notError) {
            throw uploadResult;
        }
        const documentData = this.composeDocument(
            file,
            uploadResult,
            storeBucket,
            identity
        );

        logic.logDebugAction("uploadFile", storeBucket.name, documentData);

        logic.logDebugAction(documentData);
        const document = await logic.getModel().add(documentData);

        if (this.anyChildrenToUpload(uploadResult)) {
            await this.uploadChildren(
                logic,
                storeBucket,
                identity,
                document,
                uploadResult[OPT_INFO_CHILDREN]
            );
        }

        return document.toObject();
    }

    /**
     *
     * @param {*}   logic
     * @param {*}   storeBucket
     * @param {import('not-node/src/types').notAppIdentityData} identity
     * @param {import('mongoose').Document} parent
     * @param {Array<Object>} children
     */
    static async uploadChildren(
        logic,
        storeBucket,
        identity,
        parent,
        children
    ) {
        const childrenFiles = Object.keys(children).map((variant) => {
            const itm = children[variant];
            return {
                data: itm.local,
                info: {
                    [OPT_INFO_PARENT]: parent._id,
                    [OPT_INFO_PREVIEW]: itm[OPT_INFO_PREVIEW],
                    [OPT_INFO_VARIANT]: variant,
                },
                name: parent.name,
            };
        });
        let results = await this.uploadSet(
            logic,
            identity,
            childrenFiles,
            storeBucket
        );
        await Promise.all(
            childrenFiles.map((itm) => {
                return storeBucket.removeFile(itm.data);
            })
        );
        if (this.countErrors(results)) {
            if (!logic.config.get("keepPartiallySuccessful")) {
                await this.removeFiles(
                    {
                        children: results,
                    },
                    storeBucket
                );
            }
        }
        return results;
    }

    static anyChildrenToUpload(info) {
        return (
            objHas(info, OPT_INFO_CHILDREN) &&
            Object.values(info[OPT_INFO_CHILDREN]).length
        );
    }

    static composeDocument(file, uploadResult, storeBucket, identity) {
        return {
            //unique id
            uuid: uploadResult.uuid,
            //name of store bucket config
            store: storeBucket.name,
            cloud: uploadResult?.cloud,
            //original file name if provided
            name: file.name || uploadResult.name || uploadResult.uuid,
            //size
            size: uploadResult.size || file.size || 0,
            //extension of file
            extension: uploadResult?.metadata?.format || file?.format,
            //various information
            info: partCopyObjExcept(uploadResult, INFO_EXCEPT_LIST),
            //objectId of file this produced from
            parent: uploadResult[OPT_INFO_PARENT],
            variant: uploadResult[OPT_INFO_VARIANT],
            //
            path: uploadResult?.path || uploadResult?.cloud?.Key,
            //ownership
            session: identity.sid,
            [DOCUMENT_OWNER_FIELD_NAME]: identity.uid,
            userIp: identity.ip,
        };
    }
};
