const { MODULE_NAME } = require("../const.cjs");
const MODEL_NAME = "File";

const notFieldsFilter = require("not-node/src/fields/filter");
const { firstLetterToLower } = require("not-node/src/common");
const FIELDS_FILTER_PREFIX = `${MODULE_NAME}//${MODEL_NAME}`;

const safeListItemFields = `${FIELDS_FILTER_PREFIX}//listItem`;
notFieldsFilter.addSet(safeListItemFields, ["@id", "@ID", "@safe"]);

const FIELDS = [
    "_id",
    ["name", {}, "filename"],
    ["fileID", {}, "ID"],
    ["userIp", {}, "ip"],
];

module.exports = {
    model: firstLetterToLower(MODEL_NAME),
    url: "/api/:modelName",
    fields: FIELDS,
    actions: {
        create: {
            method: "PUT",
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
            data: ["pager", "sorter", "filter", "search"],
            fields: [`@${safeListItemFields}`],
            rules: [
                {
                    auth: true,
                    root: true,
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
            fields: [`@${safeListItemFields}`],
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
            postFix: "/:record[_id]",
            data: ["filter", "record"],
            fields: [`@${safeListItemFields}`],
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
        getRaw: {
            method: "GET",
            postFix: "/:record[_id]",
            data: ["filter", "record"],
            fields: [`@${safeListItemFields}`],
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
        delete: {
            method: "DELETE",
            postFix: "/:record[_id]",
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
    },
};
