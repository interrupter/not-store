const path = require('path');

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
	},
  initialize: ()=>{
    
  }
};
