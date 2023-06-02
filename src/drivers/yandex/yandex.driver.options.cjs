const DEFAULT_OPTIONS = {
    endpoint: {
        endpoint: "",
        region: "",
    },
    s3: {
        id: "",
        key: "",
        bucket: "",
        path: "/",
    },
    tmp: "../tmp",
};

Object.freeze(DEFAULT_OPTIONS);

module.exports = DEFAULT_OPTIONS;
