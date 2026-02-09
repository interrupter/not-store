<script>
    let approved = false;

    let {
        title = "title",
        text = "text",
        approval = "approval",
        onresolve = () => {},
        onreject = () => {},
        label = {
            approve: "Да",
            disapprove: "Нет",
        },
    } = $props();

    let disabled = $derived(!approved);

    function disapprove() {
        onreject();
    }

    function approve() {
        onresolve();
    }
</script>

<div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{title}</p>
            <button class="delete" aria-label="close" onclick={disapprove}
            ></button>
        </header>
        <section class="modal-card-body">
            <p>{text}</p>
            <label class="checkbox"
                ><input
                    type="checkbox"
                    class="confirm-approval"
                    bind:checked={approved}
                />
                {approval}</label
            >
        </section>
        <footer class="modal-card-foot">
            <button
                class="button is-success confirm-approve"
                {disabled}
                onclick={approve}>{label.approve}</button
            >
            <button class="button confirm-disapprove" onclick={disapprove}
                >{label.disapprove}</button
            >
        </footer>
    </div>
</div>
