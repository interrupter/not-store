const notNode = require("not-node");
const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    model: {
        type: Schema.Types.Mixed,
        required: true,
        validate: [
            {
                validator(val) {
                    return notNode.Application.getForm(
                        `${MODULE_NAME}//_Store_data`
                    ).run(val);
                },
                message: `${MODULE_NAME}:validation_message_store_data_is_not_valid`,
            },
        ],
    },
};
