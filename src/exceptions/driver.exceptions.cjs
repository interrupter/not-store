const notError = require("not-error/src/error.node.cjs");

class notStoreExceptionFilenameIsTooShortToGeneratePrefix extends notError {
    constructor(filename, prefix_length, e) {
        super(
            "notStoreExceptionFilenameIsTooShortToGeneratePrefix",
            { filename, prefix_length },
            e
        );
        this.message = "Filename is too short to generate prefix";
    }
}
module.exports.notStoreExceptionFilenameIsTooShortToGeneratePrefix =
    notStoreExceptionFilenameIsTooShortToGeneratePrefix;

class notStoreExceptionFilenameIsTooShortToGeneratePrefixedFilename extends notError {
    constructor(filename, prefix_length, e) {
        super(
            "notStoreExceptionFilenameIsTooShortToGeneratePrefixedFilename",
            { filename, prefix_length },
            e
        );
        this.message = "Filename is too short to generate prefixed file name";
    }
}
module.exports.notStoreExceptionFilenameIsTooShortToGeneratePrefixedFilename =
    notStoreExceptionFilenameIsTooShortToGeneratePrefixedFilename;

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
    constructor(filename, e) {
        super(
            "notStoreExceptionDeleteFromStoreError",
            {
                filename,
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
