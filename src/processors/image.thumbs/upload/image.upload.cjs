const notStoreProcessor = require("not-store/src/proto/processor.cjs");

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

    static updateFileInfo(fileInfo, cloudNames) {
        let variantsShortNames = Object.keys(fileInfo.thumbs);
        for (let t = 0; t < cloudNames.length; t++) {
            fileInfo.thumbs[variantsShortNames[t]].cloud = cloudNames[t];
        }
    }

    static async run(filename, fileInfo, options, driver) {        
        if (filenames.length) {
            let cloudNames = await driver.directUploadMany(
                filenames,
                driver.getPathInStore(filenames[0])
            );
            this.updateFileInfo(fileInfo, cloudNames);
        }
    }
}

module.exports = notStoreProcessorImageThumbsUpload;
