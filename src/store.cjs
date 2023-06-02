const {
    notStoreExceptionDriverAlreadyExists,
    notStoreExceptionDriverIsNotExists,
} = require("./exceptions.cjs");
const DEFAULT_CONFIG_READER = require("./config.readers/not-store.reader.cjs");

const DEFAULT_DRIVERS = require("./drivers/index.cjs");
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
        return Object.keys(this.#drivers).map((id) =>
            this.#drivers[id].getDescription()
        );
    }

    static listProcessors() {
        return notStoreProcessors.list();
    }

    static async get(storeName) {
        const storeConfig = await this.#configReader.for(storeName);
        return this.getDriverForConfig(storeConfig);
    }

    static getDriverForConfig(storeConfig) {
        if (Object.hasOwn(this.#drivers, storeConfig.driver)) {
            return new this.#drivers[storeConfig.driver](
                storeConfig.options,
                storeConfig.processors
            );
        }
        throw new notStoreExceptionDriverIsNotExists(storeConfig.driver);
    }
}

module.exports = notStore;
