const notError = require("not-error/src/error.node.cjs");

class notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix extends notError {
    constructor(filename, prefix_length, e) {
        super(
            "notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix",
            { filename, prefix_length },
            e
        );
        this.message = "Filename is too short to generate group prefix";
    }
}
module.exports.notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix =
    notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix;

class notStoreExceptionFilenameIsTooShortToGenerateGroupPrefixedFilename extends notError {
    constructor(filename, prefix_length, e) {
        super(
            "notStoreExceptionFilenameIsTooShortToGenerateGroupPrefixedFilename",
            { filename, prefix_length },
            e
        );
        this.message = "Filename is too short to generate prefixed file name";
    }
}
module.exports.notStoreExceptionFilenameIsTooShortToGenerateGroupPrefixedFilename =
    notStoreExceptionFilenameIsTooShortToGenerateGroupPrefixedFilename;

class notStoreExceptionDirectUploadError extends notError {
    constructor(details, e) {
        super("notStoreExceptionDirectUploadError", details, e);
    }
}
module.exports.notStoreExceptionDirectUploadError =
    notStoreExceptionDirectUploadError;

class notStoreExceptionUploadError extends notError {
    constructor(e) {
        super("notStoreExceptionUploadError", {}, e);
    }
}
module.exports.notStoreExceptionUploadError = notStoreExceptionUploadError;

class notStoreExceptionDeleteFromStoreError extends notError {
    constructor(uuid, e) {
        super(
            "notStoreExceptionDeleteFromStoreError",
            {
                uuid,
            },
            e
        );
    }
}
module.exports.notStoreExceptionDeleteFromStoreError =
    notStoreExceptionDeleteFromStoreError;

class notStoreExceptionDirectDeleteError extends notError {
    constructor(details, e) {
        super("notStoreExceptionDirectDeleteError", details, e);
    }
}
module.exports.notStoreExceptionDirectDeleteError =
    notStoreExceptionDirectDeleteError;

class notStoreExceptionListStoreError extends notError {
    /**
     * Creates an instance of notStoreExceptionListStoreError.
     * @param {string}  pathInStore
     * @param {Error}   e
     * @memberof notStoreExceptionListStoreError
     */
    constructor(pathInStore, e) {
        super(
            "notStoreExceptionListStoreError",
            {
                pathInStore,
            },
            e
        );
    }
}
module.exports.notStoreExceptionListStoreError =
    notStoreExceptionListStoreError;

class notStoreExceptionDirectListError extends notError {
    /**
     * Creates an instance of notStoreExceptionDirectListError.
     * @param {string}  pathInStore
     * @param {Error}   e
     * @memberof notStoreExceptionDirectListError
     */
    constructor(details, e) {
        super("notStoreExceptionDirectListError", details, e);
    }
}
module.exports.notStoreExceptionDirectListError =
    notStoreExceptionDirectListError;

class notStoreDriverExceptionRemoveFile extends notError {
    constructor(filename, e) {
        super(
            "notStoreDriverExceptionRemoveFile",
            {
                filename,
            },
            e
        );
    }
}
module.exports.notStoreDriverExceptionRemoveFile =
    notStoreDriverExceptionRemoveFile;
