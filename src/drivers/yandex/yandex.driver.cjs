const { MODULE_NAME } = require("../../const.cjs");
const DEFAULT_OPTIONS = require("./yandex.driver.options.cjs");
const notStoreDriver = require("../../proto/driver.cjs");

class notStoreDriverYandex extends notStoreDriver {
    constructor(options, processors) {
        super(options, processors);
    }

    static getDescription() {
        return {
            id: "yandex",
            title: `${MODULE_NAME}:driver_yandex_title`,
            ui: "notStoreUIDriverOptionsYandex",
            actions: [],
        };
    }

    getOptions() {
        return DEFAULT_OPTIONS;
    }
}

module.exports = notStoreDriverYandex;
