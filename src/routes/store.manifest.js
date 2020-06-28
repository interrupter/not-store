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
				admin: true
			}]
		},
		get: {
			method: 'get',
			data: ['record'],
			isArray: false,
			rules:[{
				auth: true,
				admin: true
			}],
			postFix: '/:record[_id]/:actionName'
		},
		update: {
			method: 'post',
			rules:[{
				auth: true,
				admin: true
			}],
			data: ['record'],
			postFix: '/:record[_id]/:actionName'
		},
		listAndCount:{
			method: 'get',
			isArray: false,
			rules:[{
				auth: true,
				admin: true
			}],
			postFix: '/:actionName'
		},
		delete: {
			method: 'DELETE',
			postFix: '/:record[_id]',
			isArray: false,
			rules: [{
				auth: true,
				admin: true
			}]
		}
  }
};
