export default class Common {
  static CLASS_OK = 'is-success';
  static CLASS_ERR = 'is-danger';
  isError(e) {
    return e instanceof Error;
  }
  static DRIVERS = [{
    id: 'notStoreYandex',
    title: 'Яндекс.Облако - изображения'
  }, {
    id: 'notStoreAWS',
    title: 'Amazon.S3 - изображения'
  }, {
    id: 'notStoreImage',
    title: 'Локальное хранение - изображения'
  }]
  isJson(item) {
    item = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }
    if (typeof item === "object" && item !== null) {
      return true;
    }
    return false;
  }
  static FIELDS = {
		name:{
			label: 'Название',
			placeholder: 'Название хранилища',
		},
		driver:{
			label: 'Тип (driver)',
			placeholder: 'Драйвер для управления данными'
		},
    options:{
			label: 'Настрйоки',
			placeholder: 'Настройки в формате JSON',
		},
		active:{
			label: 'Активна',
			placeholder: '',
		},

	}
  static validateField(field, value, fields) {
    let errors = [];
    switch (field) {
      case 'name':
        if (!validator.isLength(value, {
            min: 6
          })) {
          errors.push('Минимальная длина 6 знаков');
        }
        break;
      case 'options':
        if (!this.isJson(value)) {
          errors.push('Настройки должны быть валидным JSON');
        }
        break;
      case 'active':
        if ((value !== false) && (value !== true)) {
          errors.push('Необходимо ввести действительное значение автивности записи');
        }
        break;
      case 'driver':
        if (!this.DRIVERS.some(item => item.id === value)) {
          errors.push('Необходимо указать тип хранилища');
        }
        break;
      default:
        return false;
    }
    let res = errors.length > 0 ? errors : true;
    fields[field].validated = true;
    fields[field].valid = res === true;
    fields = fields;
    return res;
  }
  static fieldInit(type, mutation = {}) {
    let field = {
      label: '',
      placeholder: '',
      enabled: true,
      value: '',
      required: true,
      validated: false,
      valid: false
    };
    if (Object.prototype.hasOwnProperty.call(this.FIELDS, type)) {
      Object.assign(field, this.FIELDS[type]);
    }
    if (mutation) {
      Object.assign(field, mutation);
    }
    return field;
  }
};
