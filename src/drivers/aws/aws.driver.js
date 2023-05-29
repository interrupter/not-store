const { MODULE_NAME } = require("../../const");
const DEFAULT_OPTIONS = require("./aws.driver.options");
const notStoreDriver = require("../../proto/driver");

class notStoreDriverAWS extends notStoreDriver {
    constructor(options, processors) {
        super(options, processors);
    }

    static getDescription() {
        return {
            id: "aws",
            title: `${MODULE_NAME}:driver_aws_title`,
            ui: "notStoreUIDriverOptionsAWS",
            actions: [],
        };
    }

    getOptions() {
        return DEFAULT_OPTIONS;
    }
}

module.exports = notStoreDriverAWS;
