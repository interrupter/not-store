const {
    LogicListAndCountActionException,
} = require("not-node/src/exceptions/action");

module.exports = class listAndCountOriginalAction {
    static async run(logic, actionName, { identity, query }) {
        try {
            logic.logDebugAction(actionName, identity);
            if(!query.filter){
                query.filter = {};
            }
            query.filter.parent = {$exists: false};
            query.filter.variant = {$exists: false};
            const result = await logic
                .getModel()
                .listAndCount(
                    query.skip,
                    query.size,
                    query.sorter,
                    query.filter,
                    query.search
                );
            result.list = result.list.map((item) => item.toObject());
            logic.logAction(actionName, identity, {});
            return result;
        } catch (e) {
            throw new LogicListAndCountActionException(
                {
                    actionName,
                    activeUserId: identity?.uid,
                    role: identity?.role,
                },
                e
            );
        }
    }
};
