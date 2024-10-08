// @ts-check

const Log = require("not-log")(module, "Timeweb driver");
const {
    MODULE_NAME,
    OPT_INFO_PARENT,
    OPT_INFO_VARIANT,
} = require("../../const.cjs");
const S3 = require("aws-sdk/clients/s3");

const notError = require("not-error/src/error.node.cjs");
const notNode = require("not-node");
const { partCopyObjExcept } = notNode.Common;
const path = require("node:path");

const {
    notStoreExceptionDeleteFromStoreError,
    notStoreExceptionDirectDeleteError,
    notStoreExceptionDirectListError,
    notStoreExceptionDirectUploadError,
    notStoreExceptionListStoreError,
    notStoreExceptionUploadError,
} = require("../../exceptions/driver.exceptions.cjs");
const DEFAULT_OPTIONS = require("./timeweb.driver.options.cjs");
const notStoreDriver = require("../../proto/driver.cjs");

/**
 * @typedef {Object}    S3ObjectUploadParams
 * @property {string}  Bucket
 * @property {string}  [Key]
 * @property {string}  [key]
 * @property {import('../../proto/driver.streamer.cjs').ReadingPipe}  [Body]
 */

/**
 * @typedef {Object}    S3ObjectDeleteParams
 * @property {string}  Bucket
 * @property {string}  [Key]
 */

/**
 * @typedef {Object} S3ObjectUploadResult
 * @property {string}  Bucket
 * @property {string}  Key
 * @property {string}  key
 * @property {string}  ETag
 * @property {string}  Location
 * @property {string}  Local
 */

/**
 *
 *
 * @class notStoreDriverTimeweb
 * @extends {notStoreDriver}
 */
class notStoreDriverTimeweb extends notStoreDriver {
    #s3;
    #name;
    /**
     * options object
     * properties values starting with `ENV$` will be processed as request to retrieve process.ENV[part_of_value_past_ENV$]
     * ex. options = { region: 'ENV$STORE_REGION' } => will retrieve value of process.ENV.STORE_REGION
     * @param {Object} options 						object with options for driver
     * @param {string} options.accessKeyId 			bucket access key id
     * @param {string} options.secretAccessKey 		bucket secret access key
     * @param {string} options.endpoint			 	url of API
     * @param {boolean} options.s3ForcePathStyle	Whether to force path style URLs for S3 objects. more at https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#s3ForcePathStyle-property
     * @param {string} options.region				store server location
     * @param {string} options.apiVersion			preffered API version
     * @param {string} options.bucket 				AWS S3 bucket name
     * @param {string} options.path        			sub path in bucket
     * @param {string} options.tmp					absolute path to local tmp folder
     * @param {boolean} options.groupFiles			file groupping in folders by first few letters of filename
     * @param {object} processors		description of processing pipes for pre/post action execution
     * 	{
     * 		add:	//store action name
     * 			{
     * 				pre:[	//list of pre processing pipe
     * 					['name_of_processor', {options: 1}],		//processor with options
     * 					'name_of_processor_2'						//processor without options
     * 					],
     * 				post:[]	//same story as in pre section
     * 			}
     * 	}
     * @param {string} storeName		             name of this driver store
     * @memberof notStoreDriverTimeweb
     */
    constructor(options, processors, storeName) {
        super(options, processors);
        this.#name = storeName;
        this.#initS3Client();
    }

    /**
     *
     *
     * @readonly
     * @return {string} name of store
     * @memberof notStoreDriverTimeweb
     */
    get name() {
        return this.#name;
    }

    /**
     *
     * @returns {import('../../proto/driver.cjs').DriverDescription}
     */
    static getDescription() {
        return {
            actions: ["upload", "delete", "list"],
            id: "timeweb",
            title: `${MODULE_NAME}:driver_timeweb_title`,
            ui: "notStoreUIDriverOptionsTimeweb",
        };
    }

    /**
     * Default options
     *
     * @static
     * @return {object}
     * @memberof notStoreDriverTimeweb
     */
    static getDefaultOptions() {
        return DEFAULT_OPTIONS;
    }

    /**
     * Returns object with options to perform S3 API actions
     * @returns {import('./timeweb.driver.options.cjs').S3OptionsObject}
     */
    createS3Options() {
        const props = [
            "accessKeyId",
            "secretAccessKey",
            "endpoint",
            "s3ForcePathStyle",
            "region",
            "apiVersion",
        ];
        const s3Options = {};
        props.forEach((propName) => {
            s3Options[propName] = this.getOptionValueCheckENV(propName);
        });
        return s3Options;
    }

    #initS3Client() {
        this.#s3 = new S3(this.createS3Options());
    }

    /**
     *
     *
     * @param {string} fullFilenameFrom
     * @param {string} fullFilenameInStoreTo
     * @return {Promise<S3ObjectUploadParams>}
     * @memberof notStoreDriverTimeweb
     */
    async getDirectUploadParams(fullFilenameFrom, fullFilenameInStoreTo) {
        return {
            Body: await notStoreDriver.streamer.readableStreamFromFilename(
                fullFilenameFrom
            ),
            Bucket: this.getOptionValueCheckENV("bucket"),
            Key: this.resolvePath(fullFilenameInStoreTo),
        };
    }

    /**
     * adds file to storage
     * @param		{String|Buffer|import('node:stream').Readable}	file	file in some form or his URI
     * @param       {object} [fileInfo={}]
     * @returns	    {Promise<Object>}	            file info object (info field in document)
     */
    async upload(file, fileInfo = {}) {
        let tmpFilename;
        try {
            //saving input data to local temp file
            Log.debug("start stash");
            const { name_tmp, uuid } = await this.stashFile(file);
            tmpFilename = name_tmp;
            //fill file info
            fileInfo.uuid = uuid;
            fileInfo.name_tmp = name_tmp;
            fileInfo.size = await this.getFileSize(name_tmp);
            //file processing sequence pre-main-post
            await this.processors.runPre(
                "upload",
                {
                    info: fileInfo,
                    parent: fileInfo[OPT_INFO_PARENT],
                    path: name_tmp,
                },
                this
            );
            const result = await this.directUpload(
                name_tmp,
                this.composeFullFilename(uuid)
            );
            fileInfo.cloud = partCopyObjExcept(result, ["name_tmp"]);
            await this.processors.runPost(
                "upload",
                {
                    cloud: result,
                    info: fileInfo,
                    parent: fileInfo[OPT_INFO_PARENT],
                    path: name_tmp,
                    variant: fileInfo[OPT_INFO_VARIANT],
                },
                this
            );
            //
            Log.debug("done", [name_tmp, JSON.stringify(fileInfo, null, 4)]);
            return fileInfo;
        } catch (e) {
            let err = e;
            //if error is our specialized version - reporting
            if (!(err instanceof notError)) {
                //extending to notError compatible
                err = new notStoreExceptionUploadError(e);
            }
            this.report(err);
            return err;
        } finally {
            //we should remove local temp file anyway
            if (
                tmpFilename &&
                (await notNode.Common.tryFileAsync(tmpFilename))
            ) {
                await this.removeFile(tmpFilename);
            }
        }
    }

    /**
     * Uploads file from absolute path to location in store
     * If store is in sub-dir of medium, then sub-dir will be
     * used as root
     *
     * @param {string} fullFilenameFrom
     * @param {string} fullFilenameInStoreTo
     * @return {Promise<S3ObjectUploadResult>}
     * @memberof notStoreDriverTimeweb
     */
    async directUpload(fullFilenameFrom, fullFilenameInStoreTo) {
        const uploadParams = await this.getDirectUploadParams(
            fullFilenameFrom,
            fullFilenameInStoreTo
        );
        try {
            const result = await this.#s3.upload(uploadParams).promise();
            result.Local = fullFilenameFrom;
            return result;
        } catch (e) {
            throw new notStoreExceptionDirectUploadError(
                {
                    fullFilenameFrom,
                    fullFilenameInStoreTo,
                },
                e
            );
        }
    }

    /**
     * Takes in list of full filenames and optionaly path in store,
     * if sub path in store not provided, then files will be saved in store (not medium) root
     *
     * @param {Array<string>}   fullFilenamesFrom       List of full qualified paths to files
     * @param {string}          [dirInStoreTo='']
     * @return {Promise<Array<S3ObjectUploadResult>>}
     * @memberof notStoreDriverTimeweb
     */
    async directUploadMany(fullFilenamesFrom, dirInStoreTo = "") {
        return await Promise.all(
            fullFilenamesFrom.map((fname) => {
                return this.directUpload(
                    fname,
                    path.join(dirInStoreTo, path.basename(fname))
                );
            })
        );
    }

    /**
     * takes in array of results of uploads
     * returns object{_LocalFullFilename_:{S3ObjectUploadResult}}
     * [{Local:'local1', Location, ETag, Key, key, Bucket}]
     * -->
     * {local1:{Location, ETag, Key, key, Bucket}}
     * @param {Array<S3ObjectUploadResult>} results
     * @returns {Object}
     */
    transformDirectUploadResultsToObject(results) {
        const res = {};
        results.forEach((itm) => {
            res[itm.Local] = { ...itm };
            delete res[itm.Local].Local;
        });
        return res;
    }

    /**
     * Takes in list of full filenames and optionaly path in store,
     * if sub path in store not provided, then files will be saved in store (not medium) root
     *
     * @param {Array<string>}   fullFilenamesFrom       List of full qualified paths to files
     * @param {string}          [dirInStoreTo='']
     * @return {Promise<Object>}
     * @memberof notStoreDriverTimeweb
     */
    async directUploadManyTransformed(fullFilenamesFrom, dirInStoreTo) {
        return this.transformDirectUploadResultsToObject(
            await this.directUploadMany(fullFilenamesFrom, dirInStoreTo)
        );
    }

    /**
     *
     *
     * @param {string} filename
     * @param {boolean} [inStorePath=true]
     * @return {S3ObjectDeleteParams}
     * @memberof notStoreDriverTimeweb
     */
    composeDirectDeleteParams(filename, inStorePath = true) {
        const fullFilenameInStore = inStorePath
            ? this.resolvePath(filename)
            : filename;
        return {
            Bucket: this.getOptionValueCheckENV("bucket"),
            Key: fullFilenameInStore,
        };
    }

    /**
     * Delete file directly
     *
     * @param {object} file
     * @param {boolean} [inStorePath=true]
     * @return {Promise<object>}
     * @memberof notStoreDriverTimeweb
     */
    async directDelete(file, inStorePath = true) {
        try {
            if (typeof file !== "object") {
                throw new TypeError(
                    `Argument "file" should be an object, provided ${typeof file}`
                );
            }
            const params = this.composeDirectDeleteParams(
                file.cloud.Key,
                inStorePath
            );
            return await this.#s3.deleteObject(params).promise();
        } catch (e) {
            throw new notStoreExceptionDirectDeleteError(
                {
                    cloud: file.cloud,
                    inStorePath,
                },
                e
            );
        }
    }

    /**
     *
     *
     * @param {Array<Object>} files     list of object keys
     * @param {boolean} [inStorePath=true]  false - absolute medium path, true - relative to store root path
     * @return {Promise<object>}
     * @memberof notStoreDriverTimeweb
     */
    async directDeleteMany(files, inStorePath = true) {
        return await Promise.all(
            files.map((file) => this.directDelete(file, inStorePath))
        );
    }

    /**
     * Removes all associated with file document instances and versions of file across all locations
     * @param {object}  file
     * @returns {Promise<Array<boolean|Object, Object>|notError>} [result:boolean|Object, fileDoc:object] where result - result of directDelete of fileDoc.path
     */
    async delete(file) {
        try {
            //deleting of versions preferably here
            await this.processors.runPre("delete", file, this);
            //deleting main file, if presented
            const result = file ? await this.directDelete(file) : false;
            //after actions
            await this.processors.runPost("delete", file, this);
            return [result, file.info];
        } catch (e) {
            let err = e;
            if (!(e instanceof notError)) {
                err = new notStoreExceptionDeleteFromStoreError(
                    (file && file?.uuid) ?? "NO_FILE_UUID",
                    e
                );
            }
            this.report(err);
            return err;
        }
    }

    /**
     *
     *
     * @param {string}  pathInStore     path from root of bucket
     * @param {number}  limit           keys number limit per request
     * @return {Promise<Array<Object>>}
     * @memberof notStoreDriverTimeweb
     */
    async directList(pathInStore, limit = 1000) {
        try {
            const params = {
                Bucket: this.getOptionValueCheckENV("bucket"),
                MaxKeys: limit,
                Prefix: pathInStore,
            };
            let isTruncated = true;
            let listContent = [];
            while (isTruncated) {
                const result = await this.#s3.listObjectsV2(params).promise();
                const { Contents, IsTruncated, NextContinuationToken } = result;
                isTruncated = IsTruncated;
                params.ContinuationToken = NextContinuationToken;
                if (Array.isArray(Contents) && Contents.length) {
                    listContent.push(...Contents);
                } else {
                    break;
                }
            }
            return listContent;
        } catch (e) {
            throw new notStoreExceptionDirectListError(
                { limit, pathInStore },
                e
            );
        }
    }

    /**
     * List files in store's folder
     *
     * @param {string} pathInStore      path to directory in store relative to store root
     * @param {{}} [info={}]        some starting metadata
     * @return {Promise<Array<boolean|Object, Object>|notError>}
     * @memberof notStoreDriverTimeweb
     */
    async list(pathInStore, info = {}) {
        try {
            await this.processors.runPre(
                "list",
                { info, path: pathInStore },
                this
            );
            const result = await this.directList(pathInStore);
            await this.processors.runPost(
                "list",
                { info, path: pathInStore, result },
                this
            );
            return [result, info];
        } catch (e) {
            let err = e;
            if (!(err instanceof notError)) {
                err = new notStoreExceptionListStoreError(pathInStore, err);
            }
            this.report(err);
            return err;
        }
    }
}

module.exports = notStoreDriverTimeweb;
