module.exports = {
    "image.thumbs.create": require("./create/image.thumbs.create.cjs"),
    "image.thumbs.upload": require("not-store/src/processors/image.thumbs/upload/image.thumbs.upload.cjs"),
    "image.thumbs.delete.local": require("not-store/src/processors/image.thumbs/delete/image.thumbs.delete.local.cjs"),
    "image.thumbs.delete.remote": require("not-store/src/processors/image.thumbs/delete/image.thumbs.delete.remote.cjs"),
};
