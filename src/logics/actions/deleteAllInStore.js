const getApp = require('not-node/src/getApp');
const { LogicDeleteActionException } = require("not-node/src/exceptions/action");

module.exports = class deleteAllInStoreAction {

    static checkIdentitySessionId(identity){
        return typeof identity.sid !== "undefined" &&
                identity.sid !== null &&
                identity.sid &&
                identity.sid.length > 10;
    }

    static async run(logic, actionName, { identity, storeName }) {
        try {
            logic.logDebugAction(actionName, identity);
            const File = getApp().getModel("File");
            if (identity.admin) {
                await File.getOneByIdAndRemove(targetId, undefined);                
            } else if (this.checkIdentitySessionId(identity)) {
                await File.getOneByIdAndRemove(targetId, identity.sid);                
            } else {
                throw new Error("no user identity");
            }
        } catch (e) {
            throw new LogicDeleteActionException(
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
