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
            data: ["data"],
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
            method: "DELETE",
            postFix: "/:record[_id]",
            rules: [
                {
                    root: true,
                },
            ],
        },
        exportToJSON: {
            data: ["data"],
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
            data: ["data"],
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
            data: ["data"],
            fields: [
                "_id",
                "storeID",
                "name",
                "driver",
                "options",
                "processors",
                "active",
            ],

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
        listAndCount: {
            data: ["pager", "sorter", "filter", "search"],
            method: "get",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                    returnRoot: "list",
                },
                {
                    auth: true,
                    role: ["admin", "confirmed"],
                },
            ],
        },
        importFromJSON: {
            data: ["data"],
            method: "PUT",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },

        listDrivers: {
            data: ["pager", "sorter", "filter", "search"],
            method: "get",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                    return: {
                        id: true,
                        title: true,
                        ui: true,
                        actions: true,
                    },
                },
            ],
        },
        listProcessors: {
            data: ["pager", "sorter", "filter", "search"],
            method: "get",
            postFix: "/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },
        test: {
            method: "GET",
            postFix: "/:record[_id]/:actionName",
            rules: [
                {
                    root: true,
                },
            ],
        },

        update: {
            data: ["data"],
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
