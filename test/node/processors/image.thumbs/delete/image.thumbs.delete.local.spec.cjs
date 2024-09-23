const fs = require("node:fs/promises");
const sharp = require("sharp");
const expect = require("chai").expect;
const notStoreProcessorImageThumbsDeleteLocal = require("../../../../../src/processors/image.thumbs/delete/image.thumbs.delete.local.cjs");
const notStoreDriver = require("../../../../../src/proto/driver.cjs");
const { OPT_INFO_CHILDREN } = require("../../../../../src/const.cjs");

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

describe("notStoreProcessorImageThumbsDeleteLocal", () => {
    describe("getOptions", () => {
        it("props: sizes, resize", () => {
            const opts = notStoreProcessorImageThumbsDeleteLocal.getOptions();
            expect(opts).to.have.all.keys(["saveOriginal"]);
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr =
                notStoreProcessorImageThumbsDeleteLocal.getDescription();
            expect(descr).to.have.all.keys(["id", "title", "optionsDefault"]);
        });
    });

    describe("listOfFilesToDelete", () => {
        it("original presented", () => {
            const fileINfo = {
                [OPT_INFO_CHILDREN]: {
                    small: {
                        local: "small",
                    },
                    original: {
                        local: "original",
                    },
                    big: {
                        local: "big",
                    },
                },
            };
            const list =
                notStoreProcessorImageThumbsDeleteLocal.listOfFilesToDelete(
                    fileINfo
                );
            expect(list).to.be.deep.equal(["small", "big"]);
        });

        it("original not presented", () => {
            const fileINfo = {
                [OPT_INFO_CHILDREN]: {
                    small: {
                        local: "small",
                    },
                    big: {
                        local: "big",
                    },
                },
            };
            const list =
                notStoreProcessorImageThumbsDeleteLocal.listOfFilesToDelete(
                    fileINfo
                );
            expect(list).to.be.deep.equal(["small", "big"]);
        });
    });

    describe("run", () => {
        const FILE_NAME =
            __dirname + "/../../../../browser/files/bone.tomahawk.jpg";
        const TEST_FILE_NAME = __dirname + "/../../../../tmp/test.file.jpg";

        before(async () => {
            await fs.copyFile(FILE_NAME, TEST_FILE_NAME);
        });

        it("thumbs not exists", async () => {
            await notStoreProcessorImageThumbsDeleteLocal.run(
                {
                    info: {
                        [OPT_INFO_CHILDREN]: {},
                    },
                },
                {},
                new notStoreDriver()
            );
        });

        it("thumbs empty", async () => {
            await notStoreProcessorImageThumbsDeleteLocal.run(
                {
                    info: {},
                },
                {},
                new notStoreDriver()
            );
        });

        it("thumbs not empty", async () => {
            await notStoreProcessorImageThumbsDeleteLocal.run(
                {
                    info: {
                        [OPT_INFO_CHILDREN]: {
                            micro: { local: TEST_FILE_NAME },
                        },
                    },
                },
                {},
                new notStoreDriver()
            );
        });

        it("thumbs not empty, not existing files presented", async () => {
            await notStoreProcessorImageThumbsDeleteLocal.run(
                {
                    info: {
                        [OPT_INFO_CHILDREN]: {
                            micro: { local: TEST_FILE_NAME },
                            small: { local: TEST_FILE_NAME + ".fake" },
                        },
                    },
                },
                {},
                new notStoreDriver()
            );
        });
    });
});
