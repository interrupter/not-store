// @ts-check
const notStoreProcessor = require("../../../proto/processor.cjs");
const getApp = require('not-node/src/getApp');
const DEFAULT_OPTIONS = require("./image.parent.preview.options.cjs");

/**
 * После загрузки изображения, если это вторичное изображение, 
 * и variant === установленному в настройках для процессора,
 * то этот файл считается "превью" для первичного файла и для него
 *  устанавливается ссылка на превью из cloud.Location
 * 
 * @class notStoreProcessorImageParentPreview
 * @extends {notStoreProcessor}
 */
class notStoreProcessorImageParentPreview extends notStoreProcessor {
    
    static getOptions() {
        return JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
    }

    static getDescription() {
        return {
            id: "image.parent.preview",
            title: "Установка превью для основного файла",
            optionsDefault: this.getOptions(), 
            optionsUI: "UIStoreProcessorOptionsImageUploadParentPreview",  
        };
    }

    /**
     *
     *
     * @static
     * @param {object} file
     * @param {object} options
     * @param {import('../../../drivers/timeweb/timeweb.driver.cjs')} driver
     * @returns {Promise<undefined>}
     * @memberof notStoreProcessorImageUpload
     */
    static async run(file, options, driver) {
        if(file.parent && (options.all || file.variant === options.variant)){
            await getApp().getModel('File').setVariantURL(file.parent, file.variant, file.cloud.Location);
        }
    }
}

module.exports = notStoreProcessorImageParentPreview;
