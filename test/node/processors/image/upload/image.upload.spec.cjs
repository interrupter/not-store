const expect = require("chai").expect;

const notStoreProcessorImageUpload = require("../../../../../src/processors/image/upload/image.upload.cjs");

const { createTestStore } = require("../../../test.store.cjs");

const FILES_TO_UPLOAD = ["castle_3.jpg", "castle_4.jpg"].map(
    (name) => __dirname + "/../../../../browser/files/" + name
);

describe("notStoreProcessorImageUpload", () => {
    describe("getOptions", () => {
        it("props:", () => {
            const opts = notStoreProcessorImageUpload.getOptions();
            expect(Object.keys(opts).length).to.be.equal(0);
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr = notStoreProcessorImageUpload.getDescription();
            expect(descr).to.have.all.keys([
                "id",
                "title",
                "optionsDefault",
                "optionsUI",
                "metadataUI",
            ]);
        });
    });

    describe("updateFileInfo", () => {
        it("fileInfo is not empty", () => {
            const fileInfo = {};
            const cloudName = { first: true };
            notStoreProcessorImageUpload.updateFileInfo(fileInfo, cloudName);
            expect(fileInfo.cloud.first).to.be.true;
        });
    });

    describe("run", () => {
        it("uploaded", async () => {
            const info = {};
            const store = createTestStore();
            await notStoreProcessorImageUpload.run(
                FILES_TO_UPLOAD[0],
                info,
                {},
                store
            );
            expect(info.cloud).to.have.all.keys([
                "ETag",
                "Location",
                "Local",
                "key",
                "Key",
                "Bucket",
            ]);
        });

        it("not uploaded, filename is empty", async () => {
            const info = {};
            const store = createTestStore();
            await notStoreProcessorImageUpload.run("", info, {}, store);
            expect(info.cloud).to.be.undefined;
        });
    });
});
