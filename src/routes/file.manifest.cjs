const { MODULE_NAME } = require("../const.cjs");

const defaultManifest = require("../standalone/file.manifest.js");

const FIELDS = [
    "_id",
    `${MODULE_NAME}//bucket`,
    `${MODULE_NAME}//info`,
    `not-node//width`,
    `not-node//height`,
    ['userId', {component: 'UIUser'}, 'not-node//userId'],
    ["name", {}, "filename"],
    ["fileID", {}, "ID"],
    ["userIp", {}, "ip"],
];

defaultManifest.fields = FIELDS;
module.exports = defaultManifest;
