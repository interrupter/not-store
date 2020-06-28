<script>
	import 'bulma-switch';

	import {onMount} from 'svelte';
	import Common from './index.js';

	const CLASS_ERR = Common.CLASS_ERR;
	const CLASS_OK = Common.CLASS_OK;

	let overlay;
	let stage = 'filling';
	let errorMessage = false;
	let formErrors = false;
	let success = false;

	let validationErrors = {
    active:        	false,
		value:       	false,
		id: 					false
	};

	export let validation = true;
	export const  MODES = ['create', 'update'];

	export const  MODES_FIELDS = {
		'create': ['name', 'driver', 'options', 'active'],
		'update': ['name', 'driver', 'options', 'active'],
	};

	export const SUCCESS_TEXT = {
		'create': 'Хранилище создано',
		'update': 'Хранилище обновлёно'
	};

	import {createEventDispatcher} from 'svelte';
	let dispatch = createEventDispatcher();

	export let mode = 'create';
	export let loading = false;
	export let formValid = false;

	export let title = {
		__enabled: true,
		create: 'Добавление хранилища',
		update: 'Редактирование хранилища',
	};

	export let description = {
		__enabled: true,
		create:  'Заполните пожалуйств форму',
		update:  'Заполните пожалуйств форму',
	};


	export let name = Common.fieldInit('name', {enabled: true});
	export let driver = Common.fieldInit('driver', {enabled: true});
	export let options = Common.fieldInit('options', {enabled: true});
	export let active = Common.fieldInit('active', {enabled: true});

	let fields = {name, driver, options, active};

	export let submit = {
		caption: 'Отправить',
		enabled: true
	};

	export let cancel = {
		caption: 'Назад',
		enabled: true
	};

	export let item = {};

	onMount(() => {
		for(let t in item){
			if(Object.prototype.hasOwnProperty.call(fields, t)){
				fields[t].value = item[t];
			}
		}
		for(let t in fields){
			if (MODES_FIELDS[mode].indexOf(t) === -1){
				fields[t].enabled = false;
			}
		}
		fields = fields;
	});

	function collectData(){
		let result = {};
		MODES_FIELDS[mode].forEach((fieldname)=>{
			if(Object.prototype.hasOwnProperty.call(fields, fieldname) && fields[fieldname].enabled){
				result[fieldname]	 = fields[fieldname].value;
			}
		});
		if (mode === 'update'){
			result._id = item._id;
		}
		return result;
	}

	function onChange(ev){
		let data = {
			field: ev.target.name,
			value: ev.target.type === 'checkbox'?ev.target.checked:ev.target.value
		};
		if(validation){
			let res = Common.validateField(data.field, data.value, fields);
			if(res === true){
				setFieldValid(data.field);
			}else{
				setFieldInvalid(data.field, res);
			}
			validateForm(data);
		}else{
			dispatch('change', data);
		}
	}

	export function setFieldInvalid(fieldName, errors){
		validationErrors[fieldName] = errors;
		validationErrors = validationErrors
		formErrors = true;
	}

	export function setFieldValid(fieldName){
		validationErrors[fieldName] = false;
		formErrors = Object.values(validationErrors).some((val) => {return val;});
	}

	export function fieldIsValid(fieldName){
		return !Array.isArray(validationErrors[fieldName]);
	}

	export function fieldErrorsNotChanged(fieldName, errs){
		let oldErrs = validationErrors[fieldName];
		if(oldErrs === false && errs === false){
			return true;
		}else{
			if(Array.isArray(oldErrs) && Array.isArray(errs)){
				return (oldErrs.join('. ')) === (errs.join('. '));
			}else{
				return false;
			}
		}
	}

	function onInput(ev){
		let data = {
			field: ev.target.name,
			input: ev.data,
			value: ev.target.type==='checkbox'?ev.target.checked:ev.target.value
		};
		if(validation){
			let res = Common.validateField(data.field, data.value, fields);
			if(res === true){
				setFieldValid(data.field);
			}else{
				setFieldInvalid(data.field, res);
			}
			validateForm(data);
		}else{
			dispatch('input', data);
		}
	}

	function validateForm(freshData){
		if(MODES.indexOf(mode) > -1){
			let fieldsList = MODES_FIELDS[mode];
			let result = true;
			fieldsList.forEach((fieldName) => {
				if (fields[fieldName].enabled && fields[fieldName].required){
					let val = (freshData && (freshData.field === fieldName))?freshData.value:fields[fieldName].value;
					let errs = Common.validateField(fieldName, val, fields);
					if (Array.isArray(errs)){
						result = false;
					}
					if(!fieldErrorsNotChanged(fieldName, errs)){
						if(Array.isArray(errs)){
							setFieldInvalid(fieldName, errs);
						}else{
							setFieldValid(fieldName);
						}
					}
				}
			});
			formValid = result;
			return result;
		}else{
			formValid = false;
			return false;
		}
	}

	export function setFormError(error){
		formValid = false;
		errorMessage = Array.isArray(error)?error.join(', '):error;
	}

	export let tryModeAction = (e)=>{
		e && e.preventDefault();
		errorMessage = false;
		dispatch(mode, collectData());
		return false;
	};

	export function showSuccess(){
		success = true;
	}

	export let rejectForm = ()=>{
		loading = true;
		dispatch('rejectForm');
	}

	export function setLoading(){
		loading = true;
	}

	export function resetLoading(){
		loading = false;
	}

	$: nameHelper = validationErrors.name?validationErrors.name.join(', '):fields.name.placeholder;
	$: nameClasses = validationErrors.name?CLASS_ERR:CLASS_OK;

	$: valueHelper = validationErrors.options?validationErrors.options.join(', '):fields.options.placeholder;
	$: valueClasses = validationErrors.options?CLASS_ERR:CLASS_OK;

	$: driverHelper = validationErrors.driver?validationErrors.driver.join(', '):fields.driver.placeholder;
	$: driverClasses = validationErrors.driver?CLASS_ERR:CLASS_OK;

	$: activeHelper = validationErrors.active?validationErrors.active.join(', '):active.placeholder;
	$: activeClasses = validationErrors.active?CLASS_ERR:CLASS_OK;

	$: formInvalid = (formValid === false);

</script>

{#if success}
<div class="notification is-success">
	<h3 class="edit-form-success-message">{SUCCESS_TEXT[mode]}</h3>
</div>
{:else}
{#if title.__enabled}
<h5 class="title">{title[mode]} {#if mode==='update'}{item.name}{/if}</h5>
{/if}
{#if description.__enabled}
<h6 class="subtitle is-6">{description[mode]}</h6>
{/if}
<div class="container">
	{#if fields.name.enabled}
	<div class="field edit-form-field edit-form-name">
		<label class="label">{fields.name.label}</label>
		<div class="control has-icons-right">
			<input class="input {nameClasses}" type="text" name="name"
				invalid="{validationErrors.name}" required={fields.name.required}
				placeholder="{fields.name.placeholder}"
				bind:value={fields.name.value} on:change={onChange}
				on:input={onInput} autocomplete="name"
				aria-controls="input-field-helper-name" aria-describedby="input-field-helper-name" />
			{#if fields.name.validated === true }
			<span class="icon is-small is-right">
				{#if fields.name.valid}
				<i class="fas fa-check"></i>
				{:else}
				<i class="fas fa-exclamation-triangle"></i>
				{/if}
			</span>
			{/if}
		</div>
		<p class="help {nameClasses}" id="input-field-helper-name">
			{#if !(fields.name.validated && fields.name.valid) }{nameHelper}{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	{#if fields.driver.enabled}
	<div class="field edit-form-field edit-form-driver">
		<label class="label">{fields.driver.label}</label>
		<div class="control">
			<div class="select {driverClasses}">
				<select bind:value={fields.driver.value} on:blur={onChange} on:input={onInput}>
					{#each Common.DRIVERS as variant}
					<option value="{variant.id}">{variant.title}</option>
					{/each}
				</select>
			</div>
		</div>
		<p class="help {driverClasses}" id="input-field-helper-driver">
			{#if !(fields.driver.validated && fields.driver.valid) }{driverHelper}{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	{#if fields.options.enabled}
	<div class="edit-form-field edit-form-options field">
		<label class="label">{fields.options.label}</label>
		<div class="control has-icons-right">
			<textarea invalid="{validationErrors.options}" on:change={onChange} on:input={onInput}
			class="textarea {optionsClasses}"
			required={fields.options.required}
			bind:value={fields.options.value}
			name="value"
			placeholder="{fields.value.placeholder}" rows="10"
			aria-controls="input-field-helper-options" aria-describedby="input-field-helper-options"
			></textarea>
			{#if fields.options.validated === true }
			<span class="icon is-small is-right">
					{#if fields.options.valid}
					<i class="fas fa-check"></i>
					{:else}
					<i class="fas fa-exclamation-triangle"></i>
					{/if}
			</span>
			{/if}
		</div>

		<p class="help {optionsClasses}" id="input-field-helper-options">
			{#if !(fields.options.validated && fields.options.valid) }
			{optionsHelper}
			{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	{#if fields.active.enabled}
	<div class="edit-form-field edit-form-active field">
			<input
				id="user-login-form-active-field"
				class="switch is-rounded is-success "
				bind:checked={fields.active.value}
				required={fields.active.required}
				placeholder="{fields.active.placeholder}"
				invalid="{validationErrors.active}" on:change={onChange} on:input={onInput}
				name="active" type="checkbox"
				aria-controls="input-field-helper-active" aria-describedby="input-field-helper-active"
				/>
		<label class="label" for="user-login-form-active-field">{fields.active.label}</label>
		<p class="help {activeClasses}" id="input-field-helper-active">
			{#if !(fields.active.validated && fields.active.valid) }
			{activeHelper}
			{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	<div class="buttons-row">
		{#if cancel.enabled}
		<button class="button is-outlined edit-form-cancel" on:click={rejectForm}>{cancel.caption}</button>
		{/if}
		{#if submit.enabled}
		<button on:click={tryModeAction} disabled={formInvalid} class="button is-primary is-hovered edit-form-submit pull-right">{submit.caption}</button>
		{/if}
	</div>

</div>
{/if}
