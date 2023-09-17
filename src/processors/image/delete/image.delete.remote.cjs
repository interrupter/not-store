// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");

/**
 *
 *
 * @class notStoreProcessorImageDeleteRemote
 * @extends {notStoreProcessor}
 */
class notStoreProcessorImageDeleteRemote extends notStoreProcessor {
    /**
     * Information about processor
     *
     * @static
     * @return {import('../../../proto/processor.cjs').StoreProcessorDescription}
     * @memberof notStoreProcessorImageDeleteRemote
     */
    static getDescription() {
        return {
            id: "image.delete.remote",
            title: "Удаление изображения из облака",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageDeleteRemote",
        };
    }

    /**
     * returns Key from info.cloud = {Key, key, Location, ETag, Bucket}
     *
     * @static
     * @param {object} fileInfo
     * @param {object} [preprocOptions]
     * @return {string|false}
     * @memberof notStoreProcessorImageDeleteRemote
     */
    //eslint-disable-next-line   no-unused-vars
    static filenameToDelete(fileInfo, preprocOptions = {}) {
        if (!fileInfo.cloud || !fileInfo.cloud.Key) return false;
        return fileInfo.cloud.Key;
    }

    /**
     *
     *
     * @static
     * @param {object} fileInfo
     * @param {object} [preprocOptions={}]
     * @memberof notStoreProcessorImageDeleteRemote
     */
    //eslint-disable-next-line   no-unused-vars
    static updateInfoAfterDelete(fileInfo, preprocOptions = {}) {
        delete fileInfo.cloud;
    }

    /**
     *
     *
     * @static
     * @param {string} filename
     * @param {object} fileInfo
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @memberof notStoreProcessorImageDeleteRemote
     */
    static async run(filename, fileInfo, options, driver) {
        const cloudFilename = this.filenameToDelete(fileInfo, options);
        if (cloudFilename && filename.length) {
            await driver.directDelete(cloudFilename, false);
            this.updateInfoAfterDelete(fileInfo, options);
        }
    }
}

module.exports = notStoreProcessorImageDeleteRemote;
