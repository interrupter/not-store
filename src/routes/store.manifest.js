module.exports = {
	model: 'store',
	url: '/api/:modelName',
	fields: {},
	actions: {
		create: {
			method: 'PUT',
			isArray: false,
			data: ['record'],
			rules: [{
				auth: true,
				root: true
			}]
		},
		get: {
			method: 'get',
			data: ['record'],
			isArray: false,
			rules:[{
				auth: true,
				root: true
			}],
			postFix: '/:record[_id]/:actionName'
		},
		update: {
			method: 'post',
			rules:[{
				auth: true,
				root: true
			}],
			data: ['record'],
			postFix: '/:record[_id]/:actionName'
		},
		listAndCount:{
			method: 'get',
			isArray: false,
			data: ['pager', 'sorter', 'filter', 'search'],
			rules:[{
				auth: true,
				root: true
			}],
			postFix: '/:actionName'
		},
		delete: {
			method: 'DELETE',
			postFix: '/:record[_id]',
			isArray: false,
			rules: [{
				auth: true,
				root: true
			}]
		}
	}
};
