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
     * aaa/aa.ext               aaaaa.ext
     * aaa/bc.ext               aaabc.ext
     * aaa/gf.ext               aaagf.ext
     * zxc/as.ext               zxcas.ext
     */
    groupFiles: false,
};

Object.freeze(DEFAULT_OPTIONS);

module.exports = DEFAULT_OPTIONS;
