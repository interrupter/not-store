const path = require("node:path");
const notStoreProcessors = require("../../../../src/store.processors.cjs");

const notError = require("not-error/src/error.node.cjs");
const ReadableStream = require("node:stream");
const expect = require("chai").expect;
const notStoreDriverTimeweb = require("../../../../src/drivers/timeweb/timeweb.driver.cjs");
const {
    notStoreExceptionDeleteFromStoreError,
    notStoreExceptionDirectUploadError,
    notStoreExceptionDirectDeleteError,
    notStoreExceptionDirectListError,
} = require("../../../../src/exceptions/driver.exceptions.cjs");

const {
    notStoreDriverStreamerExceptionFileNotExists,
} = require("../../../../src/exceptions/driver.streamer.exception.cjs");

describe("notStoreDriverTimeweb", () => {
    const STORE_NAME = "test_store_root";

    const TEST_STORE = {
        accessKeyId: "ENV$TIMEWEB_BUCKET_ID",
        secretAccessKey: "ENV$TIMEWEB_BUCKET_KEY",
        endpoint: "https://s3.timeweb.com",
        s3ForcePathStyle: true,
        region: "ru-1",
        apiVersion: "latest",
        bucket: "ENV$TIMEWEB_BUCKET_NAME",
        pathToStoreRoot: "ENV$TIMEWEB_BUCKET_PATH",
        tmp: "/var/tmp",
        groupFiles: false,
    };

    const FILES_TO_UPLOAD = ["alps_1.jpg", "alps_2.jpg", "alps_3.jpg"].map(
        (name) => __dirname + "/../../../browser/files/" + name
    );

    const FILES_TO_UPLOAD_2 = ["castle_1.jpg", "castle_2.jpg"].map(
        (name) => __dirname + "/../../../browser/files/" + name
    );

    describe("getDescription", () => {
        it("is static method", () => {
            const descr = notStoreDriverTimeweb.getDescription();
            expect(descr).to.have.all.keys(["id", "title", "ui", "actions"]);
        });
    });

    describe("name", () => {
        it("getter method", () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            expect(store.name).to.be.equal(STORE_NAME);
        });
    });

    describe("getDefaultOptions", () => {
        it("is static static ", () => {
            const options = notStoreDriverTimeweb.getDefaultOptions();
            expect(options).to.have.all.keys([
                "ACL",
                "accessKeyId",
                "secretAccessKey",
                "apiVersion",
                "endpoint",
                "region",
                "s3ForcePathStyle",
                "bucket",
                "pathToStoreRoot",
                "tmp",
                "groupFiles",
            ]);
        });
    });

    describe("createS3Options", () => {
        it("options grabs values from ENVs", () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const options = store.createS3Options();
            expect(options.accessKeyId).to.be.equal(
                process.env.TIMEWEB_BUCKET_ID
            );
            expect(options.secretAccessKey).to.be.equal(
                process.env.TIMEWEB_BUCKET_KEY
            );
            expect(store.getOptionValueCheckENV("pathToStoreRoot")).to.be.equal(
                process.env.TIMEWEB_BUCKET_PATH
            );
            expect(store.getOptionValueCheckENV("bucket")).to.be.equal(
                process.env.TIMEWEB_BUCKET_NAME
            );
        });
    });

    describe("getDirectUploadParams", () => {
        it("types of object props", async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const fileParams = await store.getDirectUploadParams(
                FILES_TO_UPLOAD[0],
                path.basename(FILES_TO_UPLOAD[0])
            );
            expect(fileParams).to.have.all.keys(["Bucket", "Key", "Body"]);
            expect(typeof fileParams.Bucket).to.be.equal("string");
            expect(typeof fileParams.Key).to.be.equal("string");
            expect(fileParams.Body).to.be.instanceOf(ReadableStream);
            //
            expect(fileParams.Key).to.be.equal("test/alps_1.jpg");
        });

        it("file is not exists", (done) => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            store
                .getDirectUploadParams(
                    FILES_TO_UPLOAD[0] + ".fake",
                    store.resolvePath(FILES_TO_UPLOAD[0])
                )
                .then(() => {
                    done(new Error("Should throw error, but worked out fine"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreDriverStreamerExceptionFileNotExists
                    );
                    done();
                });
        });
    });

    describe("directUpload", () => {
        const FILE_NAME = FILES_TO_UPLOAD[0];
        it("upload file", async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const result = await store.directUpload(
                FILE_NAME,
                store.resolvePath(FILE_NAME)
            );
            expect(result).to.have.all.keys([
                "ETag",
                "Location",
                "Local",
                "key",
                "Key",
                "Bucket",
            ]);
        });

        it("upload file failed, file is not exist", (done) => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            store
                .directUpload(FILE_NAME + ".fake", store.resolvePath(FILE_NAME))
                .then(() => {
                    done(new Error("Should throw error, but worked out fine"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreDriverStreamerExceptionFileNotExists
                    );
                    done();
                });
        });

        it("upload file failed, API creds not valid", (done) => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE, secretAccessKey: "" },
                {},
                STORE_NAME
            );
            store
                .directUpload(FILE_NAME, store.resolvePath(FILE_NAME))
                .then(() => {
                    done(new Error("Should throw error, but worked out fine"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreExceptionDirectUploadError
                    );
                    done();
                });
        });
    });

    describe("directUploadMany", () => {
        it("not empty list of existing files", async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            await store.directUploadMany(FILES_TO_UPLOAD);
        });
    });

    describe("transformDirectUploadResultsToObject", () => {
        it("transformed, all keys except `Local` preserved", async () => {
            const results = [
                {
                    Local: "local1",
                    Location: "1",
                    Key: "2",
                    ETag: "3",
                    Bucket: "4",
                    key: "5",
                },
            ];
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const res = store.transformDirectUploadResultsToObject(results);
            expect(res).to.have.all.keys(["local1"]);
            expect(res.local1).to.have.all.keys([
                "Location",
                "key",
                "Key",
                "ETag",
                "Bucket",
            ]);
        });
    });

    describe("directUploadManyTransformed", () => {
        it("not empty list of existing files", async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const results = await store.directUploadManyTransformed(
                FILES_TO_UPLOAD
            );
            expect(results).to.have.all.keys(FILES_TO_UPLOAD);
        });
    });

    describe("upload", () => {
        it("invalid API creds", async () => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE, secretAccessKey: "" },
                {},
                STORE_NAME
            );
            const res = await store.upload("test/alps_1.jpuk");
            expect(res).to.be.instanceOf(notStoreExceptionDirectUploadError);
        });

        it("file uploaded", async () => {
            notStoreProcessors.setProcessor(
                "uploadPre",
                class {
                    static async run(filename, metadata, options, driver) {
                        metadata.pre = true;
                        metadata.counter++;
                    }
                }
            );
            notStoreProcessors.setProcessor(
                "uploadPost",
                class {
                    static async run(filename, metadata, options, driver) {
                        metadata.post = true;
                        metadata.counter++;
                    }
                }
            );
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE },
                {
                    upload: {
                        pre: [{ name: "uploadPre" }],
                        post: [{ name: "uploadPost" }],
                    },
                },
                STORE_NAME
            );
            const res = await store.upload(FILES_TO_UPLOAD[0], { counter: 0 });

            expect(Array.isArray(res)).to.be.true;
            const [result, info] = res;
            expect(result).to.have.all.keys([
                "ETag",
                "Location",
                "key",
                "Local",
                "Key",
                "Bucket",
            ]);
            expect(info).to.have.all.keys([
                "uuid",
                "name_tmp",
                "size",
                "pre",
                "post",
                "counter",
                "path",
                "cloud",
            ]);
            expect(info.pre).to.be.true;
            expect(info.post).to.be.true;
            expect(info.counter).to.be.equal(2);
        });
    });

    describe("directDelete", () => {
        it("invalid API creds", (done) => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE, secretAccessKey: "" },
                {},
                STORE_NAME
            );
            store
                .directDelete("test/alps_1.jpuk")
                .then(() => {
                    done(new Error("Should throw error, but worked out fine"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreExceptionDirectDeleteError
                    );
                    done();
                });
        });

        it("file not exists", async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const res = await store.directDelete("test/alps_1.jpuk");
            expect(res).to.be.deep.equal({});
        });
        it("file exists", async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const res = await store.directDelete("test/alps_1.jpg");
            expect(res).to.be.deep.equal({});
        });
    });

    describe("delete", () => {
        before(async () => {
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const result = await store.directUpload(
                FILES_TO_UPLOAD_2[0],
                store.resolvePath(FILES_TO_UPLOAD_2[0])
            );
        });

        it("invalid API creds", async () => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE, secretAccessKey: "" },
                {},
                STORE_NAME
            );
            const err = await store.delete("alps_1.jpuk");
            expect(err).to.be.instanceOf(notStoreExceptionDirectDeleteError);
        });

        it("removes file from storage", async () => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE },
                {},
                STORE_NAME
            );
            const res = await store.delete(path.basename(FILES_TO_UPLOAD_2[0]));
            expect(Array.isArray(res)).to.be.true;
        });

        it("filePath is undefined, skips directDelete", async () => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE },
                {},
                STORE_NAME
            );
            const res = await store.delete();
            expect(Array.isArray(res)).to.be.true;
            expect(Array.isArray(res[0])).to.be.false;
        });
    });

    describe("directList", () => {
        it("invalid API creds", (done) => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE, secretAccessKey: "" },
                {},
                STORE_NAME
            );
            store
                .directList("test")
                .then(() => {
                    done(new Error("Should throw error, but worked out fine"));
                })
                .catch((e) => {
                    expect(e).to.be.instanceOf(
                        notStoreExceptionDirectListError
                    );
                    done();
                });
        });

        it("path not exists", async () => {
            const prefix = "test1/";
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const res = await store.directList(prefix);
            expect(res.length).to.be.equal(0);
        });

        it("path exists", async () => {
            const prefix = "test/";
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const res = await store.directList(prefix);
            expect(res.length).to.be.gt(1);
        });
    });

    describe("list", () => {
        it("invalid API creds", async () => {
            const store = new notStoreDriverTimeweb(
                { ...TEST_STORE, secretAccessKey: "" },
                {},
                STORE_NAME
            );
            const result = await store.list("test");
            expect(result).to.be.instanceOf(notError);
        });

        it("path not exists", async () => {
            const prefix = "test1/";
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const [result, meta] = await store.list(prefix);
            expect(result.length).to.be.equal(0);
            expect(meta).to.be.deep.equal({});
        });

        it("path exists", async () => {
            const prefix = "test/";
            const store = new notStoreDriverTimeweb(TEST_STORE, {}, STORE_NAME);
            const [result, meta] = await store.list(prefix);
            expect(result.length).to.be.gt(1);
            expect(meta).to.be.deep.equal({});
        });

        it("exception", async () => {
            const prefix = "test/";
            const store = new notStoreDriverTimeweb(
                TEST_STORE,
                {
                    list: {
                        pre: [
                            class {
                                static async run() {
                                    throw new Error("some_generic");
                                }
                            },
                        ],
                    },
                },
                STORE_NAME
            );
            const err = await store.list(prefix);
            expect(err).to.be.instanceOf(notError);
        });

        it("meta object is modified by processors", async () => {
            notStoreProcessors.setProcessor(
                "listPre",
                class {
                    static async run(filename, metadata, options, driver) {
                        metadata.pre = true;
                        metadata.counter++;
                    }
                }
            );
            notStoreProcessors.setProcessor(
                "listPost",
                class {
                    static async run(filename, metadata, options, driver) {
                        metadata.post = true;
                        metadata.counter++;
                    }
                }
            );
            const prefix = "test/";
            const store = new notStoreDriverTimeweb(
                TEST_STORE,
                {
                    list: {
                        pre: [{ name: "listPre" }],
                        post: [{ name: "listPost" }],
                    },
                },
                STORE_NAME
            );
            const [result, metadata] = await store.list(prefix, { counter: 0 });
            expect(result.length).to.be.greaterThan(0);
            expect(metadata.pre).to.be.true;
            expect(metadata.post).to.be.true;
            expect(metadata.counter).to.be.equal(2);
        });
    });
});
