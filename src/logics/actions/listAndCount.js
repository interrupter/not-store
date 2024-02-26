const { LogicListAndCountActionException } = require("not-node/src/exceptions/action");

module.exports = class listAndCountAction {

    static async run(logic, actionName, { identity, query }) {
        try {
            logic.logDebugAction(actionName, identity);
            const result = await logic.getModel().listAndCount(query.skip, query.size, query.sorter, query.filter, query.search);
            logic.logAction(actionName, identity, {});
            return result;
        } catch (e) {
            throw new LogicListAndCountActionException(
                {
                    activeUserId: identity?.uid,
                    role: identity?.role,
                    actionName
                },
                e
            );
        }
    }
    
};
