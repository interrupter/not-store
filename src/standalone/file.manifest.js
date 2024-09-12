module.exports = {
    actions: {
        create: {
            data: ["data"],

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
        listAndCount: {
            data: ["pager", "sorter", "filter", "search"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            method: "get",
            postFix: "/:actionName",
            return: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],
            rules: [
                {
                    root: true,
                    returnRoot: "list",
                },
            ],
        },
        get: {
            data: ["filter", "data"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],

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
            data: ["filter", "data"],
            fields: ["@id", "@ID", "@safe", "@ownage", "@timestamps"],

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
    },
    fields: {},
    model: "file",
    url: "/api/:modelName",
};
