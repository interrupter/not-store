const notStoreDriverTimeweb = require("../../src/drivers/timeweb/timeweb.driver.cjs");

const STORE_NAME = "test_store";

const TEST_STORE = {
    accessKeyId: "ENV$TIMEWEB_BUCKET_ID",
    secretAccessKey: "ENV$TIMEWEB_BUCKET_KEY",
    endpoint: "https://s3.timeweb.com",
    s3ForcePathStyle: true,
    region: "ru-1",
    apiVersion: "latest",
    bucket: "ENV$TIMEWEB_BUCKET_NAME",
    path: "ENV$TIMEWEB_BUCKET_PATH",
    tmp: "/var/tmp",
    groupFiles: false,
};

const FILES_TO_UPLOAD = ["alps_1.jpg", "alps_2.jpg", "alps_3.jpg"].map(
    (name) => __dirname + "/../browser/files/" + name
);

const FILES_TO_UPLOAD_2 = ["castle_1.jpg", "castle_2.jpg"].map(
    (name) => __dirname + "/../browser/files/" + name
);

const createTestStore = () => {
    return new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
};

module.exports = {
    createTestStore,
    FILES_TO_UPLOAD,
    FILES_TO_UPLOAD_2,
    TEST_STORE,
    STORE_NAME,
};
