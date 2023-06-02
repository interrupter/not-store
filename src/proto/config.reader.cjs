const { MODULE_NAME } = require("not-store/src/const.cjs");
const config = require("not-config").forModule(MODULE_NAME);

class notStoreConfigReader {
    static async for(storeName) {
        return config.get(`stores.${storeName}`);
    }
}

module.exports = notStoreConfigReader;
