const getApp = require("not-node/src/getApp");
const {
    LogicDeleteActionException,
} = require("not-node/src/exceptions/action");

const {
    OwnageExceptionIdentityUserIdAndSessionIsNotDefined,
} = require("not-node/src/exceptions/action");

module.exports = class FileDeleteAction {
    static checkIdentitySessionId(identity) {
        return (
            typeof identity.sid !== "undefined" &&
            identity.sid !== null &&
            identity.sid &&
            identity.sid.length > 10
        );
    }

    static getFileDocumentSessionAndOwnerId(identity) {
        if (identity.admin || identity.root) {
            return [undefined, undefined];
        } else if (identity.auth && identity.uid) {
            return [undefined, identity.uid];
        } else if (this.checkIdentitySessionId(identity)) {
            return [identity.sid, undefined];
        } else {
            return [];
        }
    }

    static async run(logic, actionName, { identity, targetId }) {
        try {
            logic.logDebugAction(actionName, identity);
            const File = getApp().getModel("File");
            const sessionAndOwnerId =
                this.getFileDocumentSessionAndOwnerId(identity);
            if (sessionAndOwnerId.length === 2) {
                const [session, ownerId] = sessionAndOwnerId;
                await File.getOneByIdAndRemove(targetId, session, ownerId);
            } else {
                throw new OwnageExceptionIdentityUserIdAndSessionIsNotDefined(
                    actionName,
                    identity
                );
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
