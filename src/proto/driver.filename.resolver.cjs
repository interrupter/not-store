const path = require("path");

const {
    FIRST_DIR_NAME_LENGTH,
    DEFAULT_FILENAME_SPLIT,
} = require("../const.cjs");

const {
    notStoreExceptionFilenameIsTooShortToGeneratePrefix,
} = require("../exceptions/driver.exceptions.cjs");

class notStoreDriverFilenameResolver {
    /**
     * Returns first few characters from from filename
     * @param {string} 		fname 	filename without path
     * @returns {string}
     */
    static prefixDir(fname) {
        const parsed = path.parse(fname);
        if (parsed.name.length < FIRST_DIR_NAME_LENGTH) {
            throw new notStoreExceptionFilenameIsTooShortToGeneratePrefix(
                parsed.name,
                FIRST_DIR_NAME_LENGTH
            );
        }
        return parsed.name.substring(0, FIRST_DIR_NAME_LENGTH);
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
     * @param {object}      options                storage system filenaming rules
     * @param {string}      options.path           additional path from storage root
     * @param {boolean}     options.groupFiles     if files shoould be grouped in subdirectories named as first few chars of their names
     * @returns {string}
     */
    static pathInStore(filename, options) {
        let pathInStore = "";
        //groouping files in folders named as first N chars of filename 1234567.ext -> 123/1234567.ext
        if (options.groupFiles) {
            let end = notStoreDriverFilenameResolver.prefixDir(filename);
            if (options.path) {
                pathInStore = path.join(options.path, end);
            } else {
                pathInStore = end;
            }
        } else {
            if (options.path) {
                pathInStore = options.path;
            }
        }
        return pathInStore;
    }

    /**
     *	Returns filaname for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	postfix	postfix that will be added at end of uuid after '_'
     *	@param		{string}	format	file format name will be added at the end after '.'
     *	@returns	{string}	filename
     */
    static filename(uuid, postfix, format) {
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
     *  @param {object}      options                storage system filenaming rules
     *  @param {string}      options.path           additional path from storage root
     *  @param {boolean}     options.groupFiles     if files shoould be grouped in subdirectories named as first few chars of their names
     *	@returns	{string}	full filename in bucket
     */
    static fullFilenameInStore(uuid, postfix, format, options) {
        return path.join(
            notStoreDriverFilenameResolver.pathInStore(uuid, options),
            notStoreDriverFilenameResolver.filename(uuid, postfix, format)
        );
    }

    /**
     * Returns filename for a specific processing options
     * @param {object} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} variant 	some file processing description
     * @returns {string}
     */
    static variantFilename(srcParts, variantShortName /*, variant*/) {
        return notStoreDriverFilenameResolver.filename(
            srcParts.name,
            variantShortName,
            srcParts.ext.replace(".", "")
        );
    }

    /**
     * Returns filename path for a specific processing options
     * @param {object} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} variant 	some file processing description
     * @returns {string}
     */
    static variantPath(srcParts, variantShortName, variant) {
        return path.join(
            srcParts.dir,
            notStoreDriverFilenameResolver.variantFilename(
                srcParts,
                variantShortName,
                variant
            )
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
    static variantsPaths(src, variants, format) {
        let srcParts = path.parse(src),
            result = {};
        if (format) {
            srcParts.ext = `.${format}`;
        }
        Object.keys(variants).forEach((variantShortName) => {
            result[variantShortName] = {
                variant: variants[variantShortName],
                local: notStoreDriverFilenameResolver.variantPath(
                    srcParts,
                    variantShortName,
                    variants[variantShortName]
                ),
                filename: notStoreDriverFilenameResolver.variantFilename(
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
    static variantsFilenames(name, variants, format, addOriginal = true) {
        let result = {};
        let srcParts = path.parse(name);
        const ext = `.${format}`;
        Object.keys(variants).forEach((variantShortName) => {
            result[variantShortName] =
                notStoreDriverFilenameResolver.variantFilename(
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
}

module.exports = notStoreDriverFilenameResolver;
