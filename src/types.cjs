    /**
    * @typedef {Object<string, Array<Object>>} FilesSets
    **/

    /** 
     * @typedef     {Object}    UploadResult
     * @property    {String}    [reason]
     * @property    {String}    status
     * @property    {any}       value
     **/
     
    /** 
     * @typedef {Object<string, UploadResultsSet>} UploadResultsSets
     **/ 

     /** 
     * @typedef {Array<UploadResult>} UploadResultsSet
     **/ 

    /** 
     * @typedef {Object}    UploadError
     * @property {String}   error
     * @property {String}   name
     * @property {String}   format
     * @property {String}   mimetype
     * @property {Number}   size
     **/

    /**
     *  @typedef {String|Buffer|import('node:stream').Readable} FileDataSource
     */

     /** 
     * @typedef {Object}    FileInfo
     * @property {String}   name
     * @property {FileDataSource} data
     * @property {String}   [mimetype]
     * @property {String}   [format]
     * @property {Number}   [size = 0]
     * @property {Object}   [info = {}]
     **/

 module.exports = {};