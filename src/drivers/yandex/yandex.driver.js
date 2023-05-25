const { MODULE_NAME } = require("../../const");
const DEFAULT_OPTIONS = require("./yandex.driver.options");
const notStoreDriver = require("../../proto/driver");

class notStoreDriverYandex extends notStoreDriver {
    constructor(options, processors) {
        super(options, processors);
    }

    static getDescription() {
        return {
            id: "yandex",
            title: `${MODULE_NAME}:driver_yandex_title`,
            ui: "notStoreUIDriverOptionsYandex",
        };
    }

    getOptions() {
        return DEFAULT_OPTIONS;
    }
}

module.exports = notStoreDriverYandex;
