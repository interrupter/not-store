const path = require('path');
const notError = require('not-error').notError;

const notStore = require('./src/common/store');
const notStoreImage = require('./src/common/storeImage');
const notStoreAWS = require('./src/common/storeAWS');
const notStoreYandex = require('./src/common/storeYandex');

module.exports = {
  notStore,
  notStoreImage,
  notStoreAWS,
  notStoreYandex,
  name: 'not-store',
	paths: {
		routes:				path.join(__dirname, '/src/routes'),
    controllers:	path.join(__dirname, '/src/controllers'),
		models:				path.join(__dirname, '/src/models'),
    fields:       path.join(__dirname, '/src/fields'),
	},
  initialize: (notApp)=>{
    let Store = notApp.getModel('Store');
    Store.listAndCount(0, 100, {}, { active: true, __latest: true, __closed:false }, null)
      .then((results)=>{
        notApp.logger.log(`Found ${results.count} stores options`);
        if(results.count > 0){
          notApp.logger.log(`Stores init start`);
          for(let storeOpts of results.list){
            notApp.logger.log(`Adding ${storeOpts.name} via ${storeOpts.driver}`);
            try{
              let options = JSON.parse(storeOpts.options);
              let store = new module.exports[storeOpts.driver](options);
            	notStore.addInterface(storeOpts.name, store);
            }catch(e){
              notApp.logger.error(`notStore storage initialization failed; ${storeOpts.name} via ${storeOpts.driver}`);
              notApp.report(new notError('notStore storage initialization failed', { store: storeOpts }, e));
            }
          }
        }
        notApp.logger.log(`Stores init end`);
      })
      .catch((e)=>{
        notApp.logger.error(`notStore initialization failed`);
        notApp.report(new notError('notStore initialization failed', {}, e));
      });
  }
};
