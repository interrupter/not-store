const { generatePaths } = require("not-node/src/common");
const notStore = require("./src/store.cjs");
const { MODULE_NAME } = require("./src/const.cjs");
const config = require("not-config").forModule(MODULE_NAME);
const configReaders = require("./src/config.readers/index.cjs");

const CONTENT = [
    "routes",
    "controllers",
    "logics",
    "locales",
    "models",
    "fields",
    "forms",
];

module.exports = {
    initialize: (notApp) => {
        const configReaderName = config.get("configReader");
        notApp.debug("config_reader", configReaderName);
        if (
            configReaderName &&
            Object.hasOwn(configReaders, configReaderName)
        ) {
            notApp.log("changing_default_config_reader", configReaderName);
            notStore.setConfigReader(configReaders[configReaderName]);
        }
    },
    name: MODULE_NAME,
    notStore,
    paths: generatePaths(CONTENT, __dirname + "/src"),
};
