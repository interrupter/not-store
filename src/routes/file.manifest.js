module.exports = {
	model: 'file',
	url: '/api/:modelName',
	fields: {},
	actions: {
		create: {
			method: 'PUT',
			isArray: false,
			data: ['record'],
			postFix: '/:bucket?',
			rules: [{
				auth: true,
				admin: true
			}, {
				auth: true,
				admin: false
			}, {
				auth: false,
				admin: false
			}]
		},
		list: {
			method: 'GET',
			isArray: true,
			data: ['pager', 'sorter', 'filter'],
			rules: [{
				auth: true,
				admin: true
			}, {
				auth: true,
				admin: false
			}, {
				auth: false,
				admin: false
			}]
		},
		listAndCount:{
			method: 'get',
			rules:[{
				auth: true,
				admin: true
			},{
				auth: true,
				role: 'admin'
			}],
			postFix: '/:actionName'
		},
		get: {
			method: 'GET',
			isArray: false,
			postFix: '/:record[_id]',
			data: ['filter','record'],
			rules: [{
				auth: true,
				admin: true
			}, {
				auth: true,
				admin: false
			}, {
				auth: false,
				admin: false
			}]
		},
		delete: {
			method: 'DELETE',
			postFix: '/:record[fileID]',
			isArray: false,
			rules: [{
				auth: true,
				admin: true
			}, {
				auth: true,
				admin: false
			}, {
				auth: false,
				admin: false
			}]
		},
	}
};
