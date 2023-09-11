// @ts-check

/**
 * @typedef {object}    S3OptionsObject
 * @property {string}    [ACL]
 * @property {string}    [accessKeyId]
 * @property {string}    [secretAccessKey]
 * @property {string}    [apiVersion]
 * @property {string}    [endpoint]
 * @property {string}    [region]
 * @property {boolean}   [s3ForcePathStyle]
 */

/**
 * @typedef {object}    S3StoreOptionsObject
 * @property {string}    [ACL]
 * @property {string}    [accessKeyId]
 * @property {string}    [secretAccessKey]
 * @property {string}    [apiVersion]
 * @property {string}    [endpoint]
 * @property {string}    [region]
 * @property {boolean}   [s3ForcePathStyle]
 * @property {string}    [bucket]
 * @property {string}    [path]
 * @property {string}    [tmp]
 * @property {boolean}   [groupFiles]
 */

/**
 * @type {S3StoreOptionsObject}
 * @constant
 * */
const DEFAULT_OPTIONS = {
    ////S3 cloud access options
    ACL: "private",
    accessKeyId: "", // <--- заменить
    secretAccessKey: "", // <--- заменить
    apiVersion: "latest",
    endpoint: "https://s3.timeweb.com",
    region: "ru-1",
    s3ForcePathStyle: true,
    ////store options
    bucket: "", //
    path: "/", //sub path in bucket
    tmp: "/var/server/tmp", //path to local tmp folder
    /**
     * if files should be group in sub dirs by their first few letters
     * full file path       original filename
     * aaa/aaaaa.ext               aaaaa.ext
     * aaa/aaabc.ext               aaabc.ext
     * aaa/aaagf.ext               aaagf.ext
     * zxc/zxcas.ext               zxcas.ext
     */
    groupFiles: false,
};

Object.freeze(DEFAULT_OPTIONS);

module.exports = DEFAULT_OPTIONS;
