<script>

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { Confirmation } from './confirm.js';
	import * as FileStores from './file.stores.js';
	import {
		onMount
	} from 'svelte';

	export let progress = 0;
	export let selected = false;
	export let notUploaded = false;
	export let selectMany = false;
	export let hideDeleteButton = false;

	export let bucketId;

	export let data = {
		name: 'default.file.name',
		size: 1000,
		preview: false
	};

	onMount(() => {
		FileStores.get(bucketId).selected.subscribe((value) => {
			if (value.indexOf(data.uuid) > -1) {
				selected = true;
			} else {
				selected = false;
			}
		});
	});

	function onClick() {
		FileStores.get(bucketId).selected.update((value) => {
			if (value.indexOf(data.uuid) > -1) {
				value.splice(value.indexOf(data.uuid), 1);
			} else {
				if (selectMany) {
					value.push(data.uuid);
				} else {
					value.splice(0, value.length, data.uuid);
				}
			}
			return value;
		});
	}


	function remove(ev){
		console.log('remove file', ev);
		Confirmation.ask({
			title: 		`Удаление файла (${data.name}) `,
			text: 		'Файл будет удалён без возможнеости восстановления!',
			approval: 'Удалить файл?'
		})
			.then(()=>{
				console.log('remove approved');
				dispatch('remove', data);
			})
			.catch(()=>{
				console.log('remove disapprove');
			});
	}

	$: ifSelected = selected ? 'selected' : '';


</script>

<div class="tile file is-3 is-child {ifSelected}" on:click="{onClick}" data-uuid="{data.uuid}">
	{#if notUploaded}
	<progress class="progress is-link" value="{progress}" max="100">{progress}%</progress>
	{/if}
	{#if data.path}
	<figure class="image is-4by3">
		{#if !hideDeleteButton}
		<button class="delete" on:click="{remove}"></button>
		{/if}
		<img draggable="true" src="{data.path.small.cloud.Location}"  alt={data.name}/>
		<div draggable="true" class="middle">
			<div class="text">{data.name}</div>
		</div>
	</figure>
	{/if}
</div>

<style>
	.file {
		float: left;
		margin: 1em;
		padding: 0.5em;
	}

	.file.selected {
		background-color: hsl(204, 71%, 53%);
	}

	figure.image {
		overflow: hidden;
	}

	figure.image img {
		opacity: 1;
		display: block;
		width: 100%;
		object-fit: cover;
		transition: .5s ease;
		backface-visibility: hidden;
	}

	.middle {
		transition: .5s ease;
		opacity: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		text-align: center;
	}

	button.delete{
		z-index: 1;
		position:absolute;
		right: 1.5em;
		top: 1.5em;
	}

	.image:hover img {
		opacity: 0.3;
	}

	.image:hover .middle {
		opacity: 1;
	}

	.text {
		color: #3b3b3b;
		font-size: 16px;
		padding: 16px 32px;
	}
</style>
