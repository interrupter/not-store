const imgThumbsCreate = require("./create/image.thumbs.create.cjs");
const imgThumbsUpload = require("./upload/image.thumbs.upload.cjs");
const imgThumbsDeleteLocal = require("./delete/image.thumbs.delete.local.cjs");
const imgThumbsDeleteRemote = require("./delete/image.thumbs.delete.remote.cjs");

module.exports = {
    [imgThumbsCreate.getDescription().id]: imgThumbsCreate,
    [imgThumbsUpload.getDescription().id]: imgThumbsUpload,
    [imgThumbsDeleteLocal.getDescription().id]: imgThumbsDeleteLocal,
    [imgThumbsDeleteRemote.getDescription().id]: imgThumbsDeleteRemote,
};
