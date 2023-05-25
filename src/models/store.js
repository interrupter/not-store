const { MODULE_NAME } = require("../const");
const MODEL_NAME = "Store";

const FIELDS = [
    //human readable store name
    [
        "name",
        {
            type: String,
            unique: true,
            searchable: true,
            required: true,
        },
    ],
    `${MODULE_NAME}//driver`, //store driver
    `${MODULE_NAME}//options`, //store options
    `${MODULE_NAME}//processors`, //store processors {[action]:{pre:[procName1, [procName2, procOpt2]], post:[procName1, [procName2, procOpt2]]}}
    //can be used or not
    [
        "active",
        {
            type: Boolean,
            required: true,
            default: true,
        },
        "not-node//active",
    ],
];

exports.thisModelName = MODEL_NAME;

exports.enrich = {
    versioning: true,
    increment: true,
    validators: true,
};

exports.FIELDS = FIELDS;
