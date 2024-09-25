const StandartQueriesBeforeAction = require("not-node/src/logic/actions.before/standart.queries.js");

module.exports = class BeforeActionOriginal {
    static async run(logic, actionName, args) {
        StandartQueriesBeforeAction.modifyQueries(
            args,
            logic.getModel().createQueryModificator("original")
        );
    }

    static ifActionNameEndsWith_Original() {
        return Object.freeze({
            condition: (actionName) =>
                actionName.endsWith("Original") ||
                actionName.endsWith("OriginalOwn"),
            action: BeforeActionOriginal,
        });
    }
};
