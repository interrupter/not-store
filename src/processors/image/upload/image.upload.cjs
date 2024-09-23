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
        fileInfo.path = cloudName.Key;
    }

    /**
     *
     *
     * @static
     * @param {object} input
     * @param {string} input.path
     * @param {string} input.parent
     * @param {object} input.info
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @returns {Promise<undefined>}
     * @memberof notStoreProcessorImageUpload
     */
    static async run(input, options, driver) {
        if (input?.path && input.path.length) {
            const cloudName = await driver.directUpload(
                input.path,
                path.basename(input.path)
            );
            this.updateFileInfo(input.info, cloudName);
        }
        /*
        if (input.parent) {
        }
        */
    }
}

module.exports = notStoreProcessorImageUpload;
