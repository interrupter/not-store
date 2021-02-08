import Validators from '../common/validators.js';

import {
  ncCRUD
} from 'not-bulma';

const MODULE_NAME = '';
const MODEL_NAME = 'file';
const ERROR_DEFAULT = 'Что-то пошло не так!';

const LABELS = {
  plural: 'Файлы',
  single: 'Файл',
};

class ncFile extends ncCRUD {
  constructor(app, params) {
    super(app, `${MODEL_NAME}`);
    this.setModuleName(MODULE_NAME);
    this.setModelName(MODEL_NAME);
    this.setOptions('names', LABELS);
    this.setOptions('Validators', Validators);
    this.setOptions('params', params);
    this.setOptions('list', {
			interface: {
				factory: 				this.getModel(),
				combined: 			true,
				combinedAction: 'listAndCount'
			},
			pager: {
				size: 100,
				page: 0
			},
			sorter:{
				fileID: -1
			},
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
          }, {
            action: this.goUpdate.bind(this, value),
            title: 'Изменить',
            size: 'small'
          }, {
            action: this.goDelete.bind(this, value),
            type: 'danger',
            title: 'Удалить',
            size: 'small',
            style: 'outlined'
          }];
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

  getItemTitle(item){
		return item.fileID + '#' + item.name;
	}
}

export default ncFile;
