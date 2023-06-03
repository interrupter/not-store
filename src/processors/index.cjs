const imageThumbs = require("./image.thumbs/index.cjs");

module.exports = {
    "image.metadata.extract": require("./image.metadata.extract.cjs"),
    ...imageThumbs,
};
