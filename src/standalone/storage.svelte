<script>

	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { Confirmation } from './confirm.js';

	import * as FileStores from './file.stores.js';
	import NotFileItem from './file.svelte';

	export let files = [];
	export let selected = [];
	export let id;
	export let selectMany;
	export let popup = false;
	export let show = false;

	export let onReject;
	export let onResolve;

	onMount(() => {
		FileStores.get(id).files.subscribe(value => {
			files.forEach((file, id)=>{file.id = id;});
			files = value;
		});
		FileStores.get(id).selected.subscribe(value => {
			selected = value;
		});
	});

	export function updateFiles(newFiles) {
		FileStores.get(id).update((oldFiles)=>{
			oldFiles.splice(0, oldFiles.length, ...newFiles);
			return oldFiles;
		});
	}

	function closePopup(){
		show = false;
	}

	function rejectPopup(){
		closePopup();
		if(onReject){
			onReject();
			onReject = null;
		}else{
			dispatch('reject');
		}
	}

	function resolvePopup(){
		closePopup();
		if(selected.length){
			let images = files.filter((file)=>{
				return selected.indexOf(file.uuid)>-1;
			});
			if(onResolve){
				onResolve(images);
				onResolve = null;
			}else{
				dispatch('resolve', {selected: images});
			}
		}else{
			if(onResolve){
				onResolve([]);
				onResolve = null;
			}else{
				dispatch('resolve', {selected: []});
			}
		}
	}

	function removeSelected(){
		Confirmation.ask({
			title: 		`Удаление файлов (${selected.length}) `,
			text: 		'Файлы будут удалены без возможнеости восстановления!',
			approval: 'Удалить файлы?'
		})
			.then(()=>{
				console.log('remove approved');
				dispatch('remove', {selected});
			})
			.catch(()=>{
				console.log('remove disapprove');
			});
	}

	function removeFile(ev){
		console.log('removeFile', ev);
		dispatch('remove', {
			selected: [ev.detail.uuid]
		});
	}

</script>

{#if !popup && show}
<div class="container">
	<div class="file-list">
		{#each files as file, index}
		<NotFileItem bind:data={file} bucketId={id} selectMany={selectMany} on:remove={removeFile} />
		{/each}
	</div>
</div>
{/if}

{#if popup && show}
<div class="modal is-active">
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Выберите файл</p>
			<button class="delete" aria-label="close" on:click="{closePopup}"></button>
		</header>
		<section class="modal-card-body">
			<div class="container">
				<div class="file-list">
					{#each files as file(file.id)}
					<NotFileItem bind:data={file} bucketId={id} selectMany={selectMany} on:remove={removeFile}/>
					{/each}
				</div>
			</div>
		</section>
		<footer class="modal-card-foot">
			<button class="button is-success" on:click="{resolvePopup}">Выбрать</button>
			<button class="button is-danger" on:click="{removeSelected}">Удалить</button>
			<button class="button" on:click="{rejectPopup}">Закрыть</button>
		</footer>
	</div>
</div>
{/if}

<style>
	.container {
		display: block;
		width: 100%;
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
	}
</style>
