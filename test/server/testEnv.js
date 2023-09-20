const notNode = require("not-node");
const path = require("path");
const notStore = require("../../").notStore;
const { ObjectId } = require("mongoose").Types;

const FILE_COUNT = 4;

const FILES = [
    path.resolve(__dirname, "../browser/files/cyber_1.jpg"),
    path.resolve(__dirname, "../browser/files/cyber_2.jpg"),
    path.resolve(__dirname, "../browser/files/samurai.jpg"),
    path.resolve(__dirname, "../browser/files/snake.jpg"),
    path.resolve(__dirname, "../browser/files/witcher.jpg"),

    path.resolve(__dirname, "../browser/files/alps_1.jpg"),
    path.resolve(__dirname, "../browser/files/alps_2.jpg"),
    path.resolve(__dirname, "../browser/files/alps_3.jpg"),

    path.resolve(__dirname, "../browser/files/castle_1.jpg"),
    path.resolve(__dirname, "../browser/files/castle_2.jpg"),
    path.resolve(__dirname, "../browser/files/castle_3.jpg"),
    path.resolve(__dirname, "../browser/files/castle_4.jpg"),
    path.resolve(__dirname, "../browser/files/castle_5.jpg"),

    path.resolve(__dirname, "../browser/files/boats.jpg"),
    path.resolve(__dirname, "../browser/files/bone.tomahawk.jpg"),
    path.resolve(__dirname, "../browser/files/doge.png"),
];

const AUTHS = {
    root: {},
    user: {},
    guest: {},
};

for (let t in AUTHS) {
    if (t === "empty") {
        continue;
    }
    Object.assign(AUTHS[t], {
        session: {
            id: `${t}_session`,
        },
        user: {
            role: t,
        },
        connection: {
            remoteAddress: "127.0.0.1",
        },
        get() {
            return null;
        },
    });
}

function shutDown() {
    const File = notNode.Application.getModel("not-store//File");
    File.listAll()
        .then(async (list) => {
            for (let file of list) {
                const store = await notStore.get(file.store);
                await store.delete(file.path, file.metadata);
            }
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = async (notApp, config) => {
    try {
        const FileLogic = notNode.Application.getLogic("not-store//File");
        process.on("SIGTERM", shutDown);
        process.on("SIGINT", shutDown);
        //creating few records for files
        let t = 0;
        for (let role in AUTHS) {
            const store = await notStore.get(`test_store_${role}`);
            const userId = new ObjectId();
            console.log(role, AUTHS[role]);
            for (let i = 0; i < FILE_COUNT; i++) {
                t++;
                t = t % FILES.length;
                let filePath = FILES[t];
                const fpath = path.parse(filePath);
                await FileLogic.uploadFile(
                    store,
                    filePath,
                    {
                        name: fpath.name,
                        size: t,
                        format: fpath.ext.slice(1),
                    },
                    {
                        session: `${t}_session`,
                        ip: "127.0.0.1",
                        id: userId,
                    }
                );
            }
        }
        const results = await FileLogic.listAndCount({
            query: {
                size: 100,
                skip: 0,
                filter: {},
                sorter: { _id: -1 },
                search: undefined,
            },
        });
        results.list = results.list.map((item) =>
            JSON.stringify(item.toObject(), null, 4)
        );
        console.log(results);
    } catch (e) {
        console.error(e);
        notApp.report(e);
    }
};
