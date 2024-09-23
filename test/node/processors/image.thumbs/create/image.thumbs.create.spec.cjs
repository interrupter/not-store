const fs = require("node:fs/promises");
const sharp = require("sharp");
const expect = require("chai").expect;
const notStoreProcessorImageThumbsCreate = require("../../../../../src/processors/image.thumbs/create/image.thumbs.create.cjs");
const notStoreDriver = require("../../../../../src/proto/driver.cjs");
const notStoreDriverFilenameResolver = require("../../../../../src/proto/driver.filename.resolver.cjs");

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

describe("notStoreProcessorImageThumbsCreate", () => {
    describe("getOptions", () => {
        it("props: sizes, resize", () => {
            const opts = notStoreProcessorImageThumbsCreate.getOptions();
            expect(opts).to.have.all.keys(["sizes", "resize"]);
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr = notStoreProcessorImageThumbsCreate.getDescription();
            expect(descr).to.have.all.keys([
                "id",
                "title",
                "optionsDefault",
                "optionsUI",
            ]);
        });
    });

    describe("makeThumb", () => {
        const FILE_NAME =
            __dirname + "/../../../../browser/files/bone.tomahawk.jpg";
        const DEST_NAME =
            __dirname + "/../../../../tmp/bone.tomahawk-small.jpg";
        const SIZE = 300;
        it("file exists, sharp supported, options provided", async () => {
            const sharpOptions = {
                resize: {
                    fit: "outside",
                },
            };
            await notStoreProcessorImageThumbsCreate.makeThumb(
                FILE_NAME,
                DEST_NAME,
                SIZE,
                sharpOptions
            );
            await imageExists(DEST_NAME, {
                format: "jpeg",
                width: 300,
                height: 443,
            });
        });

        it("file exists, sharp supported, options not provided", async () => {
            const fname = DEST_NAME + Math.random() + ".jpg";
            await notStoreProcessorImageThumbsCreate.makeThumb(
                FILE_NAME,
                fname,
                SIZE
            );
            await imageExists(fname, {
                format: "jpeg",
                width: 300,
                height: 300,
            });
        });

        it("file not exists, sharp supported, options not provided", (done) => {
            notStoreProcessorImageThumbsCreate
                .makeThumb(
                    FILE_NAME + Math.random(),
                    DEST_NAME + Math.random() + ".jpg",
                    SIZE
                )
                .then(() => {
                    done(new Error("This should throw"));
                })
                .catch((e) => {
                    done();
                });
        });
    });

    describe("makeThumbs", () => {
        const FILE_NAME =
            __dirname + "/../../../../browser/files/bone.tomahawk.jpg";
        it("make micro - 90, normal - 300, big - 1000", async () => {
            const sharpOptions = {
                resize: {
                    fit: "outside",
                },
            };
            const thumbs = {
                micro: {
                    variant: 90,
                    local:
                        __dirname + "/../../../../tmp/bone.tomahawk-micro.jpg",
                },
                normal: {
                    variant: 300,
                    local:
                        __dirname + "/../../../../tmp/bone.tomahawk-normal.jpg",
                },
                big: {
                    variant: 1000,
                    local: __dirname + "/../../../../tmp/bone.tomahawk-big.jpg",
                },
            };
            await notStoreProcessorImageThumbsCreate.makeThumbs(
                FILE_NAME,
                thumbs,
                sharpOptions
            );
            for (const thumb of Object.values(thumbs)) {
                await imageExists(thumb.local, {
                    format: "jpeg",
                    width: thumb.variant,
                });
            }
        });
    });

    describe("run", () => {
        const FILE_NAME =
            __dirname + "/../../../../browser/files/bone.tomahawk.jpg";
        const TEST_FILE_NAME = __dirname + "/../../../../tmp/test.file.jpg";
        before(async () => {
            await fs.copyFile(FILE_NAME, TEST_FILE_NAME);
        });

        it("running with default notStoreDriver", async () => {
            await notStoreProcessorImageThumbsCreate.run(
                {
                    path: TEST_FILE_NAME,
                    info: {},
                },
                {
                    format: "jpeg",
                    sizes: {
                        micro1: 90,
                        normal1: 300,
                        big1: 1000,
                    },
                },
                new notStoreDriver()
            );
            const thumbs = {
                micro1: {
                    variant: 90,
                    local: __dirname + "/../../../../tmp/test.file-micro1.jpeg",
                },
                normal1: {
                    variant: 300,
                    local:
                        __dirname + "/../../../../tmp/test.file-normal1.jpeg",
                },
                big1: {
                    variant: 1000,
                    local: __dirname + "/../../../../tmp/test.file-big1.jpeg",
                },
            };
            for (const thumb of Object.values(thumbs)) {
                await imageExists(thumb.local, {
                    format: "jpeg",
                    width: thumb.variant,
                });
            }
        });
    });
});
