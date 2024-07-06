const { MODULE_NAME } = require("../const.cjs");
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
    actions: {
        create: {
            data: ["record"],
            isArray: false,
            method: "PUT",
            rules: [
                {
                    fields: [
                        "name",
                        "driver",
                        "options",
                        "processors",
                        "active",
                    ],
                    root: true,
                },
            ],
        },
        delete: {
            isArray: false,
            method: "DELETE",
            postFix: "/:record[_id]",
            rules: [
                {
                    root: true,
                },
            ],
        },
        exportToJSON: {
            data: ["record"],
            method: "GET",
            postFix: "/:actionName",
            rules: [
                {
                    return: {
                        active: true,
                        driver: true,
                        name: true,
                        options: true,
                        processors: true,
                    },
                    returnStrict: true,
                    root: true,
                },
            ],
        },
        get: {
            data: ["record"],
            isArray: false,
            method: "get",
            postFix: "/:record[_id]/:actionName",
            rules: [
                {
                    fields: [
                        "_id",
                        "storeID",
                        "name",
                        "driver",
                        "options",
                        "processors",
                        "active",
                    ],
                    root: true,
                },
            ],
        },
        getRaw: {
            data: ["record"],
            fields: [
                "_id",
                "storeID",
                "name",
                "driver",
                "options",
                "processors",
                "active",
            ],
            isArray: false,
            method: "get",
            postFix: "/:record[_id]/:actionName",
            return: [
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
                    root: true,
                },
            ],
        },
        importFromJSON: {
            data: ["record"],
            method: "PUT",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },
        listAndCount: {
            data: ["pager", "sorter", "filter", "search"],
            isArray: false,
            method: "get",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },
        listDrivers: {
            data: ["pager", "sorter", "filter", "search"],
            isArray: false,
            method: "get",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },
        listProcessors: {
            data: ["pager", "sorter", "filter", "search"],
            isArray: false,
            method: "get",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },
        test: {
            isArray: false,
            method: "GET",
            postFix: "/:record[_id]/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },

        update: {
            data: ["record"],
            method: "post",
            postFix: "/:record[_id]/:actionName",
            rules: [
                {
                    fields: [
                        "name",
                        "driver",
                        "options",
                        "processors",
                        "active",
                    ],
                    root: true,
                },
            ],
        },
    },
    fields: FIELDS,
    model: "store",
    url: "/api/:modelName",
};
