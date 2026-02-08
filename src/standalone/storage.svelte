<script>
    //let dragMaster = null;
    let inlineList = null;
    let modalList = null;

    import { onMount } from "svelte";

    import { Confirmation } from "./confirm.js";
    import * as FileStores from "./file.stores.js";
    import NotFileItem from "./file.svelte";

    let {
        files = [],
        selected = [],
        id,
        selectMany,
        popup = false,
        show = false,
        elementSize = 3,
        onReject = null,
        onResolve = null,
        onreject = () => {},
        onresolve = () => {},
        onselected = () => {},
        onremove = () => {},
    } = $props();

    /*
	function getListContainer() {
		if (modalList) {
			return modalList.querySelectorAll('.file-list');
		} else if (inlineList) {
			return inlineList.querySelectorAll('.file-list');
		} else {
			return false;
		}
	}
*/

    onMount(() => {
        FileStores.get(id).files.subscribe((value) => {
            files.forEach((file, id) => {
                file.id = id;
            });
            files = value;
        });
        FileStores.get(id).selected.subscribe((value) => {
            selected = value;
        });
    });

    export function updateFiles(newFiles) {
        FileStores.get(id).update((oldFiles) => {
            oldFiles.splice(0, oldFiles.length, ...newFiles);
            return oldFiles;
        });
    }

    function closePopup() {
        show = false;
    }

    function rejectPopup() {
        closePopup();
        if (onReject) {
            onReject();
            onReject = null;
        } else {
            onreject();
        }
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
                onresolve({
                    selected: images,
                });
            }
        } else {
            if (onResolve) {
                onResolve([]);
                onResolve = null;
            } else {
                onresolve({
                    selected: [],
                });
            }
        }
    }

    function removeSelected() {
        Confirmation.ask({
            title: `Удаление файлов (${selected.length}) `,
            text: "Файлы будут удалены без возможнеости восстановления!",
            approval: "Удалить файлы?",
        })
            .then(() => {
                console.log("remove approved");
                onremove({
                    selected,
                });
            })
            .catch(() => {
                console.log("remove disapprove");
            });
    }

    function removeFile(ev) {
        console.log("removeFile", ev);
        onremove({
            selected: [ev.uuid],
        });
    }
</script>

{#if !popup && show}
    <div class="file-list-wrapper" bind:this={inlineList}>
        <div class="file-list columns is-mobile is-multiline">
            {#each files as file, index}
                <NotFileItem
                    bind:data={file}
                    {elementSize}
                    storeId={id}
                    {selectMany}
                    onremove={removeFile}
                    {onselected}
                />
            {/each}
        </div>
    </div>
{/if}

{#if popup && show}
    <div class="modal is-active" bind:this={modalList}>
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Выберите файл</p>
                <button class="delete" aria-label="close" onclick={closePopup}
                ></button>
            </header>
            <section class="modal-card-body">
                <div class="file-list columns is-multiline">
                    {#each files as file (file.id)}
                        <NotFileItem
                            bind:data={file}
                            storeId={id}
                            {selectMany}
                            onremove={removeFile}
                            {onselected}
                        />
                    {/each}
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" onclick={resolvePopup}
                    >Выбрать</button
                >
                <button class="button is-danger" onclick={removeSelected}
                    >Удалить</button
                >
                <button class="button" onclick={rejectPopup}>Закрыть</button>
            </footer>
        </div>
    </div>
{/if}

<style>
    .file-list {
        margin: 0px !important;
    }

    .file-list-wrapper {
        height: 25vh;
        overflow-y: scroll;
        overflow-x: hidden;
    }
</style>
