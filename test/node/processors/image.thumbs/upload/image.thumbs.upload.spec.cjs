const expect = require("chai").expect;

const notStoreProcessorImageThumbsUpload = require("../../../../../src/processors/image.thumbs/upload/image.thumbs.upload.cjs");

const { createTestStore } = require("../../../test.store.cjs");

const FILES_TO_UPLOAD = ["castle_3.jpg", "castle_4.jpg"].map(
    (name) => __dirname + "/../../../../browser/files/" + name
);

describe("notStoreProcessorImageThumbsUpload", () => {
    describe("getOptions", () => {
        it("props:", () => {
            const opts = notStoreProcessorImageThumbsUpload.getOptions();
            expect(Object.keys(opts).length).to.be.equal(0);
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr = notStoreProcessorImageThumbsUpload.getDescription();
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
            const fileInfo = {
                thumbs: {
                    small: {
                        local: "1",
                    },
                    big: {
                        local: "2",
                    },
                },
            };
            const cloudNames = { 1: { first: true }, 2: { second: true } };
            notStoreProcessorImageThumbsUpload.updateFileInfo(
                fileInfo,
                cloudNames
            );
            expect(fileInfo.thumbs.small.cloud.first).to.be.true;
            expect(fileInfo.thumbs.big.cloud.second).to.be.true;
        });
    });

    describe("run", () => {
        it("uploaded", async () => {
            const info = {
                thumbs: {
                    small: {
                        local: FILES_TO_UPLOAD[0],
                    },
                    big: {
                        local: FILES_TO_UPLOAD[1],
                    },
                },
            };
            const store = createTestStore();
            await notStoreProcessorImageThumbsUpload.run("", info, {}, store);
            expect(info.thumbs.small.cloud).to.have.all.keys([
                "ETag",
                "Location",
                "key",
                "Key",
                "Bucket",
            ]);

            expect(info.thumbs.big.cloud).to.have.all.keys([
                "ETag",
                "Location",
                "key",
                "Key",
                "Bucket",
            ]);
        });

        it("not uploaded, list is empty", async () => {
            const info = {
                thumbs: {},
            };
            const store = createTestStore();
            await notStoreProcessorImageThumbsUpload.run("", info, {}, store);
        });
    });
});
