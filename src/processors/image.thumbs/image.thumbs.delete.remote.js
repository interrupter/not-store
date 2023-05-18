const notStoreProcessor = require("../../proto/processor");
const path = require("node:path");

class notStoreProcessorImageThumbsDeleteRemote extends notStoreProcessor {
    static listOfFilesToDelete(metadata /*, preprocOptions*/) {
        const variantsToDelete = { ...metadata.thumbs };

        return Object.values(variantsToDelete).map((variant) =>
            path.join(variant.filename)
        );
    }

    static async run(filename, metadata, preprocOptions, driver) {
        const filenames = this.listOfFilesToDelete(metadata, preprocOptions);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeLocalFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteRemote;
