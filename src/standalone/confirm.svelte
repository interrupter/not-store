<script>
	let approved = false;
	export let title = 'title';
	export let text = 'text';
	export let approval = 'approval';
	export let resolve = ()=>{};
	export let reject = ()=>{};
	export let label = {
		approve:     'Да',
		disapprove:   'Нет'
	};
	$:disabled = !approved;

	function disapprove(){
		reject();
	}

	function approve(){
		resolve();
	}

</script>

<div class="modal is-active">
	<div class="modal-background"></div>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">{title}</p>
			<button class="delete" aria-label="close" on:click={disapprove}></button>
		</header>
		<section class="modal-card-body">
			<p>{text}</p>
			<label class="checkbox"><input type="checkbox" class="confirm-approval" bind:checked={approved}> {approval}</label>
		</section>
		<footer class="modal-card-foot">
			<button class="button is-success confirm-approve" {disabled} on:click={approve}>{label.approve}</button>
			<button class="button confirm-disapprove" on:click={disapprove}>{label.disapprove}</button>
		</footer>
	</div>
</div>
