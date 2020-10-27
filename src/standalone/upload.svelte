<script>
	import {
		createEventDispatcher
	} from 'svelte';
	const dispatch = createEventDispatcher();

	import NotFileUpload from './file.upload.svelte';
	import * as FileStores from './file.stores.js';
	import {
		onMount
	} from 'svelte';
	export let id;
	export let uploads = [];
	export let popup = false;
	export let show = false;
	export let short = false;

	onMount(() => {
		FileStores.get(id).uploads.subscribe(value => {
			uploads = value;
		});
	});

	function closePopup(){
		show = false;
	}

	function resolvePopup(){
		closePopup();
		dispatch('resolve');
	}

	function onChange(ev) {
		console.log('on input change', ev);
		dispatch('filesAdded', ev.target.files);
	}

</script>

{#if !popup && show}
<div class="file is-boxed dropzone">
	<label class="file-label">
		<form action="./">
			<input class="file-input" type="file" name="file" accept="image/*" multiple="true" on:change={onChange}>
			<span class="file-cta">
				<span class="file-label">Выберите изображения для загрузки</span>
			</span>
		</form>
	</label>
</div>
<div class="previews {short?'short':''}">
	{#if uploads.length === 0}
	<h2 class="subtitle">Нету загружаемых файлов</h2>
	{/if}
	{#if uploads.length > 0}
	{#each uploads as upload}
	<NotFileUpload bucketId={id} data={upload} />
	{/each}
	{/if}
</div>
{/if}

{#if popup && show}
<div class="modal is-active">
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Добавьте файлы для загрузки</p>
			<button class="delete" aria-label="close" on:click="{closePopup}"></button>
		</header>
		<section class="modal-card-body">
			<div class="container">
				{#if uploads.length === 0}
				<h2 class="subtitle">Нету загружаемых файлов</h2>
				{/if}
				{#if uploads.length > 0}
				<div class="file-list">
					{#each uploads as upload}
					<NotFileUpload bucketId={id} data={upload} />
					{/each}
				</div>
				{/if}
			</div>
		</section>
		<footer class="modal-card-foot">
			<button class="button is-success" on:click="{resolvePopup}">Завершить</button>
		</footer>
	</div>
</div>
{/if}
<style>
	.previews {
		width: 100%;
		height: 30vh;
		text-align: center;
		padding: 1em;
	}

	.previews.short{
		height: 10vh;
	}

	.file-cta{
		width: 100%;
		text-align: center;
	}

	.file-label{
		width: 100%;
	}

	.dropzone{
		width: 100%;
	}
</style>
