const notNode = require("not-node");
const Schema = require("mongoose").Schema;
const { MODULE_NAME } = require("../const.cjs");

module.exports = {
    model: {
        required: true,
        type: Schema.Types.Mixed,
        validate: [
            {
                message: `${MODULE_NAME}:validation_message_store_data_is_not_valid`,
                validator(val) {
                    return notNode.Application.getForm(
                        `${MODULE_NAME}//_Store_data`
                    ).run(val);
                },
            },
        ],
    },
};
