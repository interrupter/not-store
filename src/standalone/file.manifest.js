module.exports = {
    model: "file",
    url: "/api/:modelName",
    fields: {},
    actions: {
        create: {
            method: "PUT",
            isArray: false,
            data: ["record"],
            postFix: "/:bucket?",
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
        list: {
            method: "GET",
            isArray: true,
            data: ["pager", "sorter", "filter", "search"],
            fields: [
                "_id",
                "fileID",
                "name",
                "extension",
                "bucket",
                "metadata",
                "path",
                "paths",
                "userIp",
                "userId",
                "session",
                "width",
                "height",
                "size",
            ],
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
        listAndCount: {
            method: "get",
            data: ["pager", "sorter", "filter", "search"],
            fields: [
                "_id",
                "fileID",
                "name",
                "extension",
                "bucket",
                "metadata",
                "path",
                "paths",
                "userIp",
                "userId",
                "session",
                "width",
                "height",
                "size",
            ],
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
            fields: [
                "_id",
                "fileID",
                "name",
                "extension",
                "bucket",
                "metadata",
                "path",
                "paths",
                "userIp",
                "userId",
                "session",
                "width",
                "height",
                "size",
            ],
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
            fields: [
                "_id",
                "fileID",
                "name",
                "extension",
                "bucket",
                "metadata",
                "path",
                "paths",
                "userIp",
                "userId",
                "session",
                "width",
                "height",
                "size",
            ],
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
