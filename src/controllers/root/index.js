import ncStore from './ncStore.js';
import ncFile from './ncFile.js';
let manifest = {
	router: {
		manifest: [{
			paths: ['store\/([^\/]+)\/([^\/]+)', 'store\/([^\/]+)', 'store'],
			controller: ncStore
		}, {
			paths: ['file\/([^\/]+)\/([^\/]+)', 'file\/([^\/]+)', 'file'],
			controller: ncFile
		}]
	},
	menu: {
		side: {
			items: [{
				section: 'system',
				title: 'Ресурсы',
				items: [{
					title: 'Файлы',
					url: '/file'
				}, {
					title: 'Хранилища',
					url: '/store'
				}]
			}]
		}
	},

};

export {
	ncFile,
	ncStore,
	manifest
};
