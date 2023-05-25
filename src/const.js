const FIRST_DIR_NAME_LENGTH = 3;
const MODULE_NAME = "not-store";
const OPT_MAX_INPUT_PATH_LENGTH = 255;

const OPT_DEFAULT_ACL = "private";
const OPT_ACLs = [
    "private",
    "public-read",
    "public-read-write",
    "authenticated-read",
    "aws-exec-read",
    "bucket-owner-read",
    "bucket-owner-full-control",
];

const OPT_DEFAULT_THUMB_EXTENSION = "jpeg";
const OPT_DEFAULT_THUMB_OPTIONS = {
    quality: 90,
};

const PROCESSOR_TYPE_PRE = "pre";
const PROCESSOR_TYPE_POST = "post";

const PROCESSOR_TYPES = {
    PROCESSOR_TYPE_PRE,
    PROCESSOR_TYPE_POST,
};

const DEFAULT_FILENAME_SPLIT = "-";

const OPT_ENV_CHECKS = {
    prefix: "ENV$",
    drop: true,
};

module.exports = {
    OPT_ACLs,
    OPT_ENV_CHECKS,
    PROCESSOR_TYPES,
    PROCESSOR_TYPE_PRE,
    PROCESSOR_TYPE_POST,
    MODULE_NAME,
    DEFAULT_FILENAME_SPLIT,
    FIRST_DIR_NAME_LENGTH,
    OPT_MAX_INPUT_PATH_LENGTH,
    OPT_DEFAULT_ACL,
    OPT_DEFAULT_THUMB_EXTENSION,
    OPT_DEFAULT_THUMB_OPTIONS,
};
