const safeListItemFields = [
    "_id",
    "fielID",
    "name",
    "extension",
    "store",
    "info",
    "size",
];

module.exports = {
    model: "file",
    url: "/api/:modelName",
    fields: {},
    actions: {
        create: {
            method: "PUT",
            isArray: false,
            data: ["record"],
            postFix: "/:store?",
            rules: [
                {
                    auth: true,
                    root: true,
                },
                {
                    auth: true,
                    root: false,
                },
                {
                    auth: false,
                },
            ],
        },
        list: {
            method: "GET",
            isArray: true,
            data: ["pager", "sorter", "filter", "search"],
            fields: safeListItemFields,
            rules: [
                {
                    auth: true,
                    root: true,
                },
                {
                    auth: true,
                    root: false,
                    return: [
                        "createdAt",
                        "updatedAt",
                        "size",
                        "uuid",
                        "extension",
                        "fileID",
                        "userId",
                        "userIp",
                        "sesison",
                        "info",
                        "store",
                        "name",
                        "path",
                        "_id",
                    ],
                },
                {
                    auth: false,
                    return: [
                        "createdAt",
                        "updatedAt",
                        "size",
                        "uuid",
                        "extension",
                        "fileID",
                        "info",
                        "store",
                        "name",
                        "path",
                        "_id",
                    ],
                },
            ],
        },
        listAndCount: {
            method: "get",
            data: ["pager", "sorter", "filter", "search"],
            fields: safeListItemFields,
            rules: [
                {
                    auth: true,
                    root: true,
                },
                {
                    auth: true,
                    role: "root",
                },
            ],
            postFix: "/:actionName",
        },
        get: {
            method: "GET",
            isArray: false,
            postFix: "/:record[_id]",
            data: ["filter", "record"],
            fields: safeListItemFields,
            rules: [
                {
                    auth: true,
                    root: true,
                },
                {
                    auth: true,
                    root: false,
                },
                {
                    auth: false,
                    root: false,
                },
            ],
        },
        getRaw: {
            method: "GET",
            isArray: false,
            postFix: "/:record[_id]",
            data: ["filter", "record"],
            fields: safeListItemFields,
            rules: [
                {
                    auth: true,
                    root: true,
                },
                {
                    auth: true,
                    root: false,
                },
                {
                    auth: false,
                    root: false,
                },
            ],
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
                {
                    auth: true,
                    root: false,
                },
                {
                    auth: false,
                    root: false,
                },
            ],
        },
    },
};
