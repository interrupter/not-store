// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");

class notStoreProcessorImageThumbsUpload extends notStoreProcessor {
    static getDescription() {
        return {
            id: "image.thumbs.upload",
            title: "Загрузка миниатюр в хранилище",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageThumbsUpload",
            metadataUI: "UIStoreProcessorMetadataImageThumbsUpload",
        };
    }

    static updateFileInfo(fileInfo, cloudNames) {
        let variantsShortNames = Object.keys(fileInfo.thumbs);
        for (let t = 0; t < cloudNames.length; t++) {
            fileInfo.thumbs[variantsShortNames[t]].cloud = cloudNames[t];
        }
    }

    static async run(filename, fileInfo, options, driver) {
        const filenames = Object.values(fileInfo.thumbs).map(
            (thumb) => thumb.local
        );
        if (filenames.length) {
            let cloudNames = await driver.directUploadMany(
                filenames,
                driver.resolvePath(filenames[0])
            );
            this.updateFileInfo(fileInfo, cloudNames);
        }
    }
}

module.exports = notStoreProcessorImageThumbsUpload;
