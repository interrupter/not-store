const notError = require("not-error/src/error.node.cjs");

class notStoreExceptionFilenameToReadableStreamError extends notError {
    constructor(source, e) {
        super(
            "notStoreExceptionFilenameToReadableStreamError",
            {
                source,
            },
            e
        );
    }
}
module.exports.notStoreExceptionFilenameToReadableStreamError =
    notStoreExceptionFilenameToReadableStreamError;


class notStoreExceptionProccesorRunError extends notError {
    constructor(pipe, filename, driverName, e) {
        super(
            "notStoreExceptionProccesorRunError",
            {
                pipe,
                filename,
                driverName,
            },
            e
        );
    }
}
module.exports.notStoreExceptionProccesorRunError =
    notStoreExceptionProccesorRunError;

class notStoreExceptionProcessingPipeItemWrongOptionsFormat extends notError {
    constructor(processor) {
        super("notStoreExceptionProcessingPipeItemWrongOptionsFormat", {
            processor,
        });
    }
}
module.exports.notStoreExceptionProcessingPipeItemWrongOptionsFormat =
    notStoreExceptionProcessingPipeItemWrongOptionsFormat;

class notStoreExceptionProcessingPipeItemWrongNameFormat extends notError {
    constructor(processor) {
        super("notStoreExceptionProcessingPipeItemWrongNameFormat", {
            processor,
        });
    }
}
module.exports.notStoreExceptionProcessingPipeItemWrongNameFormat =
    notStoreExceptionProcessingPipeItemWrongNameFormat;

class notStoreExceptionProcessingPipeItemWrongFormat extends notError {
    constructor(processor) {
        super("notStoreExceptionProcessingPipeItemWrongFormat", {
            processor,
        });
    }
}
module.exports.notStoreExceptionProcessingPipeItemWrongFormat =
    notStoreExceptionProcessingPipeItemWrongFormat;


class notStoreExceptionPreproccesorOptionsWrongFormat extends notError {
    constructor(options) {
        super(
            "notStoreExceptionPreproccesorOptionsWrongFormat",
            {
                options,
            },
            null
        );
    }
}
module.exports.notStoreExceptionPreproccesorOptionsWrongFormat =
    notStoreExceptionPreproccesorOptionsWrongFormat;

class notStoreExceptionStoreIsNotActive extends notError {
    constructor(name, driver) {
        super(
            "notStoreExceptionStoreIsNotActive",
            {
                name,
                driver,
            },
            null
        );
    }
}
module.exports.notStoreExceptionStoreIsNotActive =
    notStoreExceptionStoreIsNotActive;

class notStoreExceptionDriverAlreadyExists extends notError {
    constructor(driver) {
        super(
            "notStoreExceptionDriverAlreadyExists",
            {
                driver,
            },
            null
        );
    }
}
module.exports.notStoreExceptionDriverAlreadyExists =
    notStoreExceptionDriverAlreadyExists;

class notStoreExceptionProcessorIsNotExists extends notError {
    constructor(name) {
        super(
            "notStoreExceptionProcessorIsNotExists",
            {
                name,
            },
            null
        );
    }
}
module.exports.notStoreExceptionProcessorIsNotExists =
    notStoreExceptionProcessorIsNotExists;

class notStoreExceptionPreprocessorAlreadyExists extends notError {
    constructor(preprocessor) {
        super(
            "notStoreExceptionPreprocessorAlreadyExists",
            {
                preprocessor,
            },
            null
        );
    }
}
module.exports.notStoreExceptionPreprocessorAlreadyExists =
    notStoreExceptionPreprocessorAlreadyExists;

class notStoreExceptionDriverIsNotExists extends notError {
    constructor(driver) {
        super(
            "notStoreExceptionDriverIsNotExists",
            {
                driver,
            },
            null
        );
    }
}
module.exports.notStoreExceptionDriverIsNotExists =
    notStoreExceptionDriverIsNotExists;

class notStoreExceptionConfigIsNotExists extends notError {
    constructor(store, reader) {
        super(
            "notStoreExceptionConfigIsNotExists",
            {
                store,
                reader,
            },
            null
        );
    }
}
module.exports.notStoreExceptionConfigIsNotExists =
    notStoreExceptionConfigIsNotExists;

class notStoreExceptionConfigReaderError extends notError {
    constructor(store, reader, e) {
        super(
            "notStoreExceptionConfigReaderError",
            {
                store,
                reader,
            },
            e
        );
    }
}
module.exports.notStoreExceptionConfigReaderError =
    notStoreExceptionConfigReaderError;