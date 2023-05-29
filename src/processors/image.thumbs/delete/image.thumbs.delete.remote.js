const notStoreProcessor = require("../../../proto/processor");
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

    static listOfFilesToDelete(metadata /*, preprocOptions*/) {
        const variantsToDelete = { ...metadata.thumbs };

        return Object.values(variantsToDelete).map((variant) =>
            path.join(variant.filename)
        );
    }

    static async run(filename, metadata, options, driver) {
        const filenames = this.listOfFilesToDelete(metadata, options);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeLocalFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteRemote;