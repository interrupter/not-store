const { MODULE_NAME } = require("../const.cjs");
const notNode = require("not-node");

function statsForFilesByModels({ data, identity }) {
    return notNode.Application.getLogic(
        `${MODULE_NAME}//Transfer`
    ).statsForFilesByModels({ data, identity });
}

function listAllModels({ data, identity, client }) {
    return notNode.Application.getLogic(
        `${MODULE_NAME}//Transfer`
    ).listAllModels({ data, identity, clientIP: client.getIP() });
}

module.exports = {
    servers: {
        main: {
            request: {
                statsForFilesByModels,
                listAllModels,
            },
        },
    },
};
