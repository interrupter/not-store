const notStoreProcessor = require("not-store/src/proto/processor.cjs");

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

    static updateMetadata(metadata, cloudNames) {
        let variantsShortNames = Object.keys(metadata.thumbs);
        for (let t = 0; t < cloudNames.length; t++) {
            metadata.thumbs[variantsShortNames[t]].cloud = cloudNames[t];
        }
    }

    static async run(filename, metadata, options, driver) {
        const filenames = Object.values(metadata.thumbs).map(
            (thumb) => thumb.local
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
