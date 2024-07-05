const DEFAULT_OPTIONS = {
    endpoint: {
        endpoint: "",
        region: "",
    },
    s3: {
        bucket: "",
        id: "",
        key: "",
        path: "/",
    },
    tmp: "../tmp",
};

Object.freeze(DEFAULT_OPTIONS);

module.exports = DEFAULT_OPTIONS;
