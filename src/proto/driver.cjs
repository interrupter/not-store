// @ts-check

const notNode = require("not-node");

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const notStoreDriverProcessors = require("./driver.processors.cjs");
const notStoreDriverFilenameResolver = require("./driver.filename.resolver.cjs");
const notStoreDriverStreamer = require("./driver.streamer.cjs");

const { OPT_ENV_CHECKS } = require("../const.cjs");

/**
 *  @typedef {Object}   DriverDescription
 *  @property {string}          id          driver unique id
 *  @property {string}          title       human readable title
 *  @property {string}          ui          UI component to render driver's options editor
 *  @property {Array<string>}   actions     list of available actions of driver
 *
 */

/**
 *
 *
 * @class notStoreDriver
 */
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

    /**
     *
     * @returns {DriverDescription}
     * @memberof notStoreDriver
     */
    static getDescription() {
        return {
            actions: ["list", "of", "actions", "names"], //needed to attach pre/pos processors via Store editor UI
            id: "id_in_store",
            title: "user friendly title",
            ui: "UIComponent name to edit driver options",
        };
    }

    /**
     * Returns options
     * @readonly
     * @returns {object}	options
     * @memberof notStoreDriver
     */
    get options() {
        const opts = {};
        Object.keys(this.#options).forEach((optName) => {
            opts[optName] = this.getOptionValueCheckENV(optName);
        });
        return opts;
    }

    /**
     *
     *
     * @readonly
     * @returns {notStoreDriverProcessors}
     * @memberof notStoreDriver
     */
    get processors() {
        return this.#processors;
    }

    /**
     * Gets value of option of `name`, than checks if its `value` is in special format,
     * which is mean that we should check process.ENV[value] for real value that we need
     * @param {string} name 	name of options property
     * @returns {any}	value from options or process.ENV
     * @memberof notStoreDriver
     */
    getOptionValueCheckENV(name) {
        return notNode.Common.getValueFromEnv(
            this.#options,
            name,
            OPT_ENV_CHECKS
        );
    }

    /**
     * Prefix used to group files by their filenames starting characters
     */

    /**
     * Returns UUID4 name for file
     * @returns	{string}	UUIDv4 name
     * @memberof notStoreDriver
     */
    uuid() {
        return uuidv4();
    }

    /**
     * Returns first few characters from from filename
     * @param {string} 		fname 	filename without path
     * @returns {string}
     * @memberof notStoreDriver
     */
    composeGroupDir(fname) {
        return notStoreDriver.filenameResolver.composeGroupDir(fname);
    }

    /**
     * Returns full path to file's directory in store
     * [path_to_store][prefix_directory_name?]
     * options.path = 'store-1'
     * if options.gorupFiles = true
     * 1234567..jpg => store-1/123
     * if options.gorupFiles = false
     * 1234567..jpg => store-1
     * @param       {string}      fname               filename
     * @returns     {string}
     * @memberof    notStoreDriver
     */
    composeFilePath(fname) {
        return notStoreDriver.filenameResolver.composePathToFile(fname, {
            groupFiles: this.getOptionValueCheckENV("groupFiles"),
            path: this.getOptionValueCheckENV("path"),
        });
    }

    /**
     *	Returns filaname for object by uuid, postfix and format
     * @param		{string}	uuid		unique id of object
     * @param		{string}	postfix	postfix that will be added at end of uuid after '_'
     * @param		{string}	format	file format name will be added at the end after '.'
     * @returns	    {string}	filename
     * @memberof    notStoreDriver
     */
    composeFilename(uuid, postfix, format) {
        return notStoreDriver.filenameResolver.composeFilename(
            uuid,
            postfix,
            format
        );
    }

    /**
     * Returns full path in store, if store uses prefix it will be added before relative path
     *
     * @param       {string} pathInStore
     * @return      {string}
     * @memberof    notStoreDriver
     */
    resolvePath(pathInStore) {
        return notStoreDriver.filenameResolver.resolvePath(pathInStore, {
            path: this.getOptionValueCheckENV("path"),
        });
    }

    /**
     *	Returns filaname from root of the bucket for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	[postfix]	postfix that will be added at end of uuid after '_'
     *	@param		{string}	[format]	file format name will be added at the end after '.'
     *	@returns	{string}	full filename in bucket
     * @memberof    notStoreDriver
     */
    composeFullFilename(uuid, postfix, format) {
        return notStoreDriver.filenameResolver.composeFullFilename(
            uuid,
            postfix,
            format,
            {
                groupFiles: this.getOptionValueCheckENV("groupFiles"),
                path: this.getOptionValueCheckENV("path"),
            }
        );
    }

    /**
     * Returns filename for a specific processing options
     * @param       {object} 		srcParts  			path.parse result object
     * @param       {string} 		variantShortName 	name of variant
     * @param       {string|number|object} variant 	some file processing description
     * @memberof    notStoreDriver
     * @returns     {string}
     */
    composeVariantFilename(srcParts, variantShortName, variant) {
        return notStoreDriver.filenameResolver.composeVariantFilename(
            srcParts,
            variantShortName,
            variant
        );
    }

    /**
     * Returns filename path for a specific processing options
     * @param       {object} 		srcParts  			path.parse result object
     * @param       {string} 		variantShortName 	name of variant
     * @param       {string|number|object} variant 	some file processing description
     * @returns     {string}
     * @memberof    notStoreDriver
     */
    composeVariantPath(srcParts, variantShortName, variant) {
        return notStoreDriver.filenameResolver.composeVariantPath(
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
     * @param       {string} src 		full path to file directory/a/b/c/filename.ext
     * @param       {Object} variants thumbs variants
     * @param       {string} format 	file extension
     * @returns     {object}
     * @memberof    notStoreDriver
     */
    composeVariantsPaths(src, variants, format = undefined) {
        return notStoreDriver.filenameResolver.composeVariantsPaths(
            src,
            variants,
            format
        );
    }

    /**
     * Returns object {[variantShortName:string]:[filename.ext:string]}
     * @param       {string} 	name 			original filename without extension
     * @param       {object} 	variants 		{[name]:<optionsOfProcessing: object>}
     * @param       {string} 	format 			extension of file
     * @param       {boolean} addOriginal 	add original file variant to result object
     * @returns     {Object}                {[variantShortName:string]:[filename.ext:string]} example {small:'small.jpg', big: 'big.jpg'}
     * @memberof    notStoreDriver
     */
    composeVariantsFilenames(name, variants, format, addOriginal = true) {
        return notStoreDriver.filenameResolver.composeVariantsFilenames(
            name,
            variants,
            format,
            addOriginal
        );
    }

    /**
     *	Downloads file and saves to tmp folder
     *	@param		{String|Buffer|import('stream').Readable}	file	file in some form or his URI
     *	@returns	{Promise}	of image metadata extracted with sharp with extra fields: uuid, tmpName
     * @memberof    notStoreDriver
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
     * @param       {string}      filePath    full path to file
     * @returns     {Promise<number>}    file size in bytes
     * @memberof    notStoreDriver
     */
    async getFileSize(filePath) {
        const stats = await fs.promises.stat(filePath);
        return stats.size;
    }

    /**
     *	Removes local file by full filename
     *	@param	    {String}	filename	filename with path
     *	@returns    {Promise}
     * @memberof    notStoreDriver
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
     * Standart testing routine, to test store driver configuration
     * @memberof    notStoreDriver
     * @returns     {Promise}
     */
    async test() {
        //some testing
    }

    report(err) {
        notNode.Application && notNode.Application.report(err);
    }
}

module.exports = notStoreDriver;
