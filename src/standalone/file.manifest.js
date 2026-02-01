const safeFields = [
    "_id",
    "fileID",
    "uuid",
    "parent",
    "variant",
    "name",
    "extension",
    "store",
    "info",
    "path",
    "cloud",
    "size",
    "createdAt",
    "updatedAt",
];

module.exports = {
    actions: {
        create: {
            data: ["data"],
            method: "PUT",
            postFix: "/{:store}",
            rules: [
                {
                    root: true,
                },
                {
                    auth: true,
                },
                {
                    auth: false,
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
                {
                    auth: true,
                },
                {
                    auth: false,
                },
            ],
        },
        listAndCountOriginal: {
            data: ["pager", "sorter", "filter", "search"],
            fields: safeFields,
            method: "get",
            postFix: "/:actionName",
            return: safeFields,
            rules: [
                {
                    root: true,
                    returnRoot: "list",
                    return: safeFields,
                },
                {
                    auth: true,
                    returnRoot: "list",
                    return: safeFields,
                },
                {
                    auth: false,
                    returnRoot: "list",
                    return: safeFields,
                },
            ],
        },
        listAndCount: {
            data: ["pager", "sorter", "filter", "search"],
            fields: safeFields,
            method: "get",
            postFix: "/:actionName",
            return: safeFields,
            rules: [
                {
                    root: true,
                    returnRoot: "list",

                    return: safeFields,
                },
                {
                    auth: true,
                    returnRoot: "list",

                    return: safeFields,
                },
                {
                    auth: false,
                    returnRoot: "list",

                    return: safeFields,
                },
            ],
        },
        get: {
            data: ["filter", "data"],

            method: "GET",
            postFix: "/:record[_id]",

            rules: [
                {
                    root: true,
                    fields: safeFields,
                    return: safeFields,
                },
                {
                    auth: true,
                    fields: safeFields,
                    return: safeFields,
                },
                {
                    auth: false,
                    fields: safeFields,
                    return: safeFields,
                },
            ],
        },
        getRaw: {
            data: ["filter", "data"],

            method: "GET",
            postFix: "/:record[_id]/:actionName",

            rules: [
                {
                    root: true,
                    fields: safeFields,
                    return: safeFields,
                },
                {
                    auth: true,
                    fields: safeFields,
                    return: safeFields,
                },
                {
                    auth: false,
                    fields: safeFields,
                    return: safeFields,
                },
            ],
        },
        list: {
            data: ["pager", "sorter", "filter", "search"],
            method: "GET",
            rules: [
                {
                    root: true,
                    return: safeFields,
                },
                {
                    auth: true,
                    return: safeFields,
                },
                {
                    auth: false,
                    return: safeFields,
                },
            ],
        },
    },
    fields: {},
    model: "file",
    url: "/api/:modelName",
};
