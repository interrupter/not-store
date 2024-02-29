// @ts-check
const notStoreProcessor = require("../../../proto/processor.cjs");
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
            metadataUI: "UIStoreProcessorMetadataImageUpload",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageUpload",
            title: "Загрузка в хранилище",
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
        fileInfo.path = cloudName.Key;
    }

    /**
     *
     *
     * @static
     * @param {object} file
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @returns {Promise<undefined>}
     * @memberof notStoreProcessorImageUpload
     */
    static async run(file, options, driver) {
        if (file?.path && file.path.length) {
            const cloudName = await driver.directUpload(
                file.path,
                path.basename(file.path)
            );
            this.updateFileInfo(file.info, cloudName);
        }
    }
}

module.exports = notStoreProcessorImageUpload;
