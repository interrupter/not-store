class notStoreProcessor {
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
    static async run() {}
}

module.exports = notStoreProcessor;
