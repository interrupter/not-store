const notStoreDriverProcessors = require("../../../src/proto/driver.processors.cjs");

const expect = require("chai").expect;

describe("Proto/DriverProcessors", function () {
    describe("isSet", () => {
        it("not set", () => {
            const processors = new notStoreDriverProcessors({
                delete: {
                    pre: [],
                },
            });
            expect(processors.isSet("pre", "delete")).to.be.false;
        });

        it("set", () => {
            const processors = new notStoreDriverProcessors({
                delete: {
                    pre: [async () => {}],
                },
            });
            expect(processors.isSet("pre", "delete")).to.be.true;
        });
    });

    describe("get", () => {
        it("accessor", () => {
            const pipeline = [async () => {}, async () => {}];
            const processors = new notStoreDriverProcessors({
                delete: {
                    pre: pipeline,
                },
            });
            expect(processors.get("pre", "delete")).to.be.deep.equal(pipeline);
        });
    });

    describe("run", () => {
        it("empty pipeline", (done) => {
            new notStoreDriverProcessors({})
                .run("pre", "delete", {}, {})
                .then(() => done())
                .catch(done);
        });

        it("not empty pipeline", (done) => {
            const filePath = "file.ext";
            const file = { path: filePath, info: {} };
            const driver = Math.random();
            new notStoreDriverProcessors({
                delete: {
                    pre: [
                        {
                            name: "test",
                            options: {
                                processed: true,
                            },
                        },
                    ],
                },
            })
                .run("pre", "delete", file, driver)
                .then(() => {
                    console.log(file);
                    expect(file.path).to.be.equal(filePath);
                    expect(file.info.options.processed).to.be.true;
                    expect(file.info.driver).to.be.deep.equal(driver);
                    done();
                })
                .catch(done);
        });
    });

    describe("runPre", () => {
        it("empty pipeline", (done) => {
            new notStoreDriverProcessors({})
                .runPre("delete")
                .then(() => done())
                .catch(done);
        });

        it("not empty pipeline", (done) => {
            const filePath = "file.ext";
            const file = { path: filePath, info: {} };
            const driver = Math.random();
            new notStoreDriverProcessors({
                delete: {
                    pre: [
                        {
                            name: "test",
                            options: {
                                processed: true,
                            },
                        },
                    ],
                },
            })
                .runPre("delete", file, driver)
                .then(() => {
                    expect(file.path).to.be.equal(filePath);
                    expect(file.info.options.processed).to.be.true;
                    expect(file.info.driver).to.be.deep.equal(driver);
                    done();
                })
                .catch(done);
        });
    });

    describe("runPost", () => {
        it("empty pipeline", (done) => {
            new notStoreDriverProcessors({})
                .runPost("delete")
                .then(() => done())
                .catch(done);
        });

        it("not empty pipeline", (done) => {
            const filePath = "file.ext";
            const file = { path: filePath, info: {} };
            const driver = Math.random();
            new notStoreDriverProcessors({
                delete: {
                    post: [
                        {
                            name: "test",
                            options: {
                                processed: true,
                            },
                        },
                    ],
                },
            })
                .runPost("delete", file, driver)
                .then(() => {
                    expect(file.path).to.be.equal(filePath);
                    expect(file.info.options.processed).to.be.true;
                    expect(file.info.driver).to.be.deep.equal(driver);
                    done();
                })
                .catch(done);
        });
    });
});
