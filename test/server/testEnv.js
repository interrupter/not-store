const notNode = require("not-node");
const path = require("path");
const fs = require("fs");
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

async function initUsers() {
    const User = notNode.Application.getLogic("not-user//User");
    let t = 0;
    for (let role of Object.keys(AUTHS)) {
        t++;
        let newUserDoc = await User.createNewUserDocument({
            username: `VasyaPupkinIs_${role}`,
            email: `vasya@pupkin.hacker.${role}.fakes`,
            password: "password",
            ip: "127.0.0.1",
            telephone: `+1-234-234-234${t}`,
            role: [role],
        });
        console.log(newUserDoc.toObject());
        AUTHS[role].uid = newUserDoc._id;
    }
}

function shutDown() {
    const File = notNode.Application.getModel("not-store//File");
    File.listAll()
        .then(async (list) => {
            for (let file of list) {
                const store = await notStore.get(file.store);
                await store.delete(file);
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
        await initUsers();
        const FileLogic = notNode.Application.getLogic("not-store//File");
        process.on("SIGTERM", shutDown);
        process.on("SIGINT", shutDown);
        //creating few records for files
        let t = 0;
        const uploadResults = {};
        for (let role in AUTHS) {
            //console.log(role, AUTHS[role]);
            const files = { files: [] };
            for (let i = 0; i < FILE_COUNT; i++) {
                t++;
                let filePath = FILES.at(t);
                let fpath = path.parse(filePath);
                files.files.push({
                    data: filePath,
                    format: fpath.ext.slice(1),
                    mimetype: "image/jpeg",
                    name: fpath.name,
                    size: (await fs.promises.stat(filePath)).size,
                });
            }
            uploadResults[role] = await FileLogic.upload({
                files,
                identity: {
                    sid: `${role}_session`,
                    ip: "127.0.0.1",
                    uid: AUTHS[role].uid,
                    auth: ["root", "user"].includes(role),
                    admin: role === "admin",
                    root: role === "root",
                },
                store: `test_store_${role}`,
            });
        }
        console.log("upload results", JSON.stringify(uploadResults, null, 4));
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
            JSON.stringify(item, null, 4)
        );
        console.log("list results", results);
        return AUTHS;
    } catch (e) {
        console.error(e);
        notApp.report(e);
    }
};
