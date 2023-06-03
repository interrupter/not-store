const notStoreConfigReader = require("../proto/config.reader.cjs");
class notStoreConfigReaderNotOptions extends notStoreConfigReader {
    static async for(/*storeName*/) {
        return {
            //config
        };
    }
}

module.exports = notStoreConfigReaderNotOptions;
