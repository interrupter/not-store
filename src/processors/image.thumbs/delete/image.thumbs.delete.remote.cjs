// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");

/**
 *
 *
 * @class notStoreProcessorImageThumbsDeleteRemote
 * @extends {notStoreProcessor}
 */
class notStoreProcessorImageThumbsDeleteRemote extends notStoreProcessor {
    /**
     * Information about processor
     *
     * @static
     * @return {import('../../../proto/processor.cjs').StoreProcessorDescription}
     * @memberof notStoreProcessorImageThumbsDeleteRemote
     */
    static getDescription() {
        return {
            id: "image.thumbs.delete.remote",
            title: "Удаление миниатюр из облака",
            optionsDefault: this.getOptions(),
            //optionsUI: "UIStoreProcessorOptionsImageThumbsDeleteRemote",
        };
    }

    /**
     * returns list of Keys from info.thumbs.*.cloud = {Key, key, Location, ETag, Bucket}
     *
     * @static
     * @param {object} fileInfo
     * @param {object} [preprocOptions]
     * @return {Array<string>}
     * @memberof notStoreProcessorImageThumbsDeleteRemote
     */
    //eslint-disable-next-line   no-unused-vars
    static listOfFilesToDelete(fileInfo, preprocOptions = {}) {
        if (!fileInfo.thumbs) return [];
        const variantsToDelete = { ...fileInfo.thumbs };
        return Object.values(variantsToDelete).map(
            (variant) => variant.cloud.Key
        );
    }

    /**
     *
     *
     * @static
     * @param {object} fileInfo
     * @param {object} [preprocOptions={}]
     * @memberof notStoreProcessorImageThumbsDeleteRemote
     */
    //eslint-disable-next-line   no-unused-vars
    static updateInfoAfterDelete(fileInfo, preprocOptions = {}) {
        /*Object.keys(fileInfo[]).forEach((key) => {
            delete fileInfo[][key].cloud;
        });*/
    }

    /**
     *
     *
     * @static     
     * @param {object} file
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @memberof notStoreProcessorImageThumbsDeleteRemote
     */
    static async run(file, options, driver) {
        if(file.parent){
            return;
        }
        /*
        const filenames = this.listOfFilesToDelete(file.info, options);
        if (filenames.length) {
            await driver.directDeleteMany(filenames, false);
            this.updateInfoAfterDelete(file.info, options);
        }
        */
    }
}

module.exports = notStoreProcessorImageThumbsDeleteRemote;
