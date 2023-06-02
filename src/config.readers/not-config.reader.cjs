const { MODULE_NAME } = require("not-store/src/const.cjs");
const config = require("not-config").forModule(MODULE_NAME);

const notStoreConfigReader = require("not-store/src/proto/config.reader.cjs");

class notStoreConfigReaderNotConfig extends notStoreConfigReader {
    static async for(storeName) {
        return config.get(`stores.${storeName}`);
    }
}

module.exports = notStoreConfigReaderNotConfig;
