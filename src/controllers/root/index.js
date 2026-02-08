import ncStore from "./ncStore.js";
import ncFile from "./ncFile.js";

import FUIFileMetadata from "../common/fields/field.ui.metadata.svelte";
import FUIStoreOptions from "../common/fields/field.ui.options.svelte";
import FUIStoreProcessors from "../common/fields/field.ui.processors.svelte";

import notStoreUIDriverOptionsAWS from "../../drivers/aws/aws.driver.options.ui.svelte";
import notStoreUIDriverOptionsLocal from "../../drivers/local/local.driver.options.ui.svelte";
import notStoreUIDriverOptionsTimeweb from "../../drivers/timeweb/timeweb.driver.options.ui.svelte";
import notStoreUIDriverOptionsYandex from "../../drivers/yandex/yandex.driver.options.ui.svelte";
import { MODULE_NAME } from "../../const.cjs";

import * as ProcessorsUIs from "../../processors/uis.js";

const uis = {
    //specialized UIs of drivers options
    notStoreUIDriverOptionsAWS,
    notStoreUIDriverOptionsLocal,
    notStoreUIDriverOptionsTimeweb,
    notStoreUIDriverOptionsYandex,
    //fields UIs
    FUIFileMetadata,
    FUIStoreOptions,
    FUIStoreProcessors,
    //processors UIs options editors and metadata viewers
    ...ProcessorsUIs
};

let manifest = {
    router: {
        manifest: [ncStore.getRoutes(), ncFile.getRoutes()],
    },
    menu: {
        side: {
            items: [
                {
                    section: "system",
                    title: "Ресурсы",
                    items: [
                        {
                            title: "Файлы",
                            href: `/${MODULE_NAME}/file`,
                        },
                        {
                            title: "Хранилища",
                            href: `/${MODULE_NAME}/store`,
                        },
                    ],
                },
            ],
        },
    },
};

export { ncFile, ncStore, manifest, uis };
