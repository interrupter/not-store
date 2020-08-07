import Validators from '../common/validators.js';

import {
	ncCRUD
} from 'not-bulma';

const LABELS = {
	plural: 'Ключи',
	single: 'Ключ',
};

class ncFile extends ncCRUD {
	constructor(app, params) {
		super(app);
		this.setModuleName('file');
		this.setOptions('names', LABELS);
		this.setOptions('Validators', Validators);
		this.setOptions('params', params);
		this.setOptions('preload', {});
		this.setOptions('list', {
			fields: [{
				path: ':fileID',
				title: 'ID',
				searchable: true,
				sortable: true
			}, {
				path: ':name',
				title: 'Имя',
				searchable: true,
				sortable: true
			}, {
				path: ':extension',
				title: 'Формат',
				searchable: true,
				sortable: true
			}, {
				path: ':bucket',
				title: 'Бакет',
				searchable: true,
				sortable: true
			}, {
				path: ':path.micro.cloud.Location',
				title: 'Превью',
				searchable: true,
				sortable: true,
				type: 'image',
			}, {
				path: ':_id',
				title: 'Действия',
				type: 'button',
				preprocessor: (value) => {
					return [{
							action: this.goDetails.bind(this, value),
							title: 'Подробнее',
							size: 'small'
						},
						{
							action: this.goUpdate.bind(this, value),
							title: 'Изменить',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, value),
							type: 'danger',
							title: 'Удалить',
							size: 'small',
							style: 'outlined'
						}
					];
				},
			}]
		});
		this.start();
		return this;
	}

	createDefault() {
		return {

		};
	}
}

export default ncFile;
