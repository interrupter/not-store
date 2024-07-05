const { MODULE_NAME } = require("../const.cjs");

const defaultManifest = require("../standalone/file.manifest.js");

const FIELDS = [
    "_id",
    ["parent", `${MODULE_NAME}//parentFile`],
    ["variant", `${MODULE_NAME}//variant`],
    ["cloud", `${MODULE_NAME}//cloud`],
    `${MODULE_NAME}//store`,
    `${MODULE_NAME}//info`,
    `not-node//width`,
    `not-node//height`,
    ["userId", { component: "UIUser" }, "not-node//userId"],
    ["name", {}, "filename"],
    ["fileID", {}, "ID"],
    ["userIp", {}, "ip"],
];

defaultManifest.fields = FIELDS;
module.exports = defaultManifest;
