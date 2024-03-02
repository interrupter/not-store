const getApp = require("not-node/src/getApp");
const {
    LogicDeleteActionException,
} = require("not-node/src/exceptions/action");

module.exports = class deleteAllInStoreAction {
    static checkIdentitySessionId(identity) {
        return (
            typeof identity.sid !== "undefined" &&
            identity.sid !== null &&
            identity.sid &&
            identity.sid.length > 10
        );
    }

    static async run(logic, actionName, { identity, storeName }) {
        try {
            logic.logDebugAction(actionName, identity);
            const File = getApp().getModel("File");
            await File.deleteAllInStore(storeName, {}, false);
        } catch (e) {
            throw new LogicDeleteActionException(
                {
                    actionName,
                    activeUserId: identity?.uid,
                    admin: identity?.admin,
                    role: identity?.role,
                    root: identity?.root,
                    sessionId: identity?.sid,
                    storeName,
                },
                e
            );
        }
    }
};
