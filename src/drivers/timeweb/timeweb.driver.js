const { MODULE_NAME } = require("../../const");
const S3 = require("aws-sdk/clients/s3");
const notError = require("not-error/src/error.node.cjs");
const notNode = require("not-node");
const path = require("node:path");

const {
    notStoreExceptionAddToStoreError,
    notStoreExceptionDirectUploadError,
    notStoreExceptionDeleteFromStoreError,
    notStoreExceptionListStoreError,
} = require("not-store/src/exceptions");

const notStoreDriver = require("../../proto/driver");
const DEFAULT_OPTIONS = require("./timeweb.driver.options");

class notStoreDriverTimeweb extends notStoreDriver {
    #s3;
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
     */
    constructor(options, processors) {
        super(options, processors);
        this.#initS3Client();
    }

    static getDescription() {
        return {
            id: "timeweb",
            title: `${MODULE_NAME}:driver_timeweb_title`,
            ui: "notStoreUIDriverOptionsTimeweb",
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

    async add(file) {
        let tmpFilename;
        try {
            tmpFilename = this.stashFile(file);
            const metadata = {};
            await this.runPreProcessors("add", tmpFilename, metadata);
            await this.directUpload(
                tmpFilename,
                this.getPathInStore(tmpFilename)
            );
            await this.runPostProcessors("add", tmpFilename, metadata);
        } catch (e) {
            if (e instanceof notError) {
                notNode.Application.report(e);
            } else {
                notNode.Application.report(
                    new notStoreExceptionAddToStoreError(e)
                );
            }
        } finally {
            if (
                tmpFilename &&
                (await notNode.Common.tryFileAsync(tmpFilename))
            ) {
                await this.removeLocalFile(tmpFilename);
            }
        }
    }

    async directUpload(file, folder) {
        try {
            const uploadParams = {
                Bucket: this.options.bucket,
                Key: path.basename(file),
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

    directUploadMany(filenames, folder) {
        let list = filenames.map((filename) => {
            return {
                path: filename,
                save_name: true,
            };
        });
        return this.#s3.Upload(list, folder);
    }

    directDelete(key) {
        return this.#s3.Remove(key);
    }

    async delete(filename) {
        try {
            const metadata = {};
            await this.runPreProcessors("delete", filename, metadata);
            const result = await this.directDelete(filename);
            await this.runPostProcessors("delete", filename, metadata);
            return [result, metadata];
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

    directList(pathInStore) {
        if (!pathInStore) {
            pathInStore = this.getPathInStore();
        }
        return this.#s3.GetList(pathInStore);
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
