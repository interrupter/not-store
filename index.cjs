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
    notStore,
    name: MODULE_NAME,
    paths: generatePaths(CONTENT, __dirname + "/src"),
    initialize: (/*notApp*/) => {
        const configReaderName = config.get("configReader");
        if (Object.hasOwn(configReaders, configReaderName)) {
            notStore.setConfigReader(configReaders[configReaderName]);
        }
    },
};
