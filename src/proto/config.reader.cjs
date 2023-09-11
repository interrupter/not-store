// @ts-check
const { MODULE_NAME } = require("../const.cjs");
const config = require("not-config").forModule(MODULE_NAME);

class notStoreConfigReader {
    static async for(storeName) {
        return config.get(`stores.${storeName}`);
    }
}

module.exports = notStoreConfigReader;
