/* global notFramework */

const ERROR_DEFAULT = 'Что пошло не так.';

import {
	Breadcrumbs,
	Table as notTable,
	UIError
} from 'not-bulma';

import Common from '../common/index.js';
import UIEdit from '../common/ui.file.edit.svelte';
import UIDetails from '../common/ui.file.details.svelte';

const BREADCRUMBS = [{ title: 'Файлы', url: '/file' }];

class ncFile extends notFramework.notController {
	constructor(app, params) {
		notFramework.notCommon.log('init site app ', params, 'list');
		super(app);
		this.ui = {};
		this.els = {};
		this.setModuleName('file');
		this.buildFrame();
		Breadcrumbs.setHead(BREADCRUMBS).render({
			root: app.getOptions('router:root'),
			target: this.els.top,
			navigate: (url) => app.getWorking('router').navigate(url)
		});
		this.route(params);
		return this;
	}

	setBreadcrumbs(tail){
		Breadcrumbs.setTail(tail).update();
	}

	buildFrame() {
		let el = document.querySelector(this.app.getOptions('crud.containerSelector', 'body'));
		while (el.firstChild) {
			el.removeChild(el.firstChild);
		}
		this.els.top = document.createElement('div');
		this.els.top.id = 'crud-top';
		this.els.top.classList.add('box');
		el.appendChild(this.els.top);
		this.els.main = document.createElement('div');
		this.els.main.id = 'crud-main';
		this.els.main.classList.add('box');
		el.appendChild(this.els.main);
		this.els.bottom = document.createElement('div');
		this.els.bottom.id = 'crud-bottom';
		this.els.bottom.classList.add('box');
		el.appendChild(this.els.bottom);
	}


	route(params = []) {
		if (params.length == 1) {
			if (params[0] === 'create') {
				return this.runCreate(params);
			} else {
				return this.runDetails(params);
			}
		} else if (params.length == 2) {
			if (params[1] === 'delete') {
				return this.runDelete(params);
			} else if (params[1] === 'update') {
				return this.runUpdate(params);
			} else {
				let routeRunnerName = 'run' + notFramework.notCommon.capitalizeFirstLetter(params[1]);
				if (this[routeRunnerName] && typeof this[routeRunnerName] === 'function') {
					return this[routeRunnerName](params);
				}
			}
		}
		return this.runList(params);
	}

	runCreate() {
		this.setBreadcrumbs([
			{
				title: 'Добавление нового',
				url: '/file/create'
			}
		]);

		if (this.ui.create) {
			return;
		} else {
			this.$destroyUI();
		}
		this.ui.create = new UIEdit({
			target: this.els.main,
			props:{
				item: this.createDefault()
			}
		});
		this.ui.create.$on('create', (ev) => {this.onCreateFormSubmit(ev.detail);});
		this.ui.create.$on('rejectForm', this.goList.bind(this));
	}

	runDetails(params) {
		this.setBreadcrumbs([
			{
				title: 'Просмотр пользователя',
				url: `/file/${params[0]}`
			}
		]);

		if (this.ui.details) {
			return;
		} else {
			this.$destroyUI();
		}
		this.make.file({_id: params[0]}).$get().then((res)=>{
			if(res.status === 'ok'){
				this.ui.details = new UIDetails({
					target: this.els.main,
					props:{
						user: notFramework.notCommon.stripProxy(res.result)
					}
				});
			}else{
				this.ui.error = new UIError({
					target: this.els.main,
					props:{
						title: 		'Произошла ошибка',
						message: 	res.error?res.error:ERROR_DEFAULT
					}
				});
			}
		})
			.catch(this.error.bind(this));
	}

	runUpdate(params) {
		this.setBreadcrumbs([
			{
				title: 'Редактирование данных',
				url: `/file/${params[0]}/update`
			}
		]);

		if (this.ui.update) {
			return;
		} else {
			this.$destroyUI();
		}
		this.make.file({_id: params[0]}).$get().then((res)=>{
			if(res.status === 'ok'){
				this.setBreadcrumbs([
					{
						title: `Редактирование данных ${res.result.fileID}#${res.result.name}`,
						url: `/file/${params[0]}/update`
					}
				]);

				this.ui.update = new UIEdit({
					target: this.els.main,
					props:{
						mode: 			'update',
						user: 			notFramework.notCommon.stripProxy(res.result)
					}
				});
				this.ui.update.$on('update', (ev) => {this.onUpdateFormSubmit(ev.detail);});
				this.ui.update.$on('rejectForm', this.goList.bind(this));
			}else{
				this.ui.error = new UIError({
					target: this.els.main,
					props:{
						title: 		'Произошла ошибка',
						message: 	res.error?res.error:ERROR_DEFAULT
					}
				});
			}
		})
			.catch(this.error.bind(this));
	}

	runDelete(params){
		this.setBreadcrumbs([
			{
				title: 'Удаление',
				url: `/file/${params[0]}/delete`
			}
		]);

		if (confirm('Удалить файл?')) {
			this.make.file({fileID: params[0]}).$delete({fileID: params[0]})
				.then(()=>{
					this.goList();
				})
				.catch((e)=>{
					this.error(e);
					this.goList();
				});
		}else{
			this.goList();
		}
	}

	runList() {
		this.setBreadcrumbs([
			{
				title: 'Список',
				url: `/file`
			}
		]);

		if (this.ui.list) {
			return;
		} else {
			this.$destroyUI();
		}

		this.ui.list = new notTable({
			options: {
				targetEl: this.els.main,
				interface: {
					combined: true,
					factory: this.make.file
				},
				endless: false,
				preload: {},
				sorter: { fileID: -1 },
				actions: [{
					title: 'Создать',
					action: this.goCreate.bind(this)
				}],
				fields: [{
					path: ':fileID',
					title: 'ID',
					searchable: true,
					sortable: true
				},{
					path: ':name',
					title: 'Имя',
					searchable: true,
					sortable: true
				}, {
					path: ':bucket',
					title: 'Бакет',
					searchable: true,
					sortable: true
				}, {
					path: ':_id',
					title: 'Действия',
					type: 'button',
					preprocessor: (value, item) => {
						return [{
							action: this.goDetails.bind(this, value),
							title: 'Подробнее',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, item.fileID),
							type: 'danger',
							title: 'Удалить',
							size: 'small',
							style: 'outlined'
						}];
					},
				}]
			}
		});
	}

	$destroyUI() {
		for (let name in this.ui) {
			this.ui[name].$destroy && this.ui[name].$destroy();
			delete this.ui[name];
		}
	}

	goCreate(){
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), 'create'].join('/'));
	}

	goDetails(value){
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), value].join('/'));
	}

	goUpdate(value){
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), value, 'update'].join('/'));
	}

	goDelete(value){
		this.app.getWorking('router').navigate('/' + [this.getModelURL(), value, 'delete'].join('/'));
	}

	goList(){
		this.app.getWorking('router').navigate('/' + this.getModelURL());
	}

	createDefault(){
		return {

		};
	}

	onCreateFormSubmit(user){
		this.ui.create.setLoading();
		this.make.file(user).$create()
			.then((res)=>{
				this.log(res);
				this.showResult(this.ui.create, res);
				if(!Common.isError(res) && !res.error){
					setTimeout(() => this.goList(this.app), 3000);
				}
			})
			.catch((e)=>{
				this.showResult(this.ui.create, e);
			});
	}

	onUpdateFormSubmit(user){
		this.ui.update.setLoading();
		this.make.file(user).$update()
			.then((res)=>{
				this.showResult(this.ui.update, res);
				if(!Common.isError(res) && !res.error){
					setTimeout(() => this.goList(this.app), 3000);
				}
			})
			.catch((e)=>{
				this.showResult(this.ui.update, e);
			});
	}

	showResult(ui, res) {
		ui.resetLoading();
		if(Common.isError(res)){
			notFramework.notCommon.report(res);
		}else{
			if(res.errors && Object.keys(res.errors).length > 0){
				if (!Array.isArray(res.error)){
					res.error = [];
				}
				Object.keys(res.errors).forEach((fieldName)=>{
					ui.setFieldInvalid(fieldName, res.errors[fieldName]);
					res.error.push(...res.errors[fieldName]);
				});
			}
			if(res.error){
				ui.setFormError(res.error);
			}
			if(!res.error ){
				ui.showSuccess();
			}
		}
	}


}

export default ncFile;
