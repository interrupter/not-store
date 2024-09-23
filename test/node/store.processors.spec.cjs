const notStoreProcessors = require("../../src/store.processors.cjs");
const notStoreProcessor = require("../../src/proto/processor.cjs");
const notStoreProcessorTest = require("../../src/processors/test.cjs");
const { notError } = require("not-error/src/index.cjs");

const {
    notStoreExceptionProcessorRunError,
    notStoreExceptionProcessorIsNotExists,
    notStoreExceptionProcessorAlreadyExists,
} = require("../../src/exceptions.cjs");

const { expect } = require("chai");

describe("Proto/notStoreProcessors", () => {
    describe("setProcessor", () => {
        it("already exists with such name, throws", () => {
            const func = () => {
                notStoreProcessors.setProcessor(
                    "test",
                    class extends notStoreProcessor {}
                );
            };
            expect(func).to.throw(notStoreExceptionProcessorAlreadyExists);
        });

        it("set without throwing", () => {
            notStoreProcessors.setProcessor(
                "test_not_exists",
                class extends notStoreProcessor {}
            );
        });
    });

    describe("getProcessor", () => {
        it("exists", () => {
            const proc = notStoreProcessors.getProcessor("test");
            expect(proc).to.be.deep.equal(notStoreProcessorTest);
        });

        it("not exists", () => {
            const func = () => {
                notStoreProcessors.getProcessor("test1");
            };
            expect(func).to.throw(notStoreExceptionProcessorIsNotExists);
        });
    });

    describe("list", () => {
        it("get list of descriptions", () => {
            const list = notStoreProcessors.list();
            expect(
                list.every((proc) => {
                    return proc.id;
                })
            ).to.be.true;
        });
    });

    describe("getDefaultProcessorOptions", () => {
        it("test proc probed", () => {
            const opts = notStoreProcessors.getDefaultProcessorOptions("test");
            expect(opts).to.be.ok;
            expect(opts).to.have.all.keys(["processed"]);
        });
    });

    describe("run", () => {
        it("throws Error", async () => {
            notStoreProcessors.setProcessor(
                "test_throws_error",
                class extends notStoreProcessor {
                    static async run() {
                        throw new Error("error_message");
                    }
                }
            );
            try {
                await notStoreProcessors.run(
                    [
                        {
                            name: "test_throws_error",
                            options: {},
                        },
                    ],
                    "file.ext",
                    { name: "some_driver" }
                );
                throw new Error("not throwed expected exception");
            } catch (e) {
                expect(e).to.be.instanceof(notStoreExceptionProcessorRunError);
            }
        });

        it("throws notError", (done) => {
            notStoreProcessors.setProcessor(
                "test_throws_not_error",
                class extends notStoreProcessor {
                    static async run() {
                        throw new notError("error_message");
                    }
                }
            );
            notStoreProcessors
                .run(
                    [
                        {
                            name: "test_throws_not_error",
                            options: {},
                        },
                    ],
                    "file.ext",
                    {},
                    { name: "some_driver" }
                )
                .then(() => {
                    done(new Error("not throwed expected exception"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceof(notError);
                    done();
                });
        });

        it("pipeline list is not array", (done) => {
            notStoreProcessors
                .run(Math.random(), "file.ext", {}, { name: "some_driver" })
                .then(() => {
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });
    });
});
