const {MODULE_NAME} = require('../const.cjs');
const MODEL_NAME = "File";

const Form = require("not-node/src/form/form");


const FormExceptions = require("not-node/src/exceptions/form");
const FIELDS = [    
    ["identity", "not-node//identity"],
];

const ACTION_NAME = 'deleteMany';


class FileDeleteManyForm extends Form {
        constructor(params) {
            super({
                ...params,
                FIELDS,
                ACTION_NAME,
                MODULE_NAME,
                MODEL_NAME,
            });
        }

        /**
         * Adds owner id or session to query.filter
         * @param {import('../../types').PreparedData}  prepared
         * @param {import('../../types').notNodeExpressRequest} req
         * @return {Promise<import('../../types').PreparedData>}
         */
        async afterExtract(prepared, req) {
            prepared = await super.afterExtract(prepared, req);
            if (!prepared.identity || !prepared.targetIds) {
                throw new Error(`Identity or/and targetIds is empty`);
            }
            return prepared;
        }
    };


module.exports = FileDeleteManyForm;
