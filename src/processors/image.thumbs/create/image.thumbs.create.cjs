const path = require("node:path");
const notStoreProcessor = require("../../../proto/processor.cjs");
const sharp = require("sharp");
const DEFAULT_OPTIONS = require("./image.thumbs.create.options.cjs");

class notStoreProcessorImageThumbsCreate extends notStoreProcessor {
    static getOptions() {
        return JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
    }

    static getDescription() {
        return {
            id: "image.thumbs.create",
            title: "Создание миниатюр изображения",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageThumbsCreate",
            metadataUI: "UIStoreProcessorMetadataImageThumbsCreate",
        };
    }

    static makeThumb(src, dest, size, options) {
        let image = sharp(src, {
            failOnError: false,
        });
        return image.resize(size, size, options.resize || {}).toFile(dest);
    }

    static async makeThumbs(src, thumbs, options) {
        for (let size in thumbs) {
            await this.makeThumb(
                src,
                thumbs[size].local,
                parseInt(thumbs[size].variant),
                options
            );
        }
    }

    static async run(filename, fileInfo, options, driver) {
        const thumbs = driver.getVariantsPaths(
            filename,
            options.sizes,
            options.format
        );
        await this.makeThumbs(filename, thumbs, options);        
        fileInfo.thumbs = thumbs;
    }
}

module.exports = notStoreProcessorImageThumbsCreate;
