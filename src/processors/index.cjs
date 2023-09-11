// @ts-check
const imageThumbs = require("./image.thumbs/index.cjs");

const notStoreProcessorImageExtractMetadata = require("./image.metadata.extract.cjs");
const notStoreProcessorTest = require("./test.cjs");

module.exports = {
    [notStoreProcessorTest.getDescription().id]: notStoreProcessorTest,
    [notStoreProcessorImageExtractMetadata.getDescription().id]:
        notStoreProcessorImageExtractMetadata,
    ...imageThumbs,
};
