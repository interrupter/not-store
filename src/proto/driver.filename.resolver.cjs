// @ts-check
const path = require("path");

const {
    FIRST_DIR_NAME_LENGTH,
    DEFAULT_FILENAME_SPLIT,
} = require("../const.cjs");

const {
    notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix,
} = require("../exceptions/driver.exceptions.cjs");

class notStoreDriverFilenameResolver {
    /**
     * Returns first few characters from from filename
     * @param {string} 		fname 	filename without path
     * @returns {string}
     */
    static composeGroupDir(fname) {
        const parsed = path.parse(fname);
        if (parsed.name.length < FIRST_DIR_NAME_LENGTH) {
            throw new notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix(
                parsed.name,
                FIRST_DIR_NAME_LENGTH
            );
        }
        return parsed.name.substring(0, FIRST_DIR_NAME_LENGTH);
    }

    /**
     * /path/in/medium/to/store/ <-- store root, all *InStore function starts from there,
     * if InStore suffix is absent then starting here
     * / <-- at medium root, without store.path option
     * **
     * /path/in/medium/to/store/grouping/ <-- group root, all files named "grouping.*" goes there,
     * if groupFiles options is true, where "grouping" is first few chars from start of filename
     * **
     * resolve* - to glue parts of paths and filenames
     * compose* - to create parts of paths and filenames
     * *
     **/

    /**
     *
     *
     * @static
     * @param {string}      dirname
     * @param {object}      [options = {}]                storage system filenaming rules
     * @param {string}      [options.path ]          additional path from storage root
     * @memberof notStoreDriverFilenameResolver
     */
    static resolvePath(dirname, options = {}) {
        if (options?.path) {
            return path.join(options.path, dirname);
        } else {
            return dirname;
        }
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
    static composePathToFile(filename, options) {
        let pathInStore = "";
        //groouping files in folders named as first N chars of filename 1234567.ext -> 123/1234567.ext
        if (options.groupFiles) {
            let end = notStoreDriverFilenameResolver.composeGroupDir(filename);
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
    static composeFilename(uuid, postfix, format) {
        return (
            uuid +
            (postfix ? DEFAULT_FILENAME_SPLIT + postfix : "") +
            (format ? "." + format : "")
        );
    }

    /**
     *	Returns filaname from root of the bucket for object by uuid, postfix and format
     *	@param		{string}	uuid		unique id of object
     *	@param		{string}	[postfix='']	postfix that will be added at end of uuid after '_'
     *	@param		{string}	[format='']	file format name will be added at the end after '.'
     *  @param {object}      [options]                storage system filenaming rules
     *  @param {string}      [options].path           additional path from storage root
     *  @param {boolean}     [options].groupFiles     if files shoould be grouped in subdirectories named as first few chars of their names
     *	@returns	{string}	full filename in bucket
     */
    static composeFullFilename(
        uuid,
        postfix = undefined,
        format = undefined,
        options = { path: "", groupFiles: false }
    ) {
        return path.join(
            notStoreDriverFilenameResolver.composePathToFile(uuid, options),
            notStoreDriverFilenameResolver.composeFilename(
                uuid,
                postfix,
                format
            )
        );
    }

    /**
     * Returns filename for a specific processing options
     * @param {import('path').ParsedPath} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} [variant] 	some file processing description
     * @returns {string}
     */
    static composeVariantFilename(
        srcParts,
        variantShortName,
        variant = undefined
    ) {
        return notStoreDriverFilenameResolver.composeFilename(
            srcParts.name,
            variantShortName,
            srcParts.ext.replace(".", "")
        );
    }

    /**
     * Returns filename path for a specific processing options
     * @param {import('path').ParsedPath} 		srcParts  			path.parse result object
     * @param {string} 		variantShortName 	name of variant
     * @param {string|number|object} [variant] 	some file processing description
     * @returns {string}
     */
    static composeVariantPath(srcParts, variantShortName, variant) {
        return path.join(
            srcParts.dir,
            notStoreDriverFilenameResolver.composeVariantFilename(
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
    static composeVariantsPaths(src, variants, format = undefined) {
        let srcParts = path.parse(src),
            result = {};
        if (format) {
            srcParts.ext = `.${format}`;
        }
        Object.keys(variants).forEach((variantShortName) => {
            result[variantShortName] = {
                variant: variants[variantShortName],
                local: notStoreDriverFilenameResolver.composeVariantPath(
                    srcParts,
                    variantShortName,
                    variants[variantShortName]
                ),
                filename: notStoreDriverFilenameResolver.composeVariantFilename(
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
     * @param {boolean} [addOriginal=true] 	add original file variant to result object
     * @returns
     */
    static composeVariantsFilenames(
        name,
        variants,
        format,
        addOriginal = true
    ) {
        let result = {};
        let srcParts = path.parse(name);
        const ext = `.${format}`;
        Object.keys(variants).forEach((variantShortName) => {
            result[variantShortName] =
                notStoreDriverFilenameResolver.composeVariantFilename(
                    {
                        ...srcParts,
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
