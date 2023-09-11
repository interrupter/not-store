// @ts-check
/** @type {number} */
const FIRST_DIR_NAME_LENGTH = 3;
/** @type {string} */
const MODULE_NAME = "not-store";
/** @type {number} */
const OPT_MAX_INPUT_PATH_LENGTH = 255;
const OPT_ACLs = [
    "private",
    "public-read",
    "public-read-write",
    "authenticated-read",
    "aws-exec-read",
    "bucket-owner-read",
    "bucket-owner-full-control",
];

/** @type {string} */
const OPT_DEFAULT_ACL = "private";

const OPT_DEFAULT_THUMB_EXTENSION = "jpeg";
const OPT_DEFAULT_THUMB_OPTIONS = {
    quality: 90,
};

/**
 *  @constant
 *  @default
 * @type {string}
 */
const PROCESSOR_TYPE_PRE = "pre";
/**
 *  @constant
 *  @default
 * @type {string}
 */
const PROCESSOR_TYPE_POST = "post";
/**
 * Enum for processors types
 * @readonly
 * @enum {string}
 */
const PROCESSOR_TYPES = {
    PROCESSOR_TYPE_PRE,
    PROCESSOR_TYPE_POST,
};

/** @type {string} */
const DEFAULT_FILENAME_SPLIT = "-";

/**
 * @typedef {object}    EnvironmentsChecksOptions
 * @property   {string}     prefix      prefix of environment variables names
 * @property   {boolean}    drop        should we drop prefix before search variable in env
 */
/** @type {EnvironmentsChecksOptions} */
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
