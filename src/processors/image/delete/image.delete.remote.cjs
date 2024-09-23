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
     * @param {object} cloud
     * @param {object} [preprocOptions]
     * @return {string|false}
     * @memberof notStoreProcessorImageDeleteRemote
     */
    //eslint-disable-next-line   no-unused-vars
    static filenameToDelete(cloud, preprocOptions = {}) {
        if (!cloud || !cloud.Key) return false;
        return cloud.Key;
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
     * @param {object} file
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @memberof notStoreProcessorImageDeleteRemote
     */
    static async run(file, options, driver) {
        const cloudFilename = this.filenameToDelete(file.cloud, options);
        if (cloudFilename) {
            await driver.directDelete(file, false);
            this.updateInfoAfterDelete(file, options);
        }
    }
}

module.exports = notStoreProcessorImageDeleteRemote;
