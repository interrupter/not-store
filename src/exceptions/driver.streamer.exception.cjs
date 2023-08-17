const notError = require("not-error/src/error.node.cjs");

class notStoreDriverStreamerExceptionNotStreamableSource extends notError {
    constructor() {
        super("notStoreDriverStreamerExceptionNotStreamableSource", {});
        this.message = "source is not streamable";
    }
}
module.exports.notStoreDriverStreamerExceptionNotStreamableSource =
    notStoreDriverStreamerExceptionNotStreamableSource;

class notStoreDriverStreamerExceptionReadableStream extends notError {
    constructor(e) {
        super("notStoreDriverStreamerExceptionReadableStream", {}, e);
        this.message = "readable stream error";
    }
}
module.exports.notStoreDriverStreamerExceptionReadableStream =
    notStoreDriverStreamerExceptionReadableStream;
