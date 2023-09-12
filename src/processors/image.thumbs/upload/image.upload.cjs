// @ts-check
const notStoreProcessor = require("../../../../src/proto/processor.cjs");
const path = require("node:path");
/**
 *
 *
 * @class notStoreProcessorImageUpload
 * @extends {notStoreProcessor}
 */
class notStoreProcessorImageUpload extends notStoreProcessor {
    /**
     *
     *
     * @static
     * @return {import('../../../proto/processor.cjs').StoreProcessorDescription}
     * @memberof notStoreProcessorImageUpload
     */
    static getDescription() {
        return {
            id: "image.upload",
            title: "Загрузка в хранилище",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageUpload",
            metadataUI: "UIStoreProcessorMetadataImageUpload",
        };
    }

    /**
     *
     *
     * @static
     * @param {object} fileInfo
     * @param {object} cloudName    result of S2 object upload operation
     * @memberof notStoreProcessorImageUpload
     */
    static updateFileInfo(fileInfo, cloudName) {
        fileInfo.cloud = cloudName;
    }

    /**
     *
     *
     * @static
     * @param {string} filename
     * @param {object} fileInfo
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @returns {Promise<undefined>}
     * @memberof notStoreProcessorImageUpload
     */
    static async run(filename, fileInfo, options, driver) {
        if (filename && filename.length) {
            const cloudName = await driver.directUpload(
                filename,
                path.basename(filename)
            );
            this.updateFileInfo(fileInfo, cloudName);
        }
    }
}

module.exports = notStoreProcessorImageUpload;
