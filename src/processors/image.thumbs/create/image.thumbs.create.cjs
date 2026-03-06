// @ts-check

const notStoreProcessor = require("../../../proto/processor.cjs");
const sharp = require("sharp");
const DEFAULT_OPTIONS = require("./image.thumbs.create.options.cjs");
const { OPT_INFO_CHILDREN, OPT_INFO_PREVIEW } = require("../../../const.cjs");

const notCommon = require("not-node/src/common");

class notStoreProcessorImageThumbsCreate extends notStoreProcessor {
    static getOptions() {
        return JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
    }

    static getDescription() {
        return {
            id: "image.thumbs.create",
            title: "Создание миниатюр изображения",
            optionsDefault: this.getOptions(),
            optionsUI: "UIStoreProcessorOptionsImageThumbsCreate",
            //metadataUI: "UIStoreProcessorMetadataImageThumbsCreate",
        };
    }

    static makeThumb(src, dest, size, options = {}) {
        let image = sharp(src, {
            failOnError: false,
        });
        //console.log(src, resolve(dest), size);
         image
            .resize(size, size, (options && options?.resize) || {});
        if(options && options.format){
            image.toFormat(options.format);
        }
        return image.toFile(dest); //.catch((e)=>{ console.error(dest,e);});
    }

    static async makeThumbs(src, thumbs, options) {
        const result = {};
        for (let size in thumbs) {
            result[size] = await this.makeThumb(
                src,
                thumbs[size].local,
                parseInt(thumbs[size].variant),
                options
            );
            //let stat = await fs.promises.lstat(resolve(thumbs[size].local));
            //console.log(size, stat);
        }
        return result;
    }

    static async run(file, options, driver) {
        if (file.parent) {
            return;
        }
        const format = options.format || file?.format;
        const thumbs = driver.composeVariantsPaths(
            file.path,
            options.sizes,
            format,
            {
                groupFiles: driver.getOptionValueCheckENV("groupFiles"),
                path: driver.getOptionValueCheckENV("path"),
            }            
        );
        if (options.preview && notCommon.objHas(thumbs, options.preview)) {
            thumbs[options.preview][OPT_INFO_PREVIEW] = true;
        }
        await this.makeThumbs(file.path, thumbs, {...options, format});
        file.info[OPT_INFO_CHILDREN] = thumbs;
    }
}

module.exports = notStoreProcessorImageThumbsCreate;
