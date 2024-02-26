// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
const {OPT_INFO_CHILDREN} = require('../../../const.cjs');

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
            //optionsUI: "UIStoreProcessorOptionsImageThumbsDeleteLocal",
        };
    }

    static listOfFilesToDelete(fileInfo /*, options*/) {
        const variantsToDelete ={ ...fileInfo[OPT_INFO_CHILDREN]};
        return Object.values(variantsToDelete).map((variant) => variant.local);
    }

    static async run(file, options, driver) {
        if(file.parent){
            return;
        }
        const filenames = this.listOfFilesToDelete(file.info);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteLocal;
