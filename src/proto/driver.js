const notNode = require("not-node");
const Log = require("not-log")(module, "notStoreDriver");
const fs = require("fs");
const path = require("path");
const Stream = require("stream");
const http = require("http");
const https = require("https");
const isStream = require("is-stream");
const isUrl = require("valid-url");
const streamifier = require("streamifier");

const notStoreProcessors = require("../store.processors");

const {
    OPT_MAX_INPUT_PATH_LENGTH,
    FIRST_DIR_NAME_LENGTH,
    PROCESSOR_TYPES,
    DEFAULT_FILENAME_SPLIT,
    OPT_ENV_CHECKS,
} = require("../const");

const {
    //notStoreExceptionProccesorOptionsWrongFormat,
    notStoreExceptionFilenameToReadableStreamError,
    notStoreExceptionLocalFileDeleteError,
    //notStoreExceptionProccesorRunError,
} = require("../exceptions");

class notStoreDriver {
    #options;
    #processors;

    constructor(options = {}, processors = {}) {
        this.#options = options;
        this.#processors = processors;
    }

    static getDescription() {
        return {
            id: "id_in_store",
            title: "user friendly title",
            ui: "UIComponent name to edit driver options",
            actions: ["list", "of", "actions", "names"], //needed to attach pre/pos processors via Store editor UI
        };
    }

    /**
     * Returns options
     * @returns {object}	options
     */
    get options() {
        return this.#options;
    }

    /**
     * Gets value of option of `name`, than checks if its `value` is in special format,
     * which is mean that we should check process.ENV[value] for real value that we need
     * @param {string} name 	name of options property
     * @returns {*}	value from options or process.ENV
     */
    static getOptionValueCheckENV(name) {
        return notNode.Common.getValueFromEnv(
            this.#options,
            name,
            OPT_ENV_CHECKS
        );
    }

    /**
     *
     * @param {string} 		fname 	filename without path
     * @returns {string}
     */
    getPrefixDirName(fname) {
        return path.basename(fname).substring(0, FIRST_DIR_NAME_LENGTH);
    }

    /**
     *
     * @param {string} fname
     * @returns
     */
    getFullPathToFileFromFilename(fname) {
        return (
            this.getPrefixDirName(fname) +
            "/" +
            path.basename(fname).substring(FIRST_DIR_NAME_LENGTH)
        );
    }

    getPathInStore(filename) {
        let pathInStore = "";
        const optsPath = this.getOptionValueCheckENV("path");
        //groouping files in folders named as first N chars of filename 1234567.ext -> 123/4567.ext
        if (this.getOptionValueCheckENV("groupFiles")) {
            let end = filename ? this.getPrefixDirName(filename) : false;
            if (optsPath) {
                pathInStore = end ? path.join(optsPath, end) : optsPath;
            } else {
                pathInStore = end;
            }
        } else {
            if (optsPath) {
                pathInStore = optsPath;
            }
        }
        return pathInStore;
    }

    /**
     *	Returns UUID4 name for file
     *	@returns	{string}	UUIDv4 name
     */
    randomFilename() {
        return UUID.v4();
    }

    /**
     *	Returns filaname for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	postfix	postfix that will be added at end of uuid after '_'
     *	@param		{string}	format	file format name will be added at the end after '.'
     *	@returns	{string}	filename
     */
    getFilename(uuid, postfix, format) {
        return (
            uuid +
            (postfix ? DEFAULT_FILENAME_SPLIT + postfix : "") +
            (format ? "." + format : "")
        );
    }

    /**
     *	Returns filaname from root of the bucket for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	postfix	postfix that will be added at end of uuid after '_'
     *	@param		{string}	format	file format name will be added at the end after '.'
     *	@returns	{string}	full filename in bucket
     */
    getFullFilename(uuid, postfix, format) {
        return path.join(
            this.getPathInStore(uuid),
            this.getFilename(uuid, postfix, format)
        );
    }

    /**
     * Returns filename for a specific processing options
     * @param {object} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} variant 	some file processing description
     * @returns {string}
     */
    getVariantFilename(srcParts, variantShortName /*, variant*/) {
        return `${srcParts.name}${DEFAULT_FILENAME_SPLIT}${variantShortName}${srcParts.ext}`;
    }

    /**
     * Returns filename path for a specific processing options
     * @param {object} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} variant 	some file processing description
     * @returns {string}
     */
    getVariantPath(srcParts, variantShortName, variant) {
        return path.join(
            srcParts.dir,
            this.getVariantFilename(srcParts, variantShortName, variant)
        );
    }

    /**
     * Returns object with
     * {
     * 		[variantShortName:string]:{
     * 			variant:	[variant:string|number|object],
     * 			local:		[full_path_to_local_file:string],
     * 			filename:	[filename:string]
     * 		}
     * }
     * @param {string} src 		full path to file directory/a/b/c/filename.ext
     * @param {Object} variants {[shortName]:title}
     * @param {string} format 	file extension
     * @returns {object}
     */
    getVariantsPaths(src, variants, format) {
        let srcParts = path.parse(src),
            result = {};
        if (format) {
            srcParts.ext = `.${format}`;
        }
        Object.keys(variants).forEach((variantShortName) => {
            result[variantShortName] = {
                variant: variants[variantShortName],
                local: this.getVariantPath(
                    srcParts,
                    variantShortName,
                    variants[variantShortName]
                ),
                filename: this.getVariantFilename(
                    srcParts,
                    variantShortName,
                    variants[variantShortName]
                ),
            };
        });
        return result;
    }

    /**
     * Returns object {[variantShortName:string]:[filename.ext:string]}
     * @param {string} 	name 			original filename without extension
     * @param {object} 	variants 		{[name]:<optionsOfProcessing: object>}
     * @param {string} 	format 			extension of file
     * @param {boolean} addOriginal 	add original file variant to result object
     * @returns
     */
    getVariantsFilenames(name, variants, format, addOriginal = true) {
        let result = {};
        let srcParts = path.parse(name);
        const ext = `.${format}`;
        Object.keys(variants).forEach((variantShortName) => {
            result[variantShortName] = this.getVariantFilename(
                {
                    name: srcParts.name,
                    ext,
                },
                variantShortName,
                variants[variantShortName]
            );
        });
        if (addOriginal) {
            result.original = `${name}.${format}`;
        }
        return result;
    }

    /**
     *	converts "anything" to readable stream
     *	@param {String|Buffer|Stream} source	source of data
     *	@returns	{ReadableStream} for data consumption
     **/
    async convertToReadableStream(source) {
        if (typeof source === "string") {
            return this.readableStreamFromString(source);
        } else if (source instanceof Buffer) {
            //file as buffer
            return this.readableStreamFromBuffer(source);
        } else if (isStream(source)) {
            return source;
        } else {
            throw new Error("not streamable");
        }
    }

    /**
     * Buffer to Promise of readable stream
     * @param {Buffer} 		buffer 		buffer
     * @returns {Promise<Stream>}		buffer content
     */
    async readableStreamFromBuffer(buffer) {
        let stream = new Stream.Duplex();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    /**
     * String to promise of readable stream
     * @param 	{string} 	source 	string to convert
     * @returns {Promise<Stream>}	promise of content
     */
    async readableStreamFromString(source) {
        //line is too long === file in string
        if (source.length < OPT_MAX_INPUT_PATH_LENGTH) {
            //
            if (isUrl.isUri(encodeURI(source))) {
                this.readerStreamFromURL(source);
            } else {
                //guess this is file path, but lets check it on existence
                let stat = fs.lstatSync(source);
                if (stat.isFile()) {
                    return this.readableStreamFromFilename(source);
                } else {
                    //short line but not URL and not file path === stringified file
                    return this.readableStreamFromFileInString(source);
                }
            }
        } else {
            //file as string
            return this.readableStreamFromFileInString(source);
        }
    }

    /**
     * URL to Promise of readable stream
     * @param {string} 	source 		url of file
     * @returns {Promise<Stream>}	readable stream
     */
    async readerStreamFromURL(source) {
        return new Promise((resolve, reject) => {
            try {
                if (isUrl.isHttpsUri(source)) {
                    https.get(source, resolve);
                } else {
                    if (isUrl.isHttpUri(source)) {
                        http.get(source, resolve);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Filename to Promise of ReadStream
     * @param 		{string} 				source 		filename
     * @returns 	{Promise<Stream>}					readable stream of file data
     */
    async readableStreamFromFilename(source) {
        const strm = fs.createReadStream(source);
        strm.on("error", (e) => {
            Log.error(e);
            notNode.Application.report(
                new notStoreExceptionFilenameToReadableStreamError(source, e)
            );
        });
        return strm;
    }

    /**
     * String to Stream
     * @param {string} 	source 	file saved in string
     * @returns {Promise<Stream>}	reading stream
     */
    async readableStreamFromFileInString(source) {
        return streamifier.createReadStream(source);
    }

    /**
     *	Downloads file and saves to tmp folder
     *	@param		{String|Buffer|Stream}	file	file in some form or his URI
     *	@returns	{Promise}	of image metadata extracted with sharp with extra fields: uuid, tmpName
     */
    async stashFile(file) {
        let streamIn = await this.convertToReadableStream(file);
        return this.streamFileOut(streamIn);
    }

    /**
     * Saves data in temporal file returns Promise of temp filename
     * @param {Stream} streamIn 	incoming stream of file data
     * @returns Promise<string>		filename of saved temporal file
     */
    async streamFileOut(streamIn) {
        return new Promise((resolve, reject) => {
            try {
                let name = this.randomFilename(),
                    tmpName = path.join(
                        this.getOptionValueCheckENV("tmp"),
                        name
                    );
                let streamOut = fs.createWriteStream(tmpName);
                streamOut.on("finish", (err) => {
                    if (err) {
                        //return error
                        reject(err);
                    } else {
                        //return image name in store
                        resolve(tmpName);
                    }
                });
                streamIn.pipe(streamOut);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     *	Removes local file by full filename
     *	@param	{String}	filename	filename with path
     *	@returns{Promise}
     */
    async removeLocalFile(filename) {
        try {
            fs.promises.unlink(filename);
        } catch (e) {
            notNode.Application.report(
                new notStoreExceptionLocalFileDeleteError(filename, e)
            );
        }
    }

    /**
     *
     * @param {string} 	processorType 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @param {string} 	filename 		name of current file
     * @param {object} 	metadata 		file pipeline metadata
     * @returns
     */
    async runProcessors(type, action, filename, metadata) {
        if (this.isProcessorsSet(type, action)) {
            await notStoreProcessors.run(
                this.getProcessors(type, action), //processors list to run against file
                filename, //current target file
                metadata, //file metadata object
                this
            );
        }
    }

    /**
     * if processor exists returns true
     * @param {string} 	processorType 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @returns {boolean}
     */
    isProcessorsSet(processorType, action) {
        return (
            Object.hasOwn(this.#processors, action) &&
            Object.hasOwn(this.#processors[action], processorType) &&
            Array.isArray(this.#processors[action][processorType])
        );
    }

    /**
     * list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     * @param {string} processorType 	'pre' or 'post'
     * @param {string} action 			name of pipeline action
     * @returns {array}	list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     */
    getProcessors(processorType, action) {
        return this.#processors[action][processorType];
    }

    async runPreProcessors(action, filename, metadata) {
        return this.runProcessors(
            PROCESSOR_TYPES.PROCESSOR_TYPE_PRE,
            action,
            filename,
            metadata
        );
    }

    async runPostProcessors(action, filename, metadata) {
        return this.runProcessors(
            PROCESSOR_TYPES.PROCESSOR_TYPE_POST,
            action,
            filename,
            metadata
        );
    }
}

module.exports = notStoreDriver;
