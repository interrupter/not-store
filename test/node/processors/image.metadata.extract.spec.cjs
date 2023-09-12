const expect = require("chai").expect;
const notStoreProcessorImageExtractMetadata = require("../../../src/processors/image.metadata.extract.cjs");

describe("notStoreProcessorImageExtractMetadata", () => {
    describe("METADATA_FORBIDDEN_FIELDS", () => {
        it("getter returns array of strings", () => {
            const lst =
                notStoreProcessorImageExtractMetadata.METADATA_FORBIDDEN_FIELDS;
            expect(lst).to.be.an.instanceOf(Array);
            expect(lst.every((s) => typeof s === "string")).to.be.true;
        });
    });

    describe("clearMetadata", () => {
        it("all fields removed from object", () => {
            const meta = {
                exif: 1,
                xmp: 2,
                icc: 3,
                iptc: 4,
            };
            notStoreProcessorImageExtractMetadata.clearMetadata(meta);
            expect(Object.keys(meta)).to.be.deep.equal([]);
        });

        it("not all fields removed from object", () => {
            const meta = {
                exif: 1,
                icc: 3,
                iptc: 4,
                safeField: 5,
            };
            notStoreProcessorImageExtractMetadata.clearMetadata(meta);
            expect(Object.keys(meta)).to.be.deep.equal(["safeField"]);
        });
    });

    describe("getDescription", () => {
        it("id, title, optionsDefault, optionsUI, metadataUI in description", () => {
            const descr =
                notStoreProcessorImageExtractMetadata.getDescription();
            expect(descr).to.have.all.keys([
                "id",
                "title",
                "optionsDefault",
                "optionsUI",
                "metadataUI",
            ]);
        });
    });

    describe("run", () => {
        it("file exists, image, sharp supported format", async () => {
            const FILE_NAME =
                __dirname + "/../../browser/files/bone.tomahawk.jpg";
            const info = {};
            await notStoreProcessorImageExtractMetadata.run(FILE_NAME, info);
            expect(info).to.have.any.keys(["metadata"]);
        });

        it("file not exists", async () => {
            try {
                const FILE_NAME =
                    __dirname + "/../../browser/files/bone.tomahawk.txt";
                await notStoreProcessorImageExtractMetadata.run(FILE_NAME, {});
                expect(true).to.be.equal("this should throw");
            } catch (e) {
                expect(e).to.be.an.instanceOf(Error);
            }
        });
    });
});
