const {
    notStoreExceptionDriverAlreadyExists,
    notStoreExceptionDriverIsNotExists,
} = require("not-store/src/exceptions");
const DEFAULT_CONFIG_READER = require("./config.readers/not-store.reader");

const DEFAULT_DRIVERS = require("./drivers/index");

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

    static async get(storeName) {
        const storeConfig = await this.#configReader.for(storeName);
        return this.#getDriverForConfig(storeConfig);
    }

    static #getDriverForConfig(storeConfig) {
        if (Object.hasOwn(this.#drivers, storeConfig.driver)) {
            return new this.#drivers[storeConfig.driver](storeConfig.options);
        }
        throw new notStoreExceptionDriverIsNotExists(storeConfig.driver);
    }
}

module.exports = notStore;
