import CRUDGenericActionCreate from "not-bulma/src/frame/crud/actions/generic/create";
import UIStoreImportFromJSON from "./store.import.from.json.svelte";
import { MODULE_NAME } from "./../../../const.cjs";
import notCommon from "not-bulma/src/frame/common";

const DEFAULT_BREADCRUMB_TAIL = `${MODULE_NAME}:action_import_from_json_title`;

class notStoreCRUDActionImportFromJSON extends CRUDGenericActionCreate {
    static get deafultBreadcrumbsTail() {
        return DEFAULT_BREADCRUMB_TAIL;
    }

    static get breadcrumbsTails() {
        return {
            preset: DEFAULT_BREADCRUMB_TAIL,
            set: DEFAULT_BREADCRUMB_TAIL,
        };
    }

    /**
     * @static {string} ACTION this controller action name, used in URI
     */
    static get ACTION() {
        return "importFromJSON";
    }

    static get MODEL_ACTION_GET() {
        return undefined;
    }

    static get MODEL_ACTION_PUT() {
        return "importFromJSON";
    }

    /**
     * @static {object} UIConstructor    constructor of UI component
     */
    static get UIConstructor() {
        return UIStoreImportFromJSON;
    }

    static prepareUIOptions(controller) {
        const actionName = super.getModelActionName(controller);
        return {
            props: {
                actionName,
            },
            target: controller.getContainerInnerElement(),
        };
    }

    static actionButton(controller) {
        return {
            action() {
                controller.navigateAction(
                    undefined,
                    notStoreCRUDActionImportFromJSON.ACTION
                );
            },
            title: `${MODULE_NAME}:action_import_from_json_title`,
        };
    }

    static async run(controller, params) {
        try {
            //inform that we are starting
            controller.emit(`before:render:${this.ACTION}`, params);
            //if UI for this action exists exiting
            if (super.isUIRendered(controller)) {
                return;
            }
            //setting initial state of breadcrumbs tail
            super.presetBreadcrumbs(controller, params);
            //creating action UI component
            const uiComponent = this.UIConstructor;
            const response = {};
            super.setUI(
                controller,
                new uiComponent(super.prepareUIOptions(controller, response))
            );
            //bind events to UI
            this.bindUIEvents(controller, params, response);
            //inform that we are ready
            controller.emit(`after:render:${this.ACTION}`, params, response);
        } catch (e) {
            //informing about exception
            controller.emit(`exception:render:${this.ACTION}`, params, e);
            //reporting exception
            controller.report(e);
            //showing error message
            controller.showErrorMessage(e);
        }
    }

    static bindUIEvents(controller) {
        if (notCommon.isFunc(controller.goBack)) {
            super.bindUIEvent(controller, "reject", () => controller.goBack());
        }

        super.bindUIEvent(controller, "import", ({ detail }) => {
            notStoreCRUDActionImportFromJSON.import(controller, detail);
        });
    }

    static setUILoading(controller) {
        super.getUI(controller).$set({ loading: true });
    }

    static setUILoaded(controller) {
        super.getUI(controller).$set({ loading: false });
    }

    static setUIError(controller, message) {
        super.getUI(controller).$set({ error: message });
    }

    static async import(controller, jsonAsText) {
        try {
            notStoreCRUDActionImportFromJSON.setUILoading(controller);
            const actionName = `$${notStoreCRUDActionImportFromJSON.MODEL_ACTION_PUT}`;
            const model = controller.getModel({ import: jsonAsText });
            const res = await model[actionName]();
            if (super.isResponseBad(res)) {
                controller.showErrorMessage(res);
            } else {
                controller.showSuccessMessage(
                    "",
                    `${MODULE_NAME}:action_import_success`
                );
                controller.navigateAction(undefined, "list", "NORMAL");
            }
        } catch (e) {
            controller.showErrorMessage(e);
        } finally {
            notStoreCRUDActionImportFromJSON.setUILoaded(controller);
        }
    }
}

export default notStoreCRUDActionImportFromJSON;
