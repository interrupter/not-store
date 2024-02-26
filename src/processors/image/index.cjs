const imgUpload = require("./upload/image.upload.cjs");
const imgParentPreview = require("./upload/image.parent.preview.cjs");
const imgDeleteRemote = require("./delete/image.delete.remote.cjs");

module.exports = {
    [imgUpload.getDescription().id]: imgUpload,
    [imgDeleteRemote.getDescription().id]: imgDeleteRemote,
    [imgParentPreview.getDescription().id]: imgParentPreview
};
