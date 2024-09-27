module.exports = [
    {
        validator(val) {
            return typeof val === 'object';
        },
        message: "not-store:cloud_is_not_object",
    },
    {
        validator(val) {
            return ['Location', 'Key', 'key', 'ETag', 'Bucket'].every(key=>Object.hasOwn(val, key));
        },
        message: "not-store:cloud_is_missing_property",
    },
];