const imageThumbs = require("not-store/src/processors/image.thumbs/index.cjs");

module.exports = {
    "image.metadata.extract": require("not-store/src/processors/image.metadata.extract.cjs"),
    ...imageThumbs,
};
