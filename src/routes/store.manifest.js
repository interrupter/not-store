const { MODULE_NAME } = require("../const");
const FIELDS = [
    "not-node//_id",
    ["storeID", "not-node//ID"],
    `${MODULE_NAME}//name`,
    `${MODULE_NAME}//driver`,
    `${MODULE_NAME}//options`,
    `${MODULE_NAME}//processors`,
    "not-node//active",
];

module.exports = {
    model: "store",
    url: "/api/:modelName",
    fields: FIELDS,
    actions: {
        create: {
            method: "PUT",
            isArray: false,
            data: ["record"],
            rules: [
                {
                    auth: true,
                    root: true,
                    fields: [
                        "name",
                        "driver",
                        "options",
                        "processors",
                        "active",
                    ],
                },
            ],
        },
        get: {
            method: "get",
            data: ["record"],
            isArray: false,
            rules: [
                {
                    auth: true,
                    root: true,
                    fields: [
                        "_id",
                        "storeID",
                        "name",
                        "driver",
                        "options",
                        "processors",
                        "active",
                    ],
                },
            ],
            postFix: "/:record[_id]/:actionName",
        },
        getRaw: {
            method: "get",
            data: ["record"],
            isArray: false,
            return: [
                "_id",
                "storeID",
                "name",
                "driver",
                "options",
                "processors",
                "active",
            ],
            fields: [
                "_id",
                "storeID",
                "name",
                "driver",
                "options",
                "processors",
                "active",
            ],
            rules: [
                {
                    auth: true,
                    root: true,
                },
            ],
            postFix: "/:record[_id]/:actionName",
        },
        update: {
            method: "post",
            rules: [
                {
                    auth: true,
                    root: true,
                    fields: [
                        "name",
                        "driver",
                        "options",
                        "processors",
                        "active",
                    ],
                },
            ],
            data: ["record"],
            postFix: "/:record[_id]/:actionName",
        },
        listAndCount: {
            method: "get",
            isArray: false,
            data: ["pager", "sorter", "filter", "search"],
            rules: [
                {
                    auth: true,
                    root: true,
                },
            ],
            postFix: "/:actionName",
        },
        listDrivers: {
            method: "get",
            isArray: false,
            data: ["pager", "sorter", "filter", "search"],
            rules: [
                {
                    auth: true,
                    root: true,
                },
            ],
            postFix: "/:actionName",
        },
        listProcessors: {
            method: "get",
            isArray: false,
            data: ["pager", "sorter", "filter", "search"],
            rules: [
                {
                    auth: true,
                    root: true,
                },
            ],
            postFix: "/:actionName",
        },
        delete: {
            method: "DELETE",
            postFix: "/:record[_id]",
            isArray: false,
            rules: [
                {
                    auth: true,
                    root: true,
                },
            ],
        },
        test: {
            method: "GET",
            postFix: "/:record[_id]/:actionName",
            isArray: false,
            rules: [
                {
                    auth: true,
                    root: true,
                },
            ],
        },
    },
};
