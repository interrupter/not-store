// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
const { OPT_INFO_CHILDREN } = require("../../../const.cjs");
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
            //optionsUI: "UIStoreProcessorOptionsImageThumbsUpload",
            //metadataUI: "UIStoreProcessorMetadataImageThumbsUpload",
        };
    }

    /**
     * adds cloud locations of file into info[OPT_INFO_CHILDREN][_thumb_name_].cloud
     *
     * @static
     * @param {object} fileInfo
     * @param {object} cloudNames
     * @memberof notStoreProcessorImageThumbsUpload
     */
    static updateFileInfo(fileInfo, cloudNames) {
        Object.values(fileInfo[OPT_INFO_CHILDREN]).forEach((thumb) => {
            thumb.cloud = cloudNames[thumb.local];
        });
    }

    /**
     *
     *
     * @static
     * @param {object} file
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @memberof notStoreProcessorImageThumbsUpload
     */
    static async run(file, options, driver) {
        const filenames = Object.values(file.info[OPT_INFO_CHILDREN]).map(
            (thumb) => thumb.local
        );
        if (filenames.length) {
            const cloudNames = await driver.directUploadManyTransformed(
                filenames
            );
            this.updateFileInfo(file.info, cloudNames);
        }
    }
}

module.exports = notStoreProcessorImageThumbsUpload;
