const notStoreProcessor = require("../../../proto/processor");

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

    static listOfFilesToDelete(metadata /*, options*/) {
        const variantsToDelete = { ...metadata.thumbs };
        if (Object.hasOwn(variantsToDelete, "original")) {
            delete variantsToDelete.original;
        }
        return Object.values(variantsToDelete).map((variant) => variant.local);
    }

    static async run(filename, metadata, options, driver) {
        const filenames = this.listOfFilesToDelete(metadata, options);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeLocalFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteLocal;
