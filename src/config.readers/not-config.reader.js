const { MODULE_NAME } = require("../const");
const config = require("not-config").forModule(MODULE_NAME);

const notStoreConfigReader = require("../proto/config.reader");

class notStoreConfigReaderNotConfig extends notStoreConfigReader {
    static async for(storeName) {
        return config.get(`stores.${storeName}`);
    }
}

module.exports = notStoreConfigReaderNotConfig;
