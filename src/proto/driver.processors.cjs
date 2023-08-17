const notStoreProcessors = require("../store.processors.cjs");
const { PROCESSOR_TYPES } = require("../const.cjs");

class notStoreDriverProcessors {
    #processors;
    constructor(processors) {
        this.#processors = processors;
    }

    /**
     *
     * @param {string} 	processorType 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @param {string} 	filename 		name of current file
     * @param {object} 	metadata 		file pipeline metadata
     * @returns
     */
    async run(type, action, filename, metadata, driver) {
        if (this.isSet(type, action)) {
            await notStoreProcessors.run(
                this.get(type, action), //processors list to run against file
                filename, //current target file
                metadata, //file metadata object
                driver
            );
        }
    }

    /**
     * if processor exists returns true
     * @param {string} 	processorType 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @returns {boolean}
     */
    isSet(processorType, action) {
        return (
            Object.hasOwn(this.#processors, action) &&
            Object.hasOwn(this.#processors[action], processorType) &&
            Array.isArray(this.#processors[action][processorType])
        );
    }

    /**
     * list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     * @param {string} processorType 	'pre' or 'post'
     * @param {string} action 			name of pipeline action
     * @returns {array}	list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     */
    get(processorType, action) {
        return this.#processors[action][processorType];
    }

    /**
     * Runs pre processors of action
     * @param {string}  action      name of action
     * @param {string}  filename    current target file name
     * @param {object}  metadata    object with different information about file
     * @returns {Promsie<any>}
     */
    async runPre(action, filename, metadata) {
        return this.run(
            PROCESSOR_TYPES.PROCESSOR_TYPE_PRE,
            action,
            filename,
            metadata
        );
    }

    /**
     * Runs post processors of action
     * @param {string}  action      name of action
     * @param {string}  filename    current target file name
     * @param {object}  metadata    object with different information about file
     * @returns {Promsie<any>}
     */
    async runPost(action, filename, metadata) {
        return this.run(
            PROCESSOR_TYPES.PROCESSOR_TYPE_POST,
            action,
            filename,
            metadata
        );
    }
}

module.exports = notStoreDriverProcessors;
