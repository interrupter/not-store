const expect = require("chai").expect;
const { v4: uuidv4 } = require("uuid");
const notStoreDriverFilenameResolver = require("../../../src/proto/driver.filename.resolver.cjs");
const {
    notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix,
} = require("../../../src/exceptions/driver.exceptions.cjs");

const {
    FIRST_DIR_NAME_LENGTH,
    DEFAULT_FILENAME_SPLIT,
} = require("../../../src/const.cjs");

describe("Proto/notStoreDriverFilenameResolver", function () {
    describe("composeGroupDir", function () {
        it("filename is long", () => {
            const fname = "dest.filename.ext";
            const groupDir =
                notStoreDriverFilenameResolver.composeGroupDir(fname);
            expect(groupDir).to.be.equal("des");
        });

        it("filename is short", () => {
            const fname = "de.ext";
            const t = () => {
                notStoreDriverFilenameResolver.composeGroupDir(fname);
            };
            expect(t).to.throw(
                notStoreExceptionFilenameIsTooShortToGenerateGroupPrefix
            );
        });
    });

    describe("resolvePath", function () {
        it("options is not set", () => {
            const dirname = "some/dir/name";
            const result = notStoreDriverFilenameResolver.resolvePath(dirname);
            expect(dirname).to.be.equal(result);
        });

        it("options path is not set", () => {
            const dirname = "some/dir/name";
            const result = notStoreDriverFilenameResolver.resolvePath(
                dirname,
                {}
            );
            expect(dirname).to.be.equal(result);
        });

        it("options path is set", () => {
            const dirname = "some/dir/name";
            const options = { path: "root/path" };
            const result = notStoreDriverFilenameResolver.resolvePath(
                dirname,
                options
            );
            expect(`${options.path}/${dirname}`).to.be.equal(result);
        });
    });

    describe("composePathToFile", function () {
        it("filename is set, options.path=undefined, options.groupFiles=false", () => {
            const filename = "some.file-name.ext";
            const options = {
                path: undefined,
                groupFiles: false,
            };
            const result = notStoreDriverFilenameResolver.composePathToFile(
                filename,
                options
            );
            expect(result).to.be.equal("");
        });

        it("filename is set, options.path=undefined, options.groupFiles=true", () => {
            const filename = "some.file-name.ext";
            const options = {
                path: undefined,
                groupFiles: true,
            };
            const result = notStoreDriverFilenameResolver.composePathToFile(
                filename,
                options
            );
            expect(result).to.be.equal("som");
        });

        it("filename is set, options.path=subdir, options.groupFiles=true", () => {
            const filename = "some.file-name.ext";
            const options = {
                path: "subdir",
                groupFiles: true,
            };
            const result = notStoreDriverFilenameResolver.composePathToFile(
                filename,
                options
            );
            expect(result).to.be.equal("subdir/som");
        });

        it("filename is set, options.path=subdir, options.groupFiles=false", () => {
            const filename = "some.file-name.ext";
            const options = {
                path: "subdir",
                groupFiles: false,
            };
            const result = notStoreDriverFilenameResolver.composePathToFile(
                filename,
                options
            );
            expect(result).to.be.equal("subdir");
        });
    });

    describe("composeFilename", function () {
        const uuid = uuidv4();
        it(`uuid=${uuid}, postfix='', format=''`, () => {
            const postfix = "";
            const format = "";
            const result = notStoreDriverFilenameResolver.composeFilename(
                uuid,
                postfix,
                format
            );
            expect(result).to.be.equal(`${uuid}`);
        });

        it(`uuid=${uuid}, postfix='data', format=''`, () => {
            const postfix = "data";
            const format = "";
            const result = notStoreDriverFilenameResolver.composeFilename(
                uuid,
                postfix,
                format
            );
            expect(result).to.be.equal(`${uuid}${DEFAULT_FILENAME_SPLIT}data`);
        });

        it(`uuid=${uuid}, postfix='', format='jpeg'`, () => {
            const postfix = "";
            const format = "jpeg";
            const result = notStoreDriverFilenameResolver.composeFilename(
                uuid,
                postfix,
                format
            );
            expect(result).to.be.equal(`${uuid}.jpeg`);
        });

        it(`uuid=${uuid}, postfix='data', format='jpeg'`, () => {
            const postfix = "data";
            const format = "jpeg";
            const result = notStoreDriverFilenameResolver.composeFilename(
                uuid,
                postfix,
                format
            );
            expect(result).to.be.equal(
                `${uuid}${DEFAULT_FILENAME_SPLIT}data.jpeg`
            );
        });
    });

    describe("composeFullFilename", function () {
        const uuid = uuidv4();
        it(`uuid=${uuid}, postfix=not provided, format=not provided, options=not provided`, () => {
            const result =
                notStoreDriverFilenameResolver.composeFullFilename(uuid);
            expect(result).to.be.equal(`${uuid}`);
        });

        it(`uuid=${uuid}, postfix='', format='', options=not provided`, () => {
            const postfix = "";
            const format = "";
            const result = notStoreDriverFilenameResolver.composeFullFilename(
                uuid,
                postfix,
                format
            );
            expect(result).to.be.equal(`${uuid}`);
        });

        it(`uuid=${uuid}, postfix='', format='', options=undefined`, () => {
            const postfix = "";
            const format = "";
            const result = notStoreDriverFilenameResolver.composeFullFilename(
                uuid,
                postfix,
                format
            );
            expect(result).to.be.equal(`${uuid}`);
        });

        it(`uuid=${uuid}, postfix='data', format='pdf', options.path=root/dir, options.groupFiles=false`, () => {
            const postfix = "data";
            const format = "pdf";
            const options = {
                path: "root/dir",
                groupFiles: false,
            };
            const result = notStoreDriverFilenameResolver.composeFullFilename(
                uuid,
                postfix,
                format,
                options
            );
            expect(result).to.be.equal(
                `${options.path}/${uuid}${DEFAULT_FILENAME_SPLIT}${postfix}.${format}`
            );
        });

        it(`uuid=${uuid}, postfix='data', format='pdf', options.path=root/dir, options.groupFiles=true`, () => {
            const postfix = "data";
            const format = "pdf";
            const options = {
                path: "root/dir",
                groupFiles: true,
            };
            const result = notStoreDriverFilenameResolver.composeFullFilename(
                uuid,
                postfix,
                format,
                options
            );
            expect(result).to.be.equal(
                `${options.path}/${uuid.substring(
                    0,
                    FIRST_DIR_NAME_LENGTH
                )}/${uuid}${DEFAULT_FILENAME_SPLIT}${postfix}.${format}`
            );
        });
    });

    describe("composeVariantFilename", function () {
        const uuid = uuidv4();
        const srcParts = {
            name: uuid,
            base: `${uuid}.jpg`,
            ext: ".jpg",
            dir: "/some/dir",
            root: "/",
        };
        it(`srcParts={name: '${uuid}', ext: '.jpg', dir: '/some/dir', root: '/'}, variantShortName='small'`, () => {
            const result =
                notStoreDriverFilenameResolver.composeVariantFilename(
                    srcParts,
                    "small"
                );
            expect(result).to.be.equal(
                `${uuid}${DEFAULT_FILENAME_SPLIT}small.jpg`
            );
        });

        it(`srcParts={name: '${uuid}', ext: '.jpg', dir: '/some/dir', root: '/'}, variantShortName=''`, () => {
            const result =
                notStoreDriverFilenameResolver.composeVariantFilename(
                    srcParts,
                    ""
                );
            expect(result).to.be.equal(`${uuid}.jpg`);
        });
    });

    describe("composeVariantPath", function () {
        const uuid = uuidv4();
        const srcParts = {
            name: uuid,
            base: `${uuid}.jpg`,
            ext: ".jpg",
            dir: "/some/dir",
            root: "/",
        };
        it(`srcParts={name: '${uuid}', ext: '.jpg', dir: '/some/dir', root: '/'}, variantShortName='small'`, () => {
            const result = notStoreDriverFilenameResolver.composeVariantPath(
                srcParts,
                "small"
            );
            expect(result).to.be.equal(
                `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}small.jpg`
            );
        });

        it(`srcParts={name: '${uuid}', ext: '.jpg', dir: '/some/dir', root: '/'}, variantShortName=''`, () => {
            const result = notStoreDriverFilenameResolver.composeVariantPath(
                srcParts,
                ""
            );
            expect(result).to.be.equal(`/some/dir/${uuid}.jpg`);
        });
    });

    describe("composeVariantsPaths", function () {
        const uuid = uuidv4();
        const src = `/some/dir/${uuid}.jpg`;
        const variants = {
            small: { size: 10 },
            normal: { size: 40 },
            big: { size: 80 },
        };
        it(`src, variants - set; format not set`, () => {
            const result = notStoreDriverFilenameResolver.composeVariantsPaths(
                src,
                variants
            );
            expect(result).to.be.deep.equal({
                small: {
                    variant: {
                        size: 10,
                    },
                    local: `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}small.jpg`,
                    filename: `${uuid}${DEFAULT_FILENAME_SPLIT}small.jpg`,
                },
                normal: {
                    variant: {
                        size: 40,
                    },
                    local: `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}normal.jpg`,
                    filename: `${uuid}${DEFAULT_FILENAME_SPLIT}normal.jpg`,
                },
                big: {
                    variant: {
                        size: 80,
                    },
                    local: `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}big.jpg`,
                    filename: `${uuid}${DEFAULT_FILENAME_SPLIT}big.jpg`,
                },
            });
        });

        it(`src, variants - set; format = png`, () => {
            const result = notStoreDriverFilenameResolver.composeVariantsPaths(
                src,
                variants,
                "png"
            );
            expect(result).to.be.deep.equal({
                small: {
                    variant: {
                        size: 10,
                    },
                    local: `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}small.png`,
                    filename: `${uuid}${DEFAULT_FILENAME_SPLIT}small.png`,
                },
                normal: {
                    variant: {
                        size: 40,
                    },
                    local: `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}normal.png`,
                    filename: `${uuid}${DEFAULT_FILENAME_SPLIT}normal.png`,
                },
                big: {
                    variant: {
                        size: 80,
                    },
                    local: `/some/dir/${uuid}${DEFAULT_FILENAME_SPLIT}big.png`,
                    filename: `${uuid}${DEFAULT_FILENAME_SPLIT}big.png`,
                },
            });
        });
    });

    describe("composeVariantsFilenames", function () {
        const uuid = uuidv4();
        const variants = {
            small: { size: 10 },
            normal: { size: 40 },
            big: { size: 80 },
        };
        it(`src, variants - set; format = jpg, addOriginal not set`, () => {
            const result =
                notStoreDriverFilenameResolver.composeVariantsFilenames(
                    uuid,
                    variants,
                    "jpg"
                );
            expect(result).to.be.deep.equal({
                small: `${uuid}${DEFAULT_FILENAME_SPLIT}small.jpg`,
                normal: `${uuid}${DEFAULT_FILENAME_SPLIT}normal.jpg`,
                big: `${uuid}${DEFAULT_FILENAME_SPLIT}big.jpg`,
                original: `${uuid}.jpg`,
            });
        });

        it(`src, variants - set; format = jpg, addOriginal = false`, () => {
            const result =
                notStoreDriverFilenameResolver.composeVariantsFilenames(
                    uuid,
                    variants,
                    "jpg",
                    false
                );
            expect(result).to.be.deep.equal({
                small: `${uuid}${DEFAULT_FILENAME_SPLIT}small.jpg`,
                normal: `${uuid}${DEFAULT_FILENAME_SPLIT}normal.jpg`,
                big: `${uuid}${DEFAULT_FILENAME_SPLIT}big.jpg`,
            });
        });
    });
});
