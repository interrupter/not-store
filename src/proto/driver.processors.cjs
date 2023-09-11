// @ts-check

const notStoreProcessors = require("../store.processors.cjs");
const { PROCESSOR_TYPES } = require("../const.cjs");

/**
 *
 *
 * @class notStoreDriverProcessors
 */
class notStoreDriverProcessors {
    #processors;
    /**
     * Creates an instance of notStoreDriverProcessors.
     * @param {*} processors
     * @memberof notStoreDriverProcessors
     */
    constructor(processors) {
        this.#processors = processors;
    }

    /**
     *
     * @param {string} 	type 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @param {string} 	filename 		name of current file
     * @param {object} 	metadata 		file pipeline metadata
     * @param {object} 	driver 		    driver instance
     * @returns {Promise}
     * @memberof notStoreDriverProcessors
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
     * @memberof notStoreDriverProcessors
     */
    isSet(processorType, action) {
        return (
            Object.hasOwn(this.#processors, action) &&
            Object.hasOwn(this.#processors[action], processorType) &&
            Array.isArray(this.#processors[action][processorType]) &&
            this.#processors[action][processorType].length > 0
        );
    }

    /**
     * list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     * @param {string} processorType 	'pre' or 'post'
     * @param {string} action 			name of pipeline action
     * @returns {array}	list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     * @memberof notStoreDriverProcessors
     */
    get(processorType, action) {
        return this.#processors[action][processorType];
    }

    /**
     * Runs pre processors of action
     * @param {string}  action      name of action
     * @param {string}  filename    current target file name
     * @param {object}  metadata    object with different information about file
     * @param {object} 	driver 		    driver instance
     * @returns {Promise<any>}
     * @memberof notStoreDriverProcessors
     */
    async runPre(action, filename, metadata, driver) {
        return this.run(
            PROCESSOR_TYPES.PROCESSOR_TYPE_PRE,
            action,
            filename,
            metadata,
            driver
        );
    }

    /**
     * Runs post processors of action
     * @param {string}  action      name of action
     * @param {string}  filename    current target file name
     * @param {object}  metadata    object with different information about file
     * @param {object} 	driver 		    driver instance
     * @returns {Promise<any>}
     * @memberof notStoreDriverProcessors
     */
    async runPost(action, filename, metadata, driver) {
        return this.run(
            PROCESSOR_TYPES.PROCESSOR_TYPE_POST,
            action,
            filename,
            metadata,
            driver
        );
    }
}

module.exports = notStoreDriverProcessors;
