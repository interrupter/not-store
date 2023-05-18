const path = require("path");
const notStore = require("./src/store");
const { MODULE_NAME } = require("./src/const");
const config = require("not-config").forModule(MODULE_NAME);
const configReaders = require("./src/config.readers");

module.exports = {
    notStore,
    name: MODULE_NAME,
    paths: {
        routes: path.join(__dirname, "/src/routes"),
        controllers: path.join(__dirname, "/src/controllers"),
        logics: path.join(__dirname, "/src/logics"),
        models: path.join(__dirname, "/src/models"),
        fields: path.join(__dirname, "/src/fields"),
    },
    initialize: (notApp) => {
        const configReaderName = config.get("configReader");
        if (Object.hasOwn(configReaders, configReaderName)) {
            notStore.setConfigReader(configReaders[configReaderName]);
        }
    },
};
