// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
const path = require("node:path");

class notStoreProcessorImageThumbsDeleteRemote extends notStoreProcessor {
    static getDescription() {
        return {
            id: "image.thumbs.delete.remote",
            title: "Удаление миниатюр из облака",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageThumbsDeleteRemote",
        };
    }

    static listOfFilesToDelete(fileInfo /*, preprocOptions*/) {
        const variantsToDelete = { ...fileInfo.thumbs };
        return Object.values(variantsToDelete).map((variant) => variant.cloud);
    }

    static async run(filename, fileInfo, options, driver) {
        const filenames = this.listOfFilesToDelete(fileInfo, options);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeLocalFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteRemote;
