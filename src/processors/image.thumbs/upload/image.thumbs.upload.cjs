// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
/**
 *
 *
 * @class notStoreProcessorImageThumbsUpload
 * @extends {notStoreProcessor}
 */
class notStoreProcessorImageThumbsUpload extends notStoreProcessor {
    /**
     *
     *
     * @static
     * @return {import('../../../proto/processor.cjs').StoreProcessorDescription}
     * @memberof notStoreProcessorImageThumbsUpload
     */
    static getDescription() {
        return {
            id: "image.thumbs.upload",
            title: "Загрузка миниатюр в хранилище",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageThumbsUpload",
            metadataUI: "UIStoreProcessorMetadataImageThumbsUpload",
        };
    }

    /**
     * adds cloud locations of file into info.thumbs[_thumb_name_].cloud
     *
     * @static
     * @param {object} fileInfo
     * @param {object} cloudNames
     * @memberof notStoreProcessorImageThumbsUpload
     */
    static updateFileInfo(fileInfo, cloudNames) {
        Object.values(fileInfo.thumbs).forEach((thumb) => {
            thumb.cloud = cloudNames[thumb.local];
        });
    }

    /**
     *
     *
     * @static
     * @param {string} filename
     * @param {object} fileInfo
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @memberof notStoreProcessorImageThumbsUpload
     */
    static async run(filename, fileInfo, options, driver) {
        const filenames = Object.values(fileInfo.thumbs).map(
            (thumb) => thumb.local
        );
        if (filenames.length) {
            const cloudNames = await driver.directUploadManyTransformed(
                filenames
            );
            this.updateFileInfo(fileInfo, cloudNames);
        }
    }
}

module.exports = notStoreProcessorImageThumbsUpload;
