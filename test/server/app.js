const notNode = require("not-node");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;

const InitIdentityTokens = require("not-user").InitIdentityTokens;

const Init = require("not-node").Init,
    path = require("path"),
    manifest = require("../test.manifest.json");

module.exports = () => {
    const options = {
        pathToApp: path.join(__dirname),
        pathToNPM: path.join(__dirname, "../../node_modules"),
        routesPath: path.join(__dirname, "./routes"),
        indexRoute: require("./routes/site.js").index,
    };

    const additional = {
        pre({ initSequence }) {
            initSequence.remove("InitMonitoring");
            initSequence.insert(InitIdentityTokens);
        },
        db: {
            mongoose: {
                async pre({ conf }) {
                    // This will create an new instance of "MongoMemoryServer" and automatically start it
                    const mongod = await MongoMemoryServer.create();
                    const uri = mongod.getUri();
                    console.log(uri);
                    conf.uri = uri;
                },
            },
        },
        app: {
            importModules: {
                async post({ config, options, master, emit }) {
                    const modPath = __dirname + "/../../";
                    master.getApp().log("loading testie", "not-store", modPath);
                    master.getApp().importModuleFrom(modPath, "not-store");
                },
            },
        },
        async post({ master, config }) {
            await require("./testEnv")(master.getApp(), config);
        },
    };

    Init.run({ options, manifest, additional });
};
