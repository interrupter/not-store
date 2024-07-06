module.exports = {
    actions: {
        create: {
            data: ["record"],
            isArray: false,
            method: "PUT",
            postFix: "/:store?",
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
            isArray: false,
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
        get: {
            data: ["filter", "record"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            isArray: false,
            method: "GET",
            postFix: "/:record[_id]",
            return: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
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
        getRaw: {
            data: ["filter", "record"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            isArray: false,
            method: "GET",
            postFix: "/:record[_id]",
            return: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
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
        list: {
            data: ["pager", "sorter", "filter", "search"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            isArray: true,
            method: "GET",
            return: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
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
        listAndCount: {
            data: ["pager", "sorter", "filter", "search"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            method: "get",
            postFix: "/:actionName",
            return: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            rules: [
                {
                    root: true,
                },
            ],
        },
    },
    fields: {},
    model: "file",
    url: "/api/:modelName",
};
