// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");

class notStoreProcessorImageThumbsDeleteLocal extends notStoreProcessor {
    static getOptions() {
        return {
            saveOriginal: true,
        };
    }

    static getDescription() {
        return {
            id: "image.thumbs.delete.local",
            title: "Удаление локальных миниатюр",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageThumbsDeleteLocal",
        };
    }

    static listOfFilesToDelete(fileInfo /*, options*/) {
        const variantsToDelete = { ...fileInfo.thumbs };
        if (Object.hasOwn(variantsToDelete, "original")) {
            delete variantsToDelete.original;
        }
        return Object.values(variantsToDelete).map((variant) => variant.local);
    }

    static async run(filename, fileInfo, options, driver) {
        const filenames = this.listOfFilesToDelete(fileInfo, options);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteLocal;
