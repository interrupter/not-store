const notNode = require('not-node');

const notStoreConfigReader = require('../proto/config.reader');
const { 
    notStoreExceptionStoreIsNotActive, 
    notStoreExceptionConfigReaderError, 
    notStoreExceptionConfigIsNotExists 
} = require('../exceptions');

class notStoreConfigReaderNotStoreMongoDB extends notStoreConfigReader{
    #MODEL_NAME = 'Store';

    static async for(storeName){        
        return this.#loadConfigForStore(storeName);
    }

    static async #loadConfigForStore(storeName){
        const Store = notNode.Application.getModel(this.#MODEL_NAME);
        try{
            let config = await Store.makeQuery('findOne', {name: storeName}).exec();
            if(config){
                if(!config.active){
                   throw new notStoreExceptionStoreIsNotActive(storeName, config.driver); 
                }
                return {
                    driver: config.driver,
                    options: await notNode.Common.tryParseAsync(config.options, {})
                };
            }else{
                throw new notStoreExceptionConfigIsNotExists(store,notStoreConfigReaderNotOptions.name);
            }
        }catch(e){
            if (e instanceof notStoreExceptionConfigIsNotExists){
                throw e;
            }else if (e instanceof notStoreExceptionStoreIsNotActive){
                throw e;
            }else{
                throw  notStoreExceptionConfigReaderError(
                        storeName, 
                        notStoreConfigReaderNotOptions.name,
                        e
                    );
            }            
        }
    }
}

module.exports = notStoreConfigReaderNotStoreMongoDB;