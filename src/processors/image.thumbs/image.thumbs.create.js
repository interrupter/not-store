const notStoreProcessor = require("../../proto/processor");
const sharp = require("sharp");

class notStoreProcessorImageThumbsCreate extends notStoreProcessor {
    static getDescription() {
        return {
            id: "image.thumbs.create",
            title: "Создание миниатюр изображения",
            optionsUI: "UIStoreProcessorOptionsImageThumbsCreate",
            metadataUI: "UIStoreProcessorMetadataImageThumbsCreate",
        };
    }

    static makeThumb(src, dest, size) {
        let image = sharp(src, {
            failOnError: false,
        });
        return image
            .resize(size, size, this.options.sharp.resize || {})
            .toFile(dest);
    }

    static async makeThumbs(src, thumbs) {
        for (let size in thumbs) {
            await this.makeThumb(
                src,
                thumbs[size].local,
                parseInt(thumbs[size].variant)
            );
        }
    }

    static async run(filename, metadata, preprocOptions, driver) {
        const thumbs = driver.getVariantsPaths(
            filename,
            preprocOptions.sizes,
            preprocOptions.format
        );
        await this.makeThumbs(filename, thumbs);
        if (preprocOptions.saveOriginal) {
            thumbs.original = {
                file: filename,
            };
        }
        metadata.thumbs = thumbs;
    }
}

module.exports = notStoreProcessorImageThumbsCreate;
