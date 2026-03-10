const getApp = require("not-node/src/getApp");

const {
    LogicDeleteActionException,
} = require("not-node/src/exceptions/action");

module.exports = class deleteManyStoreAction {
    static checkIdentitySessionId(identity) {
        return (
            typeof identity.sid !== "undefined" &&
            identity.sid !== null &&
            identity.sid &&
            identity.sid.length > 10
        );
    }

    static async run(logic, actionName, { identity, targetIds }) {
        try {
            logic.logDebugAction(actionName, identity);
            const File = logic.getModel();
            await File.deleteMany(targetIds, {}, false);
        } catch (e) {
            throw new LogicDeleteActionException(
                {
                    actionName,
                    activeUserId: identity?.uid,
                    admin: identity?.admin,
                    role: identity?.role,
                    root: identity?.root,
                    sessionId: identity?.sid,
                    targetIds,
                },
                e
            );
        }
    }
};
