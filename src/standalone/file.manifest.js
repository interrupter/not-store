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
            fields: [
                "_id",
                "parent",
                "uuid",
                "fileID",
                "name",
                "extension",
                "variant",
                "store",
                "info",
                "path",
                "cloud",
                "size",
                "userIp",
                "userId",
                "session",
                "createdAt",
                "updatedAt",
            ],
            isArray: false,
            method: "GET",
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
        getRaw: {
            data: ["filter", "record"],
            fields: [
                "_id",
                "parent",
                "uuid",
                "fileID",
                "name",
                "extension",
                "variant",
                "store",
                "info",
                "path",
                "cloud",
                "size",
                "userIp",
                "userId",
                "session",
                "createdAt",
                "updatedAt",
            ],
            isArray: false,
            method: "GET",
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
        list: {
            data: ["pager", "sorter", "filter", "search"],
            fields: [
                "_id",
                "parent",
                "uuid",
                "fileID",
                "name",
                "extension",
                "variant",
                "store",
                "info",
                "path",
                "cloud",
                "size",
                "userIp",
                "userId",
                "session",
                "createdAt",
                "updatedAt",
            ],
            isArray: true,
            method: "GET",
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
            fields: [
                "_id",
                "parent",
                "uuid",
                "fileID",
                "name",
                "extension",
                "variant",
                "store",
                "info",
                "path",
                "cloud",
                "size",
                "userIp",
                "userId",
                "session",
                "createdAt",
                "updatedAt",
            ],
            method: "get",
            postFix: "/:actionName",
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
