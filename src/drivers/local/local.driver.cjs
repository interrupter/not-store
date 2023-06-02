const { MODULE_NAME } = require("../../const.cjs");
const DEFAULT_OPTIONS = require("./local.driver.options.cjs");
const notStoreDriver = require("../../proto/driver.cjs");

class notStoreDriverLocal extends notStoreDriver {
    constructor(options, processors) {
        super(options, processors);
    }

    static getDescription() {
        return {
            id: "local",
            title: `${MODULE_NAME}:driver_local_title`,
            ui: "notStoreUIDriverOptionsLocal",
            actions: [],
        };
    }

    getOptions() {
        return DEFAULT_OPTIONS;
    }
}

module.exports = notStoreDriverLocal;
