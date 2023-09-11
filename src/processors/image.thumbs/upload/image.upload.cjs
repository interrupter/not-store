// @ts-check
const notStoreProcessor = require("../../../../src/proto/processor.cjs");

class notStoreProcessorImageUpload extends notStoreProcessor {
    static getDescription() {
        return {
            id: "image.upload",
            title: "Загрузка в хранилище",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageUpload",
            metadataUI: "UIStoreProcessorMetadataImageUpload",
        };
    }

    static updateFileInfo(fileInfo, cloudName) {
        fileInfo.cloud = cloudName;
    }

    static async run(filename, fileInfo, options, driver) {
        if (filename.length) {
            let cloudName = await driver.directUpload(
                filename,
                driver.getPathInStore(filename)
            );
            this.updateFileInfo(fileInfo, cloudName);
        }
    }
}

module.exports = notStoreProcessorImageUpload;
