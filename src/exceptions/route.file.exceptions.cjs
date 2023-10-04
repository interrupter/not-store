const notError = require("not-error/src/error.node.cjs");

class notStoreFileRouteExceptionFileDeleteError extends notError {
    constructor(prepared, e) {
        super("notStoreRouteFileExceptionFileDeleteError", prepared, e);
    }
}
module.exports.notStoreRouteFileExceptionFileDeleteError =
    notStoreFileRouteExceptionFileDeleteError;
