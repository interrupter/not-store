// @ts-check

const notStoreProcessor = require("../proto/processor.cjs");

class notStoreProcessorTest extends notStoreProcessor {
    static getDescription() {
        return {
            id: "test",
            title: "test",
            optionsDefault: {},
        };
    }

    static getOptions() {
        return {
            processed: false,
        };
    }

    static async run(
        file, //file object
        preprocOptions, //preprocessor options for this store
        driver //driver instance
    ) {
        file.info.options = preprocOptions;
        file.info.driver = driver;
    }
}

module.exports = notStoreProcessorTest;
