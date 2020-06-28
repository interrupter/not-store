import ncStore from './ncStore.js';
import ncFile from './ncFile.js';
let manifest = {
	router: {
		manifest: [
			{
				paths: ['store\/([^\/]+)\/([^\/]+)', 'store\/([^\/]+)', 'store'],
				controller: ncStore
			},{
				paths: ['file\/([^\/]+)\/([^\/]+)', 'file\/([^\/]+)', 'file'],
				controller: ncFile
			}
		]
	},
	menu:[{
		title: 	'Ресурсы',
    items: [{
  		title: 	'Файлы',
  		url: 		'/file'
  	},{
  		title: 	'Хранилища',
  		url: 		'/store'
  	}]
	}],
};

export {ncFile, ncStore, manifest};
