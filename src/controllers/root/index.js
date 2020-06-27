import ncStore from './ncStore.js';

let manifest = {
	router: {
		manifest: [
			{
				paths: ['store\/([^\/]+)\/([^\/]+)', 'store\/([^\/]+)', 'store'],
				controller: ncStore
			}
		]
	},
	menu:[{
		title: 	'Файлы',
		url: 		'/store',
    items: [{
  		title: 	'Загрузить',
  		url: 		'/store/create'
  	}]
	}],
};

export {ncStore, manifest};
