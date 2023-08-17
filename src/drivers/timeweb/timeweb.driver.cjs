const Log = require("not-log")(module, "Timeweb driver");
const { MODULE_NAME } = require("../../const.cjs");
const S3 = require("aws-sdk/clients/s3");

const notError = require("not-error/src/error.node.cjs");
const notNode = require("not-node");
const path = require("node:path");

const {
    notStoreExceptionUploadError,
    notStoreExceptionDirectUploadError,
    notStoreExceptionDirectDeleteError,
    notStoreExceptionDeleteFromStoreError,
    notStoreExceptionListStoreError,
} = require("../../exceptions/driver.exceptions.cjs");

const notStoreDriver = require("../../proto/driver.cjs");
const DEFAULT_OPTIONS = require("./timeweb.driver.options.cjs");

class notStoreDriverTimeweb extends notStoreDriver {
    #s3;
    #name
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
     * @param {string} options.bucket 				bucket name
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
     */
    constructor(options, processors, storeName) {
        super(options, processors);
        this.#name = storeName;
        this.#initS3Client();
    }

    get name(){
        return this.#name;
    }

    static getDescription() {
        return {
            id: "timeweb",
            title: `${MODULE_NAME}:driver_timeweb_title`,
            ui: "notStoreUIDriverOptionsTimeweb",
            actions: ["add", "delete", "list"],
        };
    }

    getOptions() {
        return DEFAULT_OPTIONS;
    }

    #initS3Client() {
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
        this.#s3 = new S3(s3Options);
    }
    

    /**
     * adds file to storage
     * @param		{String|Buffer|Stream}	file	file in some form or his URI
     * @returns	    {Promise<Object>}	            file info object (info field in document)
     */
    async upload(file) {
        let tmpFilename;
        const fileInfo = {};
        try {
            Log.debug("start stash");
            const {name_tmp, uuid} = await this.stashFile(file);
            tmpFilename = name_tmp;
            fileInfo.uuid = uuid;
            fileInfo.name_tmp = name_tmp;            
            fileInfo.size = await this.getFileSize(name_tmp);
            await this.runPreProcessors("add", name_tmp, fileInfo);
            await this.directUpload(
                name_tmp,
                this.getPathInStore(uuid)
            );
            await this.runPostProcessors("add", name_tmp, fileInfo);
            Log.debug("done", [name_tmp, JSON.stringify(fileInfo, null, 4)]);            
        } catch (e) {
            if (e instanceof notError) {
                notNode.Application.report(e);
            } else {
                notNode.Application.report(
                    new notStoreExceptionUploadError(e)
                );
            }
        } finally {
            if (
                tmpFilename &&
                (await notNode.Common.tryFileAsync(tmpFilename))
            ) {
                await this.removeLocalFile(tmpFilename);
            }
            return fileInfo;
        }
    }

    async directUpload(file, folder) {
        try {
            const uploadParams = {
                Bucket: this.getOptionValueCheckENV("bucket"),
                Key: path.join(folder, path.basename(file)),
                Body: await this.readableStreamFromFilename(file),
            };
            return await this.#s3.upload(uploadParams).promise();
        } catch (e) {
            throw new notStoreExceptionDirectUploadError(
                {
                    file,
                    folder,
                },
                e
            );
        }
    }

    async directUploadMany(filenames, folder) {
        return await Promise.all(
            filenames.map((fname) => this.directUpload(fname, folder))
        );
    }

    async directDelete(filename) {
        try {
            const params = {
                Key: filename,
                Bucket: this.getOptionValueCheckENV("bucket"),
            };
            return await this.#s3.deleteObject(params).promise();
        } catch (error) {
            throw new notStoreExceptionDirectDeleteError(
                {
                    key,
                },
                error
            );
        }
    }

    /**
     * Removes all associated with file document instances and versions of file across all locations
     * @param {object} fileDoc 
     * @returns {Promise<Array<boolean|Object, Object>>} [result:boolean|Object, fileDoc:object] where result - result of directDelete of fileDoc.path
     */
    async delete(fileDoc) {
        try {
            //deleting of versions preferably here
            await this.runPreProcessors("delete", filename, fileDoc.metadata);
            //deleting main file if presented
            const result = fileDoc?.path ? await this.directDelete(fileDoc.path):false;
            //after actions
            await this.runPostProcessors("delete", filename, fileDoc.metadata);
            return [result, fileDoc];
        } catch (e) {
            if (e instanceof notError) {
                notNode.Application.report(e);
            } else {
                notNode.Application.report(
                    new notStoreExceptionDeleteFromStoreError(filename, e)
                );
            }
        }
    }

    async directList(pathInStore) {
        if (!pathInStore) {
            pathInStore = this.getPathInStore();
        }
        const params = {
            Bucket: this.getOptionValueCheckENV("bucket"),
            prefix: pathInStore,
        };
        return await this.#s3.listObjectsV2(params).promise();
    }

    async list(pathInStore) {
        try {
            const metadata = {};
            await this.runPreProcessors("list", pathInStore, metadata);
            const result = await this.directList(pathInStore);
            await this.runPostProcessors("list", pathInStore, metadata);
            return [result, metadata];
        } catch (e) {
            if (e instanceof notError) {
                notNode.Application.report(e);
            } else {
                notNode.Application.report(
                    new notStoreExceptionListStoreError(pathInStore, e)
                );
            }
        }
    }
}

module.exports = notStoreDriverTimeweb;
