<script>
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import UploaderComponent from "./upload.svelte";
    import StorageComponent from "./storage.svelte";

    import * as FileStores from "./file.stores.js";
    import { Confirmation } from "./confirm.js";

    onMount(() => {
        FileStores.get(id).files.subscribe((value) => {
            files = value;
        });
        FileStores.get(id).selected.subscribe((value) => {
            selected = value;
        });
    });

    export let id;
    export let files = [];
    export let selected = [];
    export let selectMany;
    export let selectOnClick;
    export let short = false;
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
                dispatch("resolve", {
                    selected: images,
                });
            }
        } else {
            if (onResolve) {
                onResolve([]);
                onResolve = null;
            } else {
                dispatch("resolve", {
                    selected: [],
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
            dispatch("reject");
        }
    }

    function onSelected() {
        if (selectOnClick) {
            resolvePopup();
        }
    }

    function onChange(ev) {
        dispatch("filesAdded", ev.detail);
    }

    function removeSelected() {
        Confirmation.ask({
            title: `Удаление файлов (${selected.length}) `,
            text: "Файлы будут удалены без возможнеости восстановления!",
            approval: "Удалить файлы?",
        })
            .then(() => {
                dispatch("remove", {
                    selected,
                });
            })
            .catch(() => {
                //console.error('remove disapproved');
            });
    }

    function removeFile(ev) {
        dispatch("remove", {
            selected: ev.detail.selected,
        });
    }
</script>

{#if popup && show}
    <div class="modal is-active">
        <div
            class="modal-background"
            onclick={rejectPopup}
            onkeypress={rejectPopup}
            role="button"
            tabindex="0"
        ></div>
        <div class="modal-card box is-rounded">
            {#if !short}
                <header class="modal-card-head">
                    <p class="modal-card-title">Добавьте файлы для загрузки</p>
                    <button
                        class="delete"
                        aria-label="close"
                        onclick={closePopup}
                        tabindex="0"
                    ></button>
                </header>
            {/if}
            <section class="modal-card-body">
                <div class="container">
                    <UploaderComponent
                        show={true}
                        short={true}
                        bind:id
                        on:filesAdded={onChange}
                    />
                    <StorageComponent
                        popup={false}
                        show={true}
                        on:remove={removeFile}
                        bind:id
                        bind:selectMany
                        on:selected={onSelected}
                    />
                </div>
            </section>
            {#if !short}
                <footer class="modal-card-foot">
                    <button class="button is-success" onclick={resolvePopup}
                        >Выбрать</button
                    >
                    <button class="button is-danger" onclick={removeSelected}
                        >Удалить</button
                    >
                    <button class="button" onclick={rejectPopup}>Закрыть</button
                    >
                </footer>
            {/if}
        </div>
    </div>
{/if}

{#if !popup && show}
    <UploaderComponent show={true} {id} on:filesAdded={onChange} />
    <StorageComponent
        popup={false}
        {elementSize}
        show={true}
        on:remove={removeFile}
        {id}
        selectMany={false}
    />
{/if}
