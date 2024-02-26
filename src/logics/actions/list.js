const getApp = require('not-node/src/getApp');
const { LogicListActionException } = require("not-node/src/exceptions/action");

module.exports = class listAction {

    static async run(logic, actionName, { identity, query }) {
        try {
            logic.logDebugAction(actionName, identity);            
            const result = await  getApp().getModel("File").listAndPopulate(
                query.skip,
                query.size,
                query.sorter,
                query.filter,
                ['children']
            );
            logic.logAction(actionName, identity, {...query});
            return result;
        } catch (e) {
            throw new LogicListActionException(
                {
                    activeUserId: identity?.uid,
                    sessionId: identity?.sid,
                    role: identity?.role,
                    actionName,
                    query,
                    admin: identity?.admin,
                    root: identity?.root,
                },
                e
            );
        }
    }
    
};
