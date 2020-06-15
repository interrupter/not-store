const path = require('path');
const notStore = require('../../');
const uuidv4   = require('uuid').v4;

const store = require('../../').notStore;

const FILE_COUNT = 4;

const FILES = [
	path.resolve(__dirname, '../browser/files/cyber_1.jpg'),
	path.resolve(__dirname, '../browser/files/cyber_2.jpg'),
	path.resolve(__dirname, '../browser/files/samurai.jpg'),
	path.resolve(__dirname, '../browser/files/snake.jpg'),
	path.resolve(__dirname, '../browser/files/witcher.jpg'),

	path.resolve(__dirname, '../browser/files/alps_1.jpg'),
	path.resolve(__dirname, '../browser/files/alps_2.jpg'),
	path.resolve(__dirname, '../browser/files/alps_3.jpg'),

	path.resolve(__dirname, '../browser/files/castle_1.jpg'),
	path.resolve(__dirname, '../browser/files/castle_2.jpg'),
	path.resolve(__dirname, '../browser/files/castle_3.jpg'),
	path.resolve(__dirname, '../browser/files/castle_4.jpg'),
	path.resolve(__dirname, '../browser/files/castle_5.jpg'),

	path.resolve(__dirname, '../browser/files/boats.jpg'),
  path.resolve(__dirname, '../browser/files/bone.tomahawk.jpg'),
  path.resolve(__dirname, '../browser/files/doge.png'),
];

const AUTHS = {
	root: {},
	user: {},
	guest: {}
};

for(let t in AUTHS){
	if(t === 'empty'){ continue; }
	Object.assign(AUTHS[t], {
		session:{
			id: `${t}_session`
		},
		user:{
			role: t
		},
		connection:{
			remoteAddress: '127.0.0.1'
		},
		get(){return null;}
	});
}

function initFileStore(notApp, config){
	notApp.log('Setting up test file stores...');

	let storeConfig = config.get('modules:store');

	storeConfig.common.tmp = path.resolve(__dirname, '../node', storeConfig.common.tmp);
	notApp.log(storeConfig);
	notApp.log(`Store temp dir ${storeConfig.common.tmp}`);
	let store = new notStore.notStoreYandex(storeConfig.common);
	notStore.notStore.addInterface('client', store);
	let storeRoot = new notStore.notStoreYandex(storeConfig.common);
	notStore.notStore.addInterface('root', storeRoot);
}

function shutDown(){
	let File = notApp.getModel('not-store//File');
	File.listAll().then(async (list)=>{
		for(let file of list ){
			await store.delete(file.bucket, file.metadata);
		}
		process.exit(0);
	})
	.catch((err)=>{
		console.error(err);
		process.exit(1);
	});
}

module.exports = async (notApp, config)=>{
  try{
		process.on('SIGTERM', shutDown);
		process.on('SIGINT', shutDown);
    initFileStore(notApp, config);
    //creating few records for files
    let routes = notApp.getModule('not-store').getRoute('file');
		let t = 0;
		for(let role in AUTHS){
			console.log(role, AUTHS[role]);
			for(let i = 0; i < FILE_COUNT; i++){
				t++;
				t = t % FILES.length;
				let filePath = FILES[t];
				await routes.uploadFile(AUTHS[role], role==='root'?'root':'client', filePath, {
					name: path.parse(filePath).name,
					size: t,
					format: path.parse(filePath).ext.slice(1)
				});
	    }
		}
  }catch(e){
    notApp.report(e);
  }
}
