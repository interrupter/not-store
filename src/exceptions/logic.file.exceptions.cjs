const notError = require("not-error/src/error.node.cjs");

class notStoreFileLogicExceptionDeleteDBError extends notError {
    constructor(params, e) {
        super("notStoreFileLogicExceptionFileDeleteDBError", params, e);
    }
}
module.exports.notStoreFileLogicExceptionDeleteDBError =
    notStoreFileLogicExceptionDeleteDBError;

class notStoreFileLogicExceptionDeleteUserSessionIsNotValid extends notError {
    constructor(prepared, e) {
        super(
            "notStoreFileLogicExceptionDeleteUserSessionIsNotValid",
            prepared,
            e
        );
    }
}
module.exports.notStoreFileLogicExceptionDeleteUserSessionIsNotValid =
    notStoreFileLogicExceptionDeleteUserSessionIsNotValid;
