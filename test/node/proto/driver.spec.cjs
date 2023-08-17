const { Buffer } = require("node:buffer");
const fs = require("node:fs");

const URL_TO_TEST = "https://www.ya.ru/";
const URL_TO_TEST2 = "http://www.ya.ru/";
const TEST_FILE = "/var/server/ns/test/test.file.txt";
const TEST_FILE_TO_REMOVE = "/var/server/ns/test/tmp/to.remove.test.file";

const STRING =
    "12341234123412f35434f89182375ybg0983176591387 b598137v 03189745yv093874y5098 v13y40589vn 1y034985yv109834y50v918y340589v1y 09348 y091834y50 19834059b n1039485y bv109384b5 n091834u b518093u4509b81u340b n891345u0b9183u4b591 u34p589b13948 bn190384u5b n91834u5b9183u45b 10983u4b512341234123412f35434f89182375ybg0983176591387 b598137v 03189745yv093874y5098 v13y40589vn 1y034985yv109834y50v918y340589v1y 09348 y091834y50 19834059b n1039485y bv109384b5 n091834u b518093u4509b81u340b n891345u0b9183u4b591 u34p589b13948 bn190384u5b n91834u5b9183u45b 10983u4b5";
const {
    notStoreExceptionFilenameIsTooShortToGeneratePrefix,
} = require("../../../src/exceptions/driver.exceptions.cjs");

const UUID = "cfeb519f-57bd-4f55-a72c-4847b6b839d0";
const path = require("node:path");

const CONSTS = require("../../../src/const.cjs");

const notStoreDriverProcessors = require("../../../src/proto/driver.processors.cjs");
const notStoreDriver = require("../../../src/proto/driver.cjs"),
    expect = require("chai").expect;

describe("Proto/Driver", function () {
    describe("static getDescription", function () {
        it("all keys presented", function () {
            const desc = notStoreDriver.getDescription();
            expect(desc).to.have.all.keys(["id", "title", "ui", "actions"]);
        });
    });

    describe("options getter", () => {
        it("not set", () => {
            const store = new notStoreDriver();
            expect(store.options).to.be.deep.equal({});
        });

        it("set", () => {
            const opts = { some: "value" };
            const store = new notStoreDriver(opts);
            expect(store.options).to.be.deep.equal(opts);
        });
    });

    describe("getOptionValueCheckENV", () => {
        it("property is not set in options, default checks options, return undefined", () => {
            const options = {
                some: 1,
                other: false,
            };
            const store = new notStoreDriver(options);
            const res = store.getOptionValueCheckENV("some_fake_property");
            expect(res).to.be.undefined;
        });

        it("property is in options, not corresponding to process.envs, default checks options, return property value", () => {
            const options = {
                some: 1,
                other: false,
            };
            const store = new notStoreDriver(options);
            const res = store.getOptionValueCheckENV("some");
            expect(res).to.be.equal(1);
        });

        it("property is in options, corresponding to process.envs, envs is not set, default checks options, return property value", () => {
            const options = {
                some: 1,
                other: "ENV$property_some",
            };
            const store = new notStoreDriver(options);
            const res = store.getOptionValueCheckENV("other");
            expect(res).to.be.equal(options.other);
        });

        it("property is in options, corresponding to process.envs, envs is set, default checks options, return property value", () => {
            const testValue = "test";
            const options = {
                some: 1,
                other: "ENV$NODE_ENV",
            };
            const store = new notStoreDriver(options);
            const res = store.getOptionValueCheckENV("other");
            expect(res).to.be.equal(testValue);
        });
    });

    describe("resolvePrefixDir", () => {
        it("file name is longer than prefix", () => {
            const fname = "12341235324523AAFASDF.jpg";
            expect(new notStoreDriver().resolvePrefixDir(fname)).to.be.equal(
                "123"
            );
        });

        it("file name is shorter than prefix", () => {
            const fname = "12.jpg";
            expect(() => {
                new notStoreDriver().resolvePrefixDir(fname);
            }).to.be.throw(notStoreExceptionFilenameIsTooShortToGeneratePrefix);
        });
    });

    describe("resolvePathInStore", () => {
        it("options.path is set, options.groupFiles = true", () => {
            const store = new notStoreDriver({
                path: "store-1",
                groupFiles: true,
            });
            const filename = "1234567890.jpg";
            const pathInStore = store.resolvePathInStore(filename);
            expect(pathInStore).to.be.equal("store-1/123");
        });

        it("options.path not set, options.groupFiles = true", () => {
            const store = new notStoreDriver({
                groupFiles: true,
            });
            const filename = "1234567890.jpg";
            const pathInStore = store.resolvePathInStore(filename);
            expect(pathInStore).to.be.equal("123");
        });

        it("options.path set, options.groupFiles = false", () => {
            const store = new notStoreDriver({
                path: "store-1",
                groupFiles: false,
            });
            const filename = "1234567890.jpg";
            const pathInStore = store.resolvePathInStore(filename);
            expect(pathInStore).to.be.equal("store-1");
        });
        it("options.path not set, options.groupFiles = false", () => {
            const store = new notStoreDriver({
                groupFiles: false,
            });
            const filename = "1234567890.jpg";
            const pathInStore = store.resolvePathInStore(filename);
            expect(pathInStore).to.be.equal("");
        });
    });

    describe("uuid", () => {
        it("UUIDv4", () => {
            const regexExp =
                /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
            const uuid = new notStoreDriver().uuid();
            expect(regexExp.test(uuid)).to.be.true;
        });
    });

    describe("resolveFilename", () => {
        it("undefined postfix, undefined format", () => {
            const uuid = UUID;
            const postfix = undefined;
            const format = undefined;
            const filename = new notStoreDriver().resolveFilename(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(uuid);
        });

        it("empty postfix, undefined format", () => {
            const uuid = UUID;
            const postfix = "";
            const format = undefined;
            const filename = new notStoreDriver().resolveFilename(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(uuid);
        });

        it("empty postfix, empty format", () => {
            const uuid = UUID;
            const postfix = "";
            const format = "";
            const filename = new notStoreDriver().resolveFilename(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(uuid);
        });

        it("not empty postfix, empty format", () => {
            const uuid = UUID;
            const postfix = "main";
            const format = "";
            const filename = new notStoreDriver().resolveFilename(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(`${uuid}-${postfix}`);
        });

        it("empty postfix, not empty format", () => {
            const uuid = UUID;
            const postfix = "";
            const format = "jpg";
            const filename = new notStoreDriver().resolveFilename(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(`${uuid}.${format}`);
        });

        it("not empty postfix, not empty format", () => {
            const uuid = UUID;
            const postfix = "main";
            const format = "jpg";
            const filename = new notStoreDriver().resolveFilename(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(`${uuid}-${postfix}.${format}`);
        });
    });

    describe("getFileSize", () => {
        it("file not exists", async () => {
            const fname = "name.my.flie";
            try {
                const size = await new notStoreDriver().getFileSize(fname);
                expect(true).to.be.false;
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });

        it("file exists and not empty", async () => {
            const size = await new notStoreDriver().getFileSize(__filename);
            expect(size).to.be.a("number");
            expect(size).to.be.greaterThan(100);
        });
    });

    describe("resolveFullFilenameInStore", () => {
        it("options.path is set, options.groupFiles = false, postfix = undefined, format = undefined", () => {
            const uuid = UUID;
            const postfix = undefined;
            const format = undefined;
            const store = new notStoreDriver({
                path: "store-1",
                groupFiles: false,
            });
            const filename = store.resolveFullFilenameInStore(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(`store-1/${uuid}`);
        });

        it("options.path is set, options.groupFiles = true, postfix = undefined, format = undefined", () => {
            const uuid = UUID;
            const postfix = undefined;
            const format = undefined;
            const store = new notStoreDriver({
                path: "store-1",
                groupFiles: true,
            });
            const filename = store.resolveFullFilenameInStore(
                uuid,
                postfix,
                format
            );
            expect(filename).to.be.equal(`store-1/cfe/${uuid}`);
        });
    });

    describe("resolveVariantFilename", () => {
        it("variant short name is not empty", () => {
            const filename = "/some/path/to/a/file.ext";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantFilename(
                parts,
                "main"
            );
            expect(variantFilename).to.be.equal("file-main.ext");
        });

        it("variant short name is empty", () => {
            const filename = "/some/path/to/a/file.ext";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantFilename(
                parts,
                ""
            );
            expect(variantFilename).to.be.equal("file.ext");
        });

        it("variant short name is empty, extensionless filename", () => {
            const filename = "/some/path/to/a/file";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantFilename(
                parts,
                ""
            );
            expect(variantFilename).to.be.equal("file");
        });
    });

    describe("resolveVariantPath", () => {
        it("variant short name is not empty", () => {
            const filename = "/some/path/to/a/file.ext";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantPath(
                parts,
                "main"
            );
            expect(variantFilename).to.be.equal(
                "/some/path/to/a/file-main.ext"
            );
        });

        it("variant short name is empty", () => {
            const filename = "/some/path/to/a/file.ext";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantPath(
                parts,
                ""
            );
            expect(variantFilename).to.be.equal("/some/path/to/a/file.ext");
        });

        it("variant short name is empty, extensionless filename", () => {
            const filename = "/some/path/to/a/file";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantPath(
                parts,
                ""
            );
            expect(variantFilename).to.be.equal("/some/path/to/a/file");
        });

        it("variant short name is empty, no directory", () => {
            const filename = "file.ext";
            const parts = path.parse(filename);
            const variantFilename = new notStoreDriver().resolveVariantPath(
                parts,
                ""
            );
            expect(variantFilename).to.be.equal("file.ext");
        });
    });

    describe("resolveVariantsPaths", () => {
        it("format is empty", () => {
            const variants = {
                small: { variant: true },
                big: { variant: "dog" },
            };
            const filename = "/some/path/file.ext";
            const result = new notStoreDriver().resolveVariantsPaths(
                filename,
                variants
            );
            expect(result).to.have.all.keys(["small", "big"]);
            expect(result.small).to.have.all.keys([
                "variant",
                "local",
                "filename",
            ]);
            expect(result.small.variant).to.be.deep.equal({ variant: true });
            expect(result.small.local).to.be.equal("/some/path/file-small.ext");
            expect(result.small.filename).to.be.equal("file-small.ext");
            expect(result.big.variant).to.be.deep.equal({ variant: "dog" });
            expect(result.big.local).to.be.equal("/some/path/file-big.ext");
            expect(result.big.filename).to.be.equal("file-big.ext");
        });

        it("format is not empty", () => {
            const variants = {
                small: { variant: true },
                big: { variant: "dog" },
            };
            const filename = "/some/path/file.ext";
            const format = "png";
            const result = new notStoreDriver().resolveVariantsPaths(
                filename,
                variants,
                format
            );
            expect(result).to.have.all.keys(["small", "big"]);
            expect(result.small).to.have.all.keys([
                "variant",
                "local",
                "filename",
            ]);
            expect(result.small.variant).to.be.deep.equal({ variant: true });
            expect(result.small.local).to.be.equal("/some/path/file-small.png");
            expect(result.small.filename).to.be.equal("file-small.png");
            expect(result.big.variant).to.be.deep.equal({ variant: "dog" });
            expect(result.big.local).to.be.equal("/some/path/file-big.png");
            expect(result.big.filename).to.be.equal("file-big.png");
        });
    });

    describe("resolveVariantsFilenames", () => {
        it("addOriginal = false", () => {
            const addOriginal = false;
            const uuid = UUID;
            const variants = {
                small: { variant: true },
                big: { variant: "dog" },
            };
            const format = "png";
            const result = new notStoreDriver().resolveVariantsFilenames(
                uuid,
                variants,
                format,
                addOriginal
            );
            expect(result).to.have.all.keys(["small", "big"]);
            expect(result.small).to.be.equal(`${uuid}-small.png`);
            expect(result.big).to.be.equal(`${uuid}-big.png`);
        });

        it("addOriginal = true", () => {
            const addOriginal = true;
            const uuid = UUID;
            const variants = {
                small: { variant: true },
                big: { variant: "dog" },
            };
            const format = "png";
            const result = new notStoreDriver().resolveVariantsFilenames(
                uuid,
                variants,
                format,
                addOriginal
            );
            expect(result).to.have.all.keys(["small", "big", "original"]);
            expect(result.small).to.be.equal(`${uuid}-small.png`);
            expect(result.big).to.be.equal(`${uuid}-big.png`);
            expect(result.original).to.be.equal(`${uuid}.png`);
        });

        it("addOriginal = true as a default value", () => {
            const uuid = UUID;
            const variants = {
                small: { variant: true },
                big: { variant: "dog" },
            };
            const format = "png";
            const result = new notStoreDriver().resolveVariantsFilenames(
                uuid,
                variants,
                format
            );
            expect(result).to.have.all.keys(["small", "big", "original"]);
            expect(result.small).to.be.equal(`${uuid}-small.png`);
            expect(result.big).to.be.equal(`${uuid}-big.png`);
            expect(result.original).to.be.equal(`${uuid}.png`);
        });
    });

    describe("accessors processors", () => {
        it("get", () => {
            const store = new notStoreDriver({}, {});
            expect(store.processors).instanceOf(notStoreDriverProcessors);
        });
    });

    describe("stashFile", () => {
        it("string, as file, long string", async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const result = await store.stashFile(STRING);
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it("string, as file, short string", async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const result = await store.stashFile("hello");
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it(`string, as full file name`, async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const result = await store.stashFile(TEST_FILE);
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it(`string, as https URL (${URL_TO_TEST})`, async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const result = await store.stashFile(URL_TO_TEST);
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it(`string, as http URL (${URL_TO_TEST2})`, async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const result = await store.stashFile(URL_TO_TEST2);
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it("Buffer", async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const buf = Buffer.from(STRING, "utf8");
            const result = await store.stashFile(buf);
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it("Readable Stream", async () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            const streamIn = fs.createReadStream(TEST_FILE);
            const result = await store.stashFile(streamIn);
            expect(result).to.have.all.keys(["uuid", "name_tmp"]);
        });

        it("not convertable to stream", () => {
            const store = new notStoreDriver({
                tmp: "/var/server/ns/test/tmp",
            });
            store
                .stashFile(undefined)
                .then((res) => {
                    expect(res).to.be.undefined;
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreDriverStreamerExceptionNotStreamableSource
                    );
                });
        });
    });

    describe("removeFile", () => {
        it("file exists", async () => {
            const store = new notStoreDriver();
            const res = await store.removeFile(TEST_FILE_TO_REMOVE);
            expect(res).to.be.equal(0);
        });

        it("file not exists", async () => {
            const store = new notStoreDriver();
            const res = await store.removeFile(TEST_FILE_TO_REMOVE + "00");
            expect(res).to.be.instanceof(Error);
        });
    });

    describe("test", () => {
        it("overall functional test", async () => {
            const store = new notStoreDriver();
            await store.test();
        });
    });
});
