const imageThumbs = require("./image.thumbs");

module.exports = {
    "image.metadata.extract": require("./image.metadata.extract"),
    ...imageThumbs,
};
