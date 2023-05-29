const notNode = require("not-node");

const notStoreConfigReader = require("../proto/config.reader");
const {
    notStoreExceptionStoreIsNotActive,
    notStoreExceptionConfigReaderError,
    notStoreExceptionConfigIsNotExists,
} = require("../exceptions");

class notStoreConfigReaderNotStoreMongoDB extends notStoreConfigReader {
    static #MODEL_NAME = "Store";

    static async for(storeName) {
        return this.#loadConfigForStore(storeName);
    }

    static async #loadConfigForStore(storeName) {
        const Store = notNode.Application.getModel(this.#MODEL_NAME);
        try {
            let config = await Store.makeQuery("findOne", {
                name: storeName,
            }).exec();
            if (config) {
                if (!config.active) {
                    throw new notStoreExceptionStoreIsNotActive(
                        storeName,
                        config.driver
                    );
                }
                return {
                    driver: config.driver,
                    options: config.options,
                    processors: config.processors,
                };
            } else {
                throw new notStoreExceptionConfigIsNotExists(
                    storeName,
                    notStoreConfigReaderNotStoreMongoDB.name
                );
            }
        } catch (e) {
            if (e instanceof notStoreExceptionConfigIsNotExists) {
                throw e;
            } else if (e instanceof notStoreExceptionStoreIsNotActive) {
                throw e;
            } else {
                throw notStoreExceptionConfigReaderError(
                    storeName,
                    notStoreConfigReaderNotStoreMongoDB.name,
                    e
                );
            }
        }
    }
}

module.exports = notStoreConfigReaderNotStoreMongoDB;
