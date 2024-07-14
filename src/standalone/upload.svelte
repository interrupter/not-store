<script>
    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    import NotFileUpload from "./file.upload.svelte";
    import * as FileStores from "./file.stores.js";

    let dropzone;

    export let id;
    export let uploads = [];
    //export let popup = false;
    export let show = false;
    export let short = false;

    export let fieldname = "file";
    export let accept = "image/*";
    export let multiple = true;

    onMount(() => {
        FileStores.get(id, true).uploads.subscribe((value) => {
            uploads = value;
        });
        if (dropzone) {
            initDropzone();
        }
    });

    function initDropzone() {
        dropzone.addEventListener("dragenter", function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add("has-background-white");
        });
        dropzone.addEventListener("dragleave", function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove("has-background-white");
        });

        // DROP TO UPLOAD FILE
        dropzone.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        dropzone.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove("has-background-white");
            dispatch("filesAdded", e.dataTransfer.files);
        });
    }

    function closePopup() {
        show = false;
    }

    export function resolvePopup() {
        closePopup();
        dispatch("resolve");
    }

    function onChange(ev) {
        dispatch("filesAdded", ev.target.files);
    }
</script>

{#if show}
    <div
        class="box has-background-light is-size-4-desktop is-size-5-mobile dropzone"
        bind:this={dropzone}
    >
        <label for="file">
            <form action="./">
                <input
                    class="file-input"
                    type="file"
                    name={fieldname}
                    {accept}
                    {multiple}
                    on:change={onChange}
                />
                Выберите изображения для загрузки
            </form>
        </label>
    </div>
    {#if uploads.length === 0}
        <div class="previews has-text-centered">
            <h2 class="subtitle">Нет загружаемых файлов</h2>
        </div>
    {:else}
        <div class="previews {short ? 'short' : 'long'}">
            {#if uploads.length > 0}
                {#each uploads as upload}
                    <NotFileUpload data={upload} />
                {/each}
            {/if}
        </div>
    {/if}
{/if}

<style>
    .previews {
        width: 100%;
        text-align: center;
        padding: 1em;
    }

    .previews.long {
        height: 30vh;
    }

    .previews.short {
        height: 10vh;
    }

    .dropzone {
        width: 100%;
        height: 200px;
        align-items: stretch;
        display: flex;
        justify-content: center;
        position: relative;
    }

    .dropzone form {
        width: 100%;
        justify-content: center;
        width: 100%;
        text-align: center;
        padding: 2em;
    }

    .dropzone label {
        width: 100%;
        height: 100%;
    }

    @media screen and (max-width: 700px) {
        .dropzone {
            width: 100%;
            height: 100px;
        }

        .dropzone form {
            padding: 0.5em;
        }
    }
</style>
