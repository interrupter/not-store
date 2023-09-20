const notStoreDriverTimeweb = require("../../src/drivers/timeweb/timeweb.driver.cjs");

const STORE_NAME = "test_store_root";

const TEST_STORE = require("../server/config/common.json").modules.store.stores[
    STORE_NAME
].options;

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
