const {
    notStoreExceptionDriverAlreadyExists,
    notStoreExceptionDriverIsNotExists,
} = require("./exceptions.cjs");
//class to load configs from somewhere
const DEFAULT_CONFIG_READER = require("./config.readers/not-store.reader.cjs");
//drivers of storage medium
const DEFAULT_DRIVERS = require("./drivers/index.cjs");
//file pre/post processors
const notStoreProcessors = require("./store.processors.cjs");
/**
 *  notStore.get(store_config_name).add();
 **/
class notStore {
    static #drivers = {
        ...DEFAULT_DRIVERS,
    };

    static #configReader = DEFAULT_CONFIG_READER;

    static setConfigReader(reader) {
        this.#configReader = reader;
    }

    static setDriver(name, driver) {
        if (Object.hasOwn(this.#drivers, name)) {
            throw new notStoreExceptionDriverAlreadyExists(name);
        }
        this.#drivers[name] = driver;
    }

    static listDrivers() {
        return Object.values(this.#drivers).map((driver) =>
            driver.getDescription()
        );
    }

    static listProcessors() {
        return notStoreProcessors.list();
    }

    static async get(storeName) {
        const storeConfig = await this.#configReader.for(storeName);
        return this.getDriverForConfig(storeConfig, storeName);
    }

    static getDriverForConfig(storeConfig, storeName) {
        if (Object.hasOwn(this.#drivers, storeConfig.driver)) {
            return new this.#drivers[storeConfig.driver](
                storeConfig.options,
                storeConfig.processors,
                storeName
            );
        }
        throw new notStoreExceptionDriverIsNotExists(storeConfig.driver);
    }
}

module.exports = notStore;
