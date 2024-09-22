const { LogicGetActionException } = require("not-node/src/exceptions/action");

module.exports = class getAction {
    static async run(logic, actionName, { identity, targetId }) {
        try {
            logic.logDebugAction(actionName, identity);
            const result = await logic
                .getModel()
                .getOne(targetId, [
                    { path: "userId", select: "_id userID username" },
                    "children",
                ]);
            logic.logAction(actionName, identity, { targetId });
            return result;
        } catch (e) {
            throw new LogicGetActionException(
                {
                    activeUserId: identity?.uid,
                    sessionId: identity?.sid,
                    role: identity?.role,
                    actionName,
                    targetId,
                    admin: identity?.admin,
                    root: identity?.root,
                },
                e
            );
        }
    }
};
