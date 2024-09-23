// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
const { OPT_INFO_CHILDREN } = require("../../../const.cjs");

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
        if (!Object.hasOwn(fileInfo, OPT_INFO_CHILDREN)) {
            return [];
        }
        const variantsToDelete = { ...fileInfo[OPT_INFO_CHILDREN] };
        const excludeOriginal =
            notStoreProcessorImageThumbsDeleteLocal.getOptions().saveOriginal;
        let list = Object.keys(variantsToDelete);
        if (excludeOriginal) {
            list = list.filter((itm) => itm !== "original");
        }
        return list.map((variantName) => variantsToDelete[variantName].local);
    }

    static async run(file, options, driver) {
        if (file.parent) {
            return;
        }
        const filenames = this.listOfFilesToDelete(file.info);
        if (filenames.length) {
            await Promise.all(filenames.map(driver.removeFile));
        }
    }
}

module.exports = notStoreProcessorImageThumbsDeleteLocal;
