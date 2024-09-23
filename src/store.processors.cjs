const notError = require("not-error/src/error.node.cjs");

const Log = require("not-log")(module, "notStoreProcessors");

const {
    notStoreExceptionProcessorRunError,
    notStoreExceptionProcessorAlreadyExists,
    notStoreExceptionProcessorIsNotExists,
} = require("./exceptions.cjs");

const DEFAULT_PROCESSORS = require("./processors/index.cjs");

class notStoreProcessors {
    /**
     * @type Object<string, import('./proto/processor.cjs')>
     *
     * @memberof notStoreProcessors
     */
    static #processors = {
        ...DEFAULT_PROCESSORS,
    };

    /**
     * Returns processor class from lib by name
     * @param {string} name     name of processor class in lib
     * @returns {object}         notStoreProcessor child static class or throws
     */
    static getProcessor(name) {
        if (Object.hasOwn(this.#processors, name)) {
            return this.#processors[name];
        }
        throw new notStoreExceptionProcessorIsNotExists(name);
    }

    /**
     *
     *
     * @static
     * @param {string} name
     * @param {import('./proto/processor.cjs')} processor
     * @memberof notStoreProcessors
     */
    static setProcessor(name, processor) {
        if (Object.hasOwn(this.#processors, name)) {
            throw new notStoreExceptionProcessorAlreadyExists(name);
        }
        this.#processors[name] = processor;
    }

    /**
     *
     *
     * @static
     * @return {Array<import('./proto/processor.cjs').StoreProcessorDescription>}
     * @memberof notStoreProcessors
     */
    static list() {
        return Object.values(this.#processors).map((proc) =>
            proc.getDescription()
        );
    }

    /**
     * @typedef {Object}    ProcessorItem
     * @property    {number}    id
     * @property    {string}    name
     * @property    {object}    options
     */

    /**
     *
     *
     * @static
     * @param {Array<ProcessorItem>}            list        list of processors objects with id,name,options
     * @param {import('mongoose').Document}     file        file object
     * @param {import('./proto/driver.cjs')}    driver      notStoreDriver child class instance
     * @memberof notStoreProcessors
     */
    static async run(
        list, //processors list to run against file
        file, //file metadata object
        driver //store driver
    ) {
        try {
            if (Array.isArray(list)) {
                for (let item of list) {
                    Log && Log.debug("store processor:", item);
                    const [processor, options] =
                        this.getProcessorAndOptions(item);
                    Log && Log.debug(options);
                    await processor.run(file, options, driver);
                }
            }
        } catch (e) {
            if (e instanceof notError) {
                throw e;
            } else {
                throw new notStoreExceptionProcessorRunError(
                    list,
                    file?.toObject ? file.toObject() : file,
                    driver.name,
                    e
                );
            }
        }
    }

    /**
     * Parses processors pipe item declaration and returns exact processor static class and options
     * @param   {object}    item                processor description
     * @param   {string}    item.name           name of processor from lib
     * @param   {object}    item.options        processor options
     * @returns {Array} always [class, object] or throws
     */
    static getProcessorAndOptions(item) {
        return [this.getProcessor(item.name), item.options];
    }

    /**
     * Returns default options of processor
     * @param       {string}    name    processor name
     * @returns     {object}            options, for now always {}
     */
    static getDefaultProcessorOptions(name) {
        return this.getProcessor(name).getOptions();
    }
}

module.exports = notStoreProcessors;
