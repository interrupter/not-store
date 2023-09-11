// @ts-check

const notStoreProcessor = require("../proto/processor.cjs");

class notStoreProcessorTest extends notStoreProcessor {
    static getDescription() {
        return {
            id: "test",
        };
    }

    static getOptions() {
        return {
            processed: false,
        };
    }

    static async run(
        filename, //current target file
        fileInfo, //file metadata object
        preprocOptions, //preprocessor options for this store
        driver //driver instance
    ) {
        fileInfo.filename = filename;
        fileInfo.options = preprocOptions;
        fileInfo.driver = driver;
    }
}

module.exports = notStoreProcessorTest;
