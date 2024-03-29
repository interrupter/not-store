/**
 * @typedef {object} StoreProcessorDescription
 * @property {string}   id
 * @property {string}   title
 * @property {string}   [optionsUI]
 * @property {string}   [metadataUI]
 * @property {object}   [optionsDefault]
 *
 * @class notStoreProcessor
 */
class notStoreProcessor {
    /**
     *
     *
     * @static
     * @return {StoreProcessorDescription}
     * @memberof notStoreProcessor
     */
    static getDescription() {
        return {
            id: "some_id",
            title: "human-readable",
            optionsUI: "name of ui component to edit processor options",
            metadataUI:
                "name of ui component to view metadata fields generated by processor",
            optionsDefault: {},
        };
    }

    /**
     *
     *
     * @static
     * @return {*}
     * @memberof notStoreProcessor
     */
    static getOptions() {
        return {};
    }

    /**
     * Standart interface for processors
     * @param {string} filename     file identificator in FS
     * @param {object} metadata     container for all the specific data about file and processing artifacts
     * @param {object} options      options for processor
     * @param {object} driver       instance of notStoreDriver children
     * @returns {Promise<>}
     */
    // eslint-disable-next-line no-unused-vars
    static async run(filename, metadata, options, driver) {}
}

module.exports = notStoreProcessor;
