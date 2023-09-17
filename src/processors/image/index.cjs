const imgUpload = require("./upload/image.upload.cjs");
const imgDeleteRemote = require("./delete/image.delete.remote.cjs");

module.exports = {
    [imgUpload.getDescription().id]: imgUpload,
    [imgDeleteRemote.getDescription().id]: imgDeleteRemote,
};
