<script>

	import { onMount } from 'svelte';
	import UploaderComponent from './upload.svelte';
	import StorageComponent from './storage.svelte';
	import {
		createEventDispatcher
	} from 'svelte';
	const dispatch = createEventDispatcher();
	import * as FileStores from './file.stores.js';
	import {
		Confirmation
	} from './confirm.js';

	onMount(() => {
		FileStores.get(id).files.subscribe(value => {
			console.log(popup, show);
			files = value;
		});
		FileStores.get(id).selected.subscribe(value => {
			selected = value;
		});
	});

	export let id;

	export let files = [];

	export let selected = [];
	export let selectMany;
	export let show = true;
	export let popup = true;
	export let elementSize = 3;

	export let onReject;
	export let onResolve;

	function closePopup() {
		show = false;
	}

	function resolvePopup() {
		closePopup();
		if (selected.length) {
			let images = files.filter((file) => {
				return selected.indexOf(file.uuid) > -1;
			});
			if (onResolve) {
				onResolve(images);
				onResolve = null;
			} else {
				dispatch('resolve', {
					selected: images
				});
			}
		} else {
			if (onResolve) {
				onResolve([]);
				onResolve = null;
			} else {
				dispatch('resolve', {
					selected: []
				});
			}
		}
	}


	function rejectPopup() {
		closePopup();
		if (onReject) {
			onReject();
			onReject = null;
		} else {
			dispatch('reject');
		}
	}


	function onChange(ev) {
		console.log('on input change', ev);
		dispatch('filesAdded', ev.detail);
	}


	function removeSelected() {
		Confirmation.ask({
				title: `Удаление файлов (${selected.length}) `,
				text: 'Файлы будут удалены без возможнеости восстановления!',
				approval: 'Удалить файлы?'
			})
			.then(() => {
				console.log('remove approved');
				dispatch('remove', {
					selected
				});
			})
			.catch(() => {
				console.log('remove disapprove');
			});
	}

	function removeFile(ev){
		console.log('removeFile', ev);
		dispatch('remove', {
			selected: ev.detail.selected
		});
	}

</script>

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
				<UploaderComponent popup="{false}" show="{true}" bind:id="{id}" on:filesAdded={onChange} />
				<StorageComponent popup="{false}" show="{true}" on:remove={removeFile} bind:id="{id}" bind:selectMany={selectMany} />
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


{#if !popup && show}
<UploaderComponent popup="{false}" show={true} id="{id}" on:filesAdded={onChange} />
<StorageComponent popup="{false}" {elementSize} show={true} on:remove={removeFile} id="{id}" selectMany={false} />
{/if}
