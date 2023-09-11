// @ts-check
const { debug } = require("not-log")(module, "Store");
const sharp = require("sharp");
const notStoreProcessor = require("../proto/processor.cjs");
const METADATA_FORBIDDEN_FIELDS = ["exif", "xmp", "icc", "iptc"];

class notStoreProcessorImageExtractMetadata extends notStoreProcessor {
    static get METADATA_FORBIDDEN_FIELDS() {
        return METADATA_FORBIDDEN_FIELDS;
    }

    static clearMetadata(metadata) {
        this.METADATA_FORBIDDEN_FIELDS.forEach((fieldName) => {
            if (Object.hasOwn(metadata, fieldName)) {
                delete metadata[fieldName];
            }
        });
    }

    static getDescription() {
        return {
            id: "image.metadata.extract",
            title: "Получение метаданных изображения",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageMetadataExtract",
            metadataUI: "UIStoreProcessorMetadataImageMetadataExtract",
        };
    }

    static async run(
        filename, //current target file
        fileInfo //file metadata object
        //        preprocOptions, //preprocessor options for this store
        //        driver //driver instance
    ) {
        debug("extract metadata", filename);
        return new Promise((resolve, reject) => {
            sharp(filename).metadata((err, sharpMetadata) => {
                debug(sharpMetadata);
                if (err) {
                    reject(err);
                } else {
                    this.clearMetadata(sharpMetadata);
                    Object.assign(fileInfo, { metadata: { ...sharpMetadata } });
                    resolve(fileInfo);
                }
            });
        });
    }
}

module.exports = notStoreProcessorImageExtractMetadata;
