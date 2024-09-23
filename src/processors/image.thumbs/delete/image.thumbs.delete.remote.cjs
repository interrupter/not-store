// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
const { OPT_INFO_CHILDREN } = require("../../../const.cjs");
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
        if (!fileInfo[OPT_INFO_CHILDREN]) return [];
        const variantsToDelete = { ...fileInfo[OPT_INFO_CHILDREN] };
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
        Object.keys(fileInfo[OPT_INFO_CHILDREN]).forEach((key) => {
            delete fileInfo[OPT_INFO_CHILDREN][key].cloud;
        });
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
        if (file.parent) {
            return;
        }
        const filenames = this.listOfFilesToDelete(file.info, options);
        if (filenames.length) {
            await driver.directDeleteMany(
                Object.values(file.info[OPT_INFO_CHILDREN]),
                false
            );
            this.updateInfoAfterDelete(file.info, options);
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteRemote;
