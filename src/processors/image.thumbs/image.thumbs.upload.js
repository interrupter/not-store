const notStoreProcessor = require("../../proto/processor");

class notStoreProcessorImageThumbsUpload extends notStoreProcessor {
    static getDescription() {
        return {
            id: "image.thumbs.upload",
            title: "Загрузка миниатюр в хранилище",
            optionsUI: "UIStoreProcessorOptionsImageThumbsUpload",
            metadataUI: "UIStoreProcessorMetadataImageThumbsUpload",
        };
    }

    static updateMetadata(metadata, cloudNames) {
        let variantsShortNames = Object.keys(metadata.thumbs);
        for (let t = 0; t < cloudNames.length; t++) {
            metadata.thumbs[variantsShortNames[t]].cloud = cloudNames[t];
        }
    }

    static async run(filename, metadata, preprocOptions, driver) {
        const filenames = Object.keys(metadata.thumbs).map(
            (thumb) => thumb.filename
        );
        if (filenames.length) {
            let cloudNames = await driver.directUploadMany(
                filenames,
                driver.getPathInStore(filenames[0])
            );
            this.updateMetadata(metadata, cloudNames);
        }
    }
}

module.exports = notStoreProcessorImageThumbsUpload;
