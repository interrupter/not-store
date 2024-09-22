const query = require("not-filter");
const notNode = require("not-node");
const { MODULE_NAME } = require("../const.cjs");
const Identity = notNode.notAppIdentity;

const FORM_ARGS = { MODULE_NAME, MODEL_NAME: "File", actionName: "list" };
const GenericFileListForm = notNode.Generic.GenericListForm(FORM_ARGS);

class FileListForm extends GenericFileListForm {
    async afterExtract(prepared, req) {
        prepared.query.filter = query.filter.modifyRules(
            prepared.query.filter,
            {
                session: Identity.extractAuthData(req).sid,
            }
        );
        return prepared;
    }
}

module.exports = FileListForm;
