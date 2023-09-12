const { createTestStore } = require("../../../test.store.cjs");

const fs = require("node:fs/promises");
const sharp = require("sharp");
const expect = require("chai").expect;
const notStoreProcessorImageThumbsDeleteRemote = require("../../../../../src/processors/image.thumbs/delete/image.thumbs.delete.remote.cjs");

function imageExists(fname, params) {
    return new Promise((res, rej) => {
        sharp(fname).metadata((err, meta) => {
            if (err) rej(err);
            try {
                for (let i in params) {
                    expect(meta[i]).to.be.equal(params[i]);
                }
            } catch (e) {
                rej(e);
            }
            res();
        });
    });
}

describe("notStoreProcessorImageThumbsDeleteRemote", () => {
    describe("getOptions", () => {
        it("props: sizes, resize", () => {
            const opts = notStoreProcessorImageThumbsDeleteRemote.getOptions();
            expect(opts).to.be.deep.equal({});
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr =
                notStoreProcessorImageThumbsDeleteRemote.getDescription();
            expect(descr).to.have.all.keys([
                "id",
                "title",
                "optionsDefault",
                "optionsUI",
            ]);
        });
    });

    describe("listOfFilesToDelete", () => {
        it("all listed", () => {
            const info = {
                thumbs: {
                    small: {
                        cloud: { Key: "1" },
                    },
                    big: {
                        cloud: { Key: "1" },
                    },
                },
            };
            const res =
                notStoreProcessorImageThumbsDeleteRemote.listOfFilesToDelete(
                    info
                );
            expect(Array.isArray(res)).to.be.true;
            expect(res.length).to.be.equal(2);
        });
    });

    describe("updateInfoAfterDelete", () => {
        it("property `cloud` removed from thumbs", () => {
            const info = {
                thumbs: {
                    small: {
                        cloud: 1,
                    },
                    big: {
                        cloud: 2,
                    },
                },
            };
            notStoreProcessorImageThumbsDeleteRemote.updateInfoAfterDelete(
                info
            );
            expect(info.thumbs.small.cloud).to.be.undefined;
            expect(info.thumbs.big.cloud).to.be.undefined;
        });
    });

    describe("run", () => {
        it("list is empty", async () => {
            const store = createTestStore();
            await notStoreProcessorImageThumbsDeleteRemote.run(
                "",
                {},
                {},
                store
            );
        });

        it("list not empty", async () => {
            const store = createTestStore();
            const info = {
                thumbs: {
                    small: {
                        cloud: { Key: "test/12312" },
                    },
                    big: {
                        cloud: { Key: "test/123121" },
                    },
                },
            };
            await notStoreProcessorImageThumbsDeleteRemote.run(
                "",
                info,
                {},
                store
            );
            expect(info.thumbs.small.cloud).to.be.undefined;
            expect(info.thumbs.big.cloud).to.be.undefined;
        });
    });
});
