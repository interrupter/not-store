import CRUDGenericActionRead from "not-bulma/src/frame/crud/actions/generic/read";
import UIStoreExportToJSON from './store.export.to.json.svelte';
import { MODULE_NAME } from "../../../const.cjs";

const DEFAULT_BREADCRUMB_TAIL = `${MODULE_NAME}:action_export_to_json_title`;

class notStoreCRUDActionExportToJSON extends CRUDGenericActionRead{
    /**
     * @static {string} ACTION this controller action name, used in URI
     */
    static get ACTION() {
        return "exportToJSON";
    }

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
     * @static {string} MODEL_ACTION    network model interface action name, used in API
     */
    static get MODEL_ACTION_GET() {
        return "exportToJSON";
    }

    /**
     * @static {object} UIConstructor    constructor of UI component
     */
    static get UIConstructor() {
        return UIStoreExportToJSON;
    }

    static actionButton(controller){
        return {
            title: `${MODULE_NAME}:action_export_to_json_title`,
            action(){
                controller.navigateAction(undefined,notStoreCRUDActionExportToJSON.ACTION);
            }
        };
    }

    static prepareUIOptions(controller, reponse) {
        const actionName = this.getModelActionName(controller);
        return {
            target: controller.getContainerInnerElement(),
            props:{
                value:reponse.result,
                actionName
            }
        };
    }
    

    static async run(controller, params) {
        try {
            //inform that we are starting
            controller.emit(`before:render:${this.ACTION}`, params);
            //if UI for this action exists exiting
            if (this.isUIRendered(controller)) {
                return;
            }
            //setting initial state of breadcrumbs tail
            this.presetBreadcrumbs(controller, params);
            const response = await this.loadData(controller, params);
            if (this.isResponseBad(response)) {
                return controller.showErrorMessage(response);
            }
            //creating action UI component
            const uiComponent = this.UIConstructor;            
            this.setUI(
                controller,
                new uiComponent(this.prepareUIOptions(controller, response))
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
}

export default notStoreCRUDActionExportToJSON;
