module.exports = {
	model: 'store',
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
			}]
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
			postFix: '/:record[fileID]',
			isArray: false,
			rules: [{
				auth: true,
				admin: true
			}]
		}
  }
};
