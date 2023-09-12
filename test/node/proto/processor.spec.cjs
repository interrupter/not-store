const notStoreProcessor = require("../../../src/proto/processor.cjs");

const expect = require("chai").expect;

describe("Proto/notStoreProcessor", function () {
    describe("getDescription", () => {
        it("accessible as static", () => {
            const descr = notStoreProcessor.getDescription();
            expect(descr).to.be.instanceOf(Object);
            expect(descr).to.have.all.keys([
                "id",
                "title",
                "optionsUI",
                "metadataUI",
                "optionsDefault",
            ]);
        });
    });

    describe("getOptions", () => {
        it("accessible as static", () => {
            const opts = notStoreProcessor.getOptions();
            expect(opts).to.be.instanceOf(Object);
        });
    });

    describe("run", () => {
        it("accessible as static async", () => {
            const promise = notStoreProcessor.run();
            expect(promise).to.be.an.instanceOf(Promise);
        });
    });
});
