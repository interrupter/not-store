const {
    MODULE_NAME,    
} = require("../const.cjs");


const Form = require("not-node").Form;
const MODEL_NAME = "Transfer";
/**
 *
 **/
module.exports = class FileStatsForFilesByModelsForm extends Form {
    constructor({ app, config }) {
        super({ MODULE_NAME, MODEL_NAME, app, config, actionName: "statsForFilesByModels", INSTRUCTIONS: {
            models: 'fromBody'
        }});
    }
    
};