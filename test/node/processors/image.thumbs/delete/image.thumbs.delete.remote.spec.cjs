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
});
