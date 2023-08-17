const notNode = require("not-node");

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const notStoreDriverProcessors = require("./driver.processors.cjs");
const notStoreDriverFilenameResolver = require("./driver.filename.resolver.cjs");
const notStoreDriverStreamer = require("./driver.streamer.cjs");

const { OPT_ENV_CHECKS } = require("../const.cjs");

const {
    notStoreDriverExceptionRemoveFile,
} = require("../exceptions/driver.exceptions.cjs");

class notStoreDriver {
    //standart helpers
    static processorsManager = notStoreDriverProcessors;
    //file naming rules
    static filenameResolver = notStoreDriverFilenameResolver;
    // * to readable stream
    static streamer = notStoreDriverStreamer;

    #options;
    #processors;

    constructor(options = {}, processors = {}) {
        this.#options = options;
        this.#processors = new notStoreDriver.processorsManager(processors);
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

    get processors() {
        return this.#processors;
    }

    /**
     * Gets value of option of `name`, than checks if its `value` is in special format,
     * which is mean that we should check process.ENV[value] for real value that we need
     * @param {string} name 	name of options property
     * @returns {*}	value from options or process.ENV
     */
    getOptionValueCheckENV(name) {
        return notNode.Common.getValueFromEnv(
            this.options,
            name,
            OPT_ENV_CHECKS
        );
    }

    /**
     * Prefix used to group files by their filenames starting characters
     */

    /**
     *	Returns UUID4 name for file
     *	@returns	{string}	UUIDv4 name
     */
    uuid() {
        return uuidv4();
    }

    /**
     * Returns first few characters from from filename
     * @param {string} 		fname 	filename without path
     * @returns {string}
     */
    resolvePrefixDir(fname) {
        return notStoreDriver.filenameResolver.prefixDir(fname);
    }

    /**
     * Returns full path to file's directory in store
     * [path_to_store][prefix_directory_name?]
     * options.path = 'store-1'
     * if options.gorupFiles = true
     * 1234567..jpg => store-1/123
     * if options.gorupFiles = false
     * 1234567..jpg => store-1
     * @param {string}      filename               filename
     * @returns {string}
     */
    resolvePathInStore(fname) {
        return notStoreDriver.filenameResolver.pathInStore(fname, {
            path: this.getOptionValueCheckENV("path"),
            groupFiles: this.getOptionValueCheckENV("groupFiles"),
        });
    }

    /**
     *	Returns filaname for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	postfix	postfix that will be added at end of uuid after '_'
     *	@param		{string}	format	file format name will be added at the end after '.'
     *	@returns	{string}	filename
     */
    resolveFilename(uuid, postfix, format) {
        return notStoreDriver.filenameResolver.filename(uuid, postfix, format);
    }

    /**
     *	Returns filaname from root of the bucket for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	postfix	postfix that will be added at end of uuid after '_'
     *	@param		{string}	format	file format name will be added at the end after '.'
     *	@returns	{string}	full filename in bucket
     */
    resolveFullFilenameInStore(uuid, postfix, format) {
        return notStoreDriver.filenameResolver.fullFilenameInStore(
            uuid,
            postfix,
            format,
            this.options
        );
    }

    /**
     * Returns filename for a specific processing options
     * @param {object} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} variant 	some file processing description
     * @returns {string}
     */
    resolveVariantFilename(srcParts, variantShortName, variant) {
        return notStoreDriver.filenameResolver.variantFilename(
            srcParts,
            variantShortName,
            variant
        );
    }

    /**
     * Returns filename path for a specific processing options
     * @param {object} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} variant 	some file processing description
     * @returns {string}
     */
    resolveVariantPath(srcParts, variantShortName, variant) {
        return notStoreDriver.filenameResolver.variantPath(
            srcParts,
            variantShortName,
            variant
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
    resolveVariantsPaths(src, variants, format) {
        return notStoreDriver.filenameResolver.variantsPaths(
            src,
            variants,
            format
        );
    }

    /**
     * Returns object {[variantShortName:string]:[filename.ext:string]}
     * @param {string} 	name 			original filename without extension
     * @param {object} 	variants 		{[name]:<optionsOfProcessing: object>}
     * @param {string} 	format 			extension of file
     * @param {boolean} addOriginal 	add original file variant to result object
     * @returns
     */
    resolveVariantsFilenames(name, variants, format, addOriginal = true) {
        return notStoreDriver.filenameResolver.variantsFilenames(
            name,
            variants,
            format,
            addOriginal
        );
    }

    /**
     *	Downloads file and saves to tmp folder
     *	@param		{String|Buffer|Stream}	file	file in some form or his URI
     *	@returns	{Promise}	of image metadata extracted with sharp with extra fields: uuid, tmpName
     */
    async stashFile(file) {
        const uuid = this.uuid();
        const name_tmp = path.join(this.getOptionValueCheckENV("tmp"), uuid);
        let streamIn = await notStoreDriver.streamer.convertToReadableStream(
            file
        );
        return notStoreDriver.streamer.streamFileOut(streamIn, uuid, name_tmp);
    }

    /**
     * returns promise of a number of bytes in a target file
     * @param {string}      path    full path to file
     * @returns {Promise<number>}    file size in bytes
     */
    async getFileSize(path) {
        const stats = await fs.promises.stat(path);
        return stats.size;
    }

    /**
     *	Removes local file by full filename
     *	@param	{String}	filename	filename with path
     *	@returns{Promise}
     */
    async removeFile(filename) {
        try {
            await fs.promises.unlink(filename);
            return 0;
        } catch (e) {
            return e;
        }
    }

    /**
     *   standart testing action, to test store driver configuration
     */
    async test() {
        //some testing
    }
}

module.exports = notStoreDriver;
