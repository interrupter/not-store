const { DOCUMENT_OWNER_FIELD_NAME } = require("not-node/src/auth/const.js");
const { LogicGetActionException } = require("not-node/src/exceptions/action");

module.exports = class getOwnAction {
    static async run(logic, actionName, { identity, targetId }) {
        try {
            logic.logDebugAction(actionName, identity);
            const result = await logic
                .getModel()
                .getOne(
                    targetId,
                    [
                        {
                            path: DOCUMENT_OWNER_FIELD_NAME,
                            select: "_id userID username",
                        },
                        "children",
                    ],
                    {
                        [DOCUMENT_OWNER_FIELD_NAME]: identity.uid,
                    }
                );
            logic.logAction(actionName, identity, { targetId });
            return result;
        } catch (e) {
            throw new LogicGetActionException(
                {
                    actionName,
                    activeUserId: identity?.uid,
                    admin: identity?.admin,
                    role: identity?.role,
                    root: identity?.root,
                    sessionId: identity?.sid,
                    targetId,
                },
                e
            );
        }
    }
};
