const expect = require("chai").expect;

const notStoreProcessorImageDeleteRemote = require("../../../../../src/processors/image/delete/image.delete.remote.cjs");

const { createTestStore } = require("../../../test.store.cjs");

const FILES_TO_UPLOAD = ["castle_3.jpg", "castle_4.jpg"].map(
    (name) => __dirname + "/../../../../browser/files/" + name
);

describe("notStoreProcessorImageDeleteRemote", () => {
    describe("getOptions", () => {
        it("props:", () => {
            const opts = notStoreProcessorImageDeleteRemote.getOptions();
            expect(Object.keys(opts).length).to.be.equal(0);
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr = notStoreProcessorImageDeleteRemote.getDescription();
            expect(descr).to.have.all.keys([
                "id",
                "title",
                "optionsDefault",
                "optionsUI",
            ]);
        });
    });

    describe("updateInfoAfterDelete", () => {
        it("fileInfo is not empty", () => {
            const fileInfo = {
                cloud: true,
            };
            notStoreProcessorImageDeleteRemote.updateInfoAfterDelete(fileInfo);
            expect(fileInfo.cloud).to.be.undefined;
        });
    });

    describe("run", () => {
        let uploaded = {};
        const store = createTestStore();

        before(async () => {
            uploaded = await store.directUpload(
                FILES_TO_UPLOAD[0],
                "dir/some_file_name.jpg"
            );
        });

        it("deleted", async () => {
            const info = {
                cloud: uploaded,
            };
            await notStoreProcessorImageDeleteRemote.run(
                FILES_TO_UPLOAD[0],
                info,
                {},
                store
            );
            expect(info.cloud).to.be.undefined;
        });

        it("not uploaded, filename is empty", async () => {
            const info = {};
            const store = createTestStore();
            await notStoreProcessorImageDeleteRemote.run("", info, {}, store);
            expect(info.cloud).to.be.undefined;
        });
    });
});
