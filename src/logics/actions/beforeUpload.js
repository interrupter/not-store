const {
    OwnageExceptionIdentityUserIdAndSessionIsNotDefined,
    ActionExceptionIdentitySessionIsNotDefined,
} = require("not-node/src/exceptions/action");
const {
    DEFAULT_SERVER_STORE,
    DEFAULT_GUEST_STORE,
    DEFAULT_USER_STORE,
} = require("../../const.cjs");

module.exports = class BeforeActionUpload {
    //admins can use any store
    static checksForAdmins(logic, actionName, prepared) {
        if (!prepared.store) {
            prepared.store =
                logic.config.get("serverStoreName") ?? DEFAULT_SERVER_STORE;
        }
    }

    //users or guests only dedicated
    static checksForUsers(logic, actionName, prepared) {
        prepared.store =
            logic.config.get("userStoreName") ?? DEFAULT_USER_STORE;
    }

    static checksForGuests(logic, actionName, prepared) {
        prepared.store =
            logic.config.get("guestStoreName") ?? DEFAULT_GUEST_STORE;
    }

    static checksForEveryone(logic, actionName, prepared) {
        if (logic.config.get("sessionRequired")) {
            if (!prepared.identity.sid) {
                throw new ActionExceptionIdentitySessionIsNotDefined(
                    actionName,
                    prepared.identity
                );
            }
        }
    }

    static async run(logic, actionName, prepared) {
        const { identity } = prepared;
        this.checksForEveryone(logic, actionName, prepared);
        if ((identity.admin || identity.root) && identity.uid) {
            this.checksForAdmins(logic, actionName, prepared);
        } else if (identity.auth && identity.uid) {
            this.checksForUsers(logic, actionName, prepared);
        } else if (!identity.auth && identity.sid) {
            this.checksForGuests(logic, actionName, prepared);
        } else {
            throw new OwnageExceptionIdentityUserIdAndSessionIsNotDefined(
                actionName,
                identity
            );
        }
    }
};
