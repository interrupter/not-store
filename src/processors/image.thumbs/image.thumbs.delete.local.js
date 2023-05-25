const notStoreProcessor = require("../../proto/processor");

class notStoreProcessorImageThumbsDeleteLocal extends notStoreProcessor {
    static getDescription() {
        return {
            id: "image.thumbs.delete.local",
            title: "Удаление локальных миниатюр",
            optionsUI: "UIStoreProcessorOptionsImageThumbsDeleteLocal",
        };
    }

    static listOfFilesToDelete(metadata, preprocOptions) {
        const variantsToDelete = { ...metadata.thumbs };
        if (preprocOptions.saveOriginal && variantsToDelete.original) {
            delete variantsToDelete.original;
        }
        return Object.values(variantsToDelete).map((variant) => variant.local);
    }

    static async run(filename, metadata, preprocOptions, driver) {
        const filenames = this.listOfFilesToDelete(metadata, preprocOptions);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeLocalFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteLocal;
