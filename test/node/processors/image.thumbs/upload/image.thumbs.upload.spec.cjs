const expect = require("chai").expect;

const notStoreProcessorImageThumbsUpload = require("../../../../../src/processors/image.thumbs/upload/image.thumbs.upload.cjs");

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
});
