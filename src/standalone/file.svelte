<script>
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import { Confirmation } from "./confirm.js";
    import * as FileStores from "./file.stores.js";

    export let progress = 0;
    export let selected = false;
    export let notUploaded = false;
    export let selectMany = false;
    export let hideDeleteButton = false;
    //export let elementSize = 3;

    export let storeId;

    export let data = {
        name: "default.file.name",
        size: 1000,
        preview: false,
    };

    onMount(() => {
        FileStores.get(storeId).selected.subscribe((value) => {
            if (value.indexOf(data.uuid) > -1) {
                selected = true;
            } else {
                selected = false;
            }
        });
    });

    function onClick() {
        FileStores.get(storeId).selected.update((value) => {
            if (value.indexOf(data.uuid) > -1) {
                value.splice(value.indexOf(data.uuid), 1);
            } else {
                if (selectMany) {
                    value.push(data.uuid);
                } else {
                    value.splice(0, value.length, data.uuid);
                }
                dispatch("selected");
            }
            return value;
        });
    }

    function remove() {
        Confirmation.ask({
            title: `Удаление файла (${data.name}) `,
            text: "Файл будет удалён без возможнеости восстановления!",
            approval: "Удалить файл?",
        })
            .then(() => {
                dispatch("remove", data);
            })
            .catch(() => {});
    }

    $: ifSelected = selected ? "selected" : "";
</script>

<div
    class="column file-tile is-one-quarter-desktop is-half-mobile {ifSelected}"
    onclick={onClick}
    onkeypress={onClick}
    data-uuid={data.uuid}
    aria-label="file thumb"
    role="gridcell"
    tabindex="0"
>
    {#if notUploaded}
        <progress class="progress is-link" value={progress} max="100"
            >{progress}%</progress
        >
    {/if}
    {#if data.path}
        <figure class="image is-4by3">
            {#if !hideDeleteButton}
                <button
                    class="delete"
                    onclick={remove}
                    aria-label="delete button"
                ></button>
            {/if}
            <img
                draggable="true"
                src={data.info?.variantURL?.micro || data.cloud.Location}
                alt={data.name}
                crossorigin="anonymous"
            />
            <div draggable="true" class="middle">
                <div class="text">{data.name}</div>
            </div>
        </figure>
    {/if}
</div>
