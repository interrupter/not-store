const { notError } = require("not-error");
const { notNode } = require("not-node");
const Log = require("not-log")(module, "notStoreProcessors");

const {
    notStoreExceptionProccesorRunError,
    notStoreExceptionProcessorAlreadyExists,
    notStoreExceptionProcessorIsNotExists,
    notStoreExceptionProcessingPipeItemWrongNameFormat,
    notStoreExceptionProcessingPipeItemWrongFormat,
    notStoreExceptionProcessingPipeItemWrongOptionsFormat,
} = require("./exceptions");

const DEFAULT_PROCESSORS = require("./processors/index");

class notStoreProcessors {
    static #processors = {
        ...DEFAULT_PROCESSORS,
    };

    static setProcessor(name, processor) {
        if (Object.hasOwn(this.#processors, name)) {
            throw new notStoreExceptionProcessorAlreadyExists(name);
        }
        this.#processors[name] = processor;
    }

    static list() {
        return Object.keys(this.#processors).map((id) =>
            this.#processors[id].getDescription()
        );
    }

    static async run(
        list, //processors list to run against file
        filename, //current target file
        metadata, //file metadata object
        driver //store driver
    ) {
        try {
            if (Array.isArray(list)) {
                for (let item of list) {
                    const [processor, options] =
                        this.getProcessorAndOptions(item);
                    await processor.run(filename, metadata, options, driver);
                }
            }
        } catch (e) {
            Log.error(e);
            if (e instanceof notError) {
                notNode.Application.report(e);
            } else {
                notNode.Application.report(
                    new notStoreExceptionProccesorRunError(
                        list,
                        filename,
                        driver.name,
                        e
                    )
                );
            }
        }
    }

    /**
     * Parses processors pipe item declaration and returns exact processor static class and options
     * @param {string|Array}    item    name of processor or array of [name:string, options:object]
     * @returns {Array} always [class, object] or throws
     */
    static getProcessorAndOptions(item) {
        let processorName, processorOptions;
        if (Array.isArray(item) && item.length > 0) {
            if (item.length > 0) {
                processorName = this.getProcessorName(item);
            }
            if (item.length > 1) {
                processorOptions = this.getProcessorOptions(item);
            }
        } else {
            processorName = this.getProcessorName(item);
            processorOptions = this.getDefaultProcessorOptions(processorName);
        }
        if (
            typeof processorName === "undefined" ||
            typeof processorOptions === "undefined"
        ) {
            throw new notStoreExceptionProcessingPipeItemWrongFormat(item);
        }
        return [this.getProcessor(processorName), processorOptions];
    }

    /**
     * Returns default options of processor
     * @param       {string}    name    processor name
     * @returns     {object}            options, for now always {}
     */
    static getDefaultProcessorOptions(name) {
        return this.getProcessor(name).getOptions();
    }

    /**
     * Returns options of processor class by pipe line item declaration
     * @param       {string|array}  item    pipeline item declaration string|array[string,object]
     * @returns     {string}                options of processor
     */
    static getProcessorOptions(item) {
        if (
            Array.isArray(item) &&
            item.length > 1 &&
            typeof item[1] === "object" &&
            item[1]
        ) {
            return item[1];
        }
        throw new notStoreExceptionProcessingPipeItemWrongOptionsFormat(item);
    }

    /**
     * Returns name of processor class by pipe line item
     * @param       {string|array}  item    pipeline item declaration string|array[string,object]
     * @returns     {string}                name of processor
     */
    static getProcessorName(item) {
        if (typeof item === "string") {
            return item;
        } else if (
            Array.isArray(item) &&
            item.length > 0 &&
            typeof item[0] === "string" &&
            item[0].trim()
        ) {
            return item[0].trim();
        }
        throw new notStoreExceptionProcessingPipeItemWrongNameFormat(item);
    }

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
}

module.exports = notStoreProcessors;
