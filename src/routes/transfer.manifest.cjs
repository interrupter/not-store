const { MODULE_NAME } = require("../const.cjs");

const FIELDS = [
    "models"
];

module.exports = {
    actions: {
        listAllModels:{
            data: ["sorter", "filter", "search"],
            ws: true,
            rules: [
                {
                    root: true,
                    return: ['id', 'title']
                },
                {
                    auth: true,
                    role: ["admin", "confirmed"],
                    return: ['id', 'title']
                },
            ],
        },
        statsForFilesByModels:{
            data: ["sorter", "filter", "search"],
            ws: true,
            rules: [
                {
                    root: true,
                    return: ['model', 'fields','stats']
                },
                {
                    auth: true,
                    role: ["admin", "confirmed"],
                    return: ['model', 'fields','stats']
                },
            ],
        }
    },
    fields: FIELDS,
    model: "transfer",
    url: "/api/:modelName",
};
