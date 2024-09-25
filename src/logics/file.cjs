// @ts-check
const { MODULE_NAME } = require("../const.cjs");
const MODEL_NAME = "File";
module.exports.thisLogicName = MODEL_NAME;

const GenericLogic = require("not-node/src/logic/generic");
const { DOCUMENT_OWNER_FIELD_NAME } = require("not-node/src/auth/const");

const StandartActions = require("not-node/src/logic/actions/standart");

const onePopulateBuilder = () => {
    return [
        {
            path: DOCUMENT_OWNER_FIELD_NAME,
            select: "_id userID username",
        },
        "children",
    ];
};

const manyPopulateBuilder = () => {
    return ["children"];
};

const FileListAndCountOriginalAction = require("./actions/listAndCountOriginal");
const FileDeleteAction = require("./actions/delete");

const FileLogic = GenericLogic({
    beforeActionsOnCondition: [
        require("not-node/src/logic/actions.before/ownage/ownage.js").ifActionNameEndsWith_Own(),
        require("./actions/beforeOriginal").ifActionNameEndsWith_Original(),
    ],
    beforeActions: {
        upload: [require("./actions/beforeUpload")],
    },
    actions: {
        delete: FileDeleteAction,
        deleteOwn: FileDeleteAction,
        deleteAllInStore: require("./actions/deleteAllInStore"),
        get: StandartActions.get,
        getOwn: StandartActions.get,
        list: StandartActions.list,
        listOwn: StandartActions.list,
        listAll: StandartActions.listAll,
        listAllOwn: StandartActions.listAll,
        listAndCount: StandartActions.listAndCount,
        listAndCountOwn: StandartActions.listAndCount,
        listAndCountOriginal: FileListAndCountOriginalAction,
        listAndCountOriginalOwn: FileListAndCountOriginalAction,
        upload: require("./actions/upload"),
    },
    actionsSets: [], //reset to empty standart set
    populateBuilders: {
        get: onePopulateBuilder,
        getOwn: onePopulateBuilder,
        list: manyPopulateBuilder,
        listOwn: manyPopulateBuilder,
        listAll: manyPopulateBuilder,
        listAllOwn: manyPopulateBuilder,
        listAndCount: manyPopulateBuilder,
        listAndCountOwn: manyPopulateBuilder,
        listAndCountOriginal: manyPopulateBuilder,
        listAndCountOriginalOwn: manyPopulateBuilder,
    },
    MODEL_NAME,
    MODULE_NAME,
    target: module,
});

module.exports[MODEL_NAME] = FileLogic;
