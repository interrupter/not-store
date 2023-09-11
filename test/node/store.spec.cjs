const expect = require("chai").expect;

const notStore = require("../../src/store.cjs");
const notStoreConfigReader = require("../../src/proto/config.reader.cjs");

const DEFAULT_CONFIG_READER = require("../../src/config.readers/not-store.reader.cjs");
const DEFAULT_DRIVERS = require("../../src/drivers/index.cjs");

const {
    notStoreExceptionDriverAlreadyExists,
    notStoreExceptionDriverIsNotExists,
} = require("../../src/exceptions.cjs");

class TEST_CONFIG_READER extends notStoreConfigReader {
    static async for() {
        return {};
    }
}

describe("notStore", () => {
    describe("setConfigReader", () => {
        it("set default", () => {
            notStore.setConfigReader(DEFAULT_CONFIG_READER);
        });
    });

    describe("setDriver", () => {
        it("set one of default - should throw", () => {
            const func = () => {
                notStore.setDriver(Object.keys(DEFAULT_DRIVERS)[0], undefined);
            };
            expect(func).to.throw(notStoreExceptionDriverAlreadyExists);
        });

        it("set new one - should't throw", () => {
            const func = () => {
                notStore.setDriver("new_one", {
                    getDescription() {
                        return {
                            id: "new_one",
                        };
                    },
                });
            };
            expect(func).not.to.throw(notStoreExceptionDriverAlreadyExists);
        });
    });

    describe("listDrivers", () => {
        it("should contain all default drivers", () => {
            const drivers = notStore.listDrivers();
            expect(drivers).to.be.instanceOf(Array);
            expect(
                Object.keys(DEFAULT_DRIVERS).every((driver_id) => {
                    return drivers.some((driver) => driver.id === driver_id);
                })
            ).to.be.ok;
        });
    });

    describe("listProcessors", () => {
        it("should be array with object having property called 'id'", () => {
            const procs = notStore.listProcessors();
            expect(procs).to.be.instanceOf(Array);
            expect(Object.values(procs).every((proc) => proc.id)).to.be.ok;
        });
    });

    describe("getDriverForConfig", () => {
        it("should throw, driver not exist", () => {
            const func = () => {
                notStore.getDriverForConfig({ driver: "fake_driver" });
            };
            expect(func).to.throw(notStoreExceptionDriverIsNotExists);
        });

        it("should return store, driver exist", () => {
            const store = notStore.getDriverForConfig(
                { driver: "local", options: {}, processors: {} },
                "local_fs"
            );
            expect(store).to.be.instanceOf(DEFAULT_DRIVERS.local);
        });
    });

    describe("get", () => {
        before(() => {
            notStore.setConfigReader(TEST_CONFIG_READER);
        });

        it("should throw, driver not exist", (done) => {
            notStore
                .get({ driver: "fake_driver" })
                .then(() => {
                    done(new Error("should throw"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreExceptionDriverIsNotExists
                    );
                    done();
                });
        });

        after(() => {
            notStore.setConfigReader(DEFAULT_CONFIG_READER);
        });
    });
});
