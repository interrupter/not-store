const defaultManifest = require("not-store/src/standalone/file.manifest.js");

const FIELDS = [
    "_id",
    ["name", {}, "filename"],
    ["fileID", {}, "ID"],
    ["userIp", {}, "ip"],
];

defaultManifest.fields = FIELDS;
module.exports = defaultManifest;
