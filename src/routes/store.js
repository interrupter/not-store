const
	UserActions = [],
	AdminActions = [
		'create',
		'update',
		'get',
		'listAndCount',
		'delete'
	],
	MODEL_NAME = 'Store',
	MODEL_OPTIONS = {
		MODEL_NAME,
		MODEL_TITLE: 'Хранилище',
		RESPONSE: {
			full: ['get', 'update', 'delete']
		}
	},
	modMeta = require('not-meta');


exports.getIP = (req) => {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};

exports.before = (req) => {
	if (req.body) {
		req.body.session = req.session.id;
		req.body.userId = req.user._id;
		req.body.userIp = exports.getIP(req);
	}
};

modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);
