const { MODULE_NAME } = require("../../const");
const DEFAULT_OPTIONS = require("./local.driver.options");
const notStoreDriver = require("../../proto/driver");

class notStoreDriverLocal extends notStoreDriver {
    constructor(options, processors) {
        super(options, processors);
    }

    static getDescription() {
        return {
            id: "local",
            title: `${MODULE_NAME}:driver_local_title`,
            ui: "notStoreUIDriverOptionsLocal",
        };
    }

    getOptions() {
        return DEFAULT_OPTIONS;
    }
}

module.exports = notStoreDriverLocal;
