import CRUDGenericActionCreate from "not-bulma/src/frame/crud/actions/generic/create";
import UIStoreImportFromJSON from './store.import.from.json.svelte';
import { MODULE_NAME } from "not-store/src/const.cjs";
import notCommon from 'not-bulma/src/frame/common';

const DEFAULT_BREADCRUMB_TAIL = `${MODULE_NAME}:action_import_from_json_title`;

class notStoreCRUDActionImportFromJSON extends CRUDGenericActionCreate{
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

    static prepareUIOptions(controller, value) {
        const actionName = this.getModelActionName(controller);
        return {
            target: controller.getContainerInnerElement(),
            props:{                
                actionName
            }
        };
    }

    static actionButton(controller){
        return {
            title: `${MODULE_NAME}:action_import_from_json_title`,
            action(){
                controller.navigateAction(undefined,notStoreCRUDActionImportFromJSON.ACTION);
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
            //creating action UI component
            const uiComponent = this.UIConstructor;
            const response= {};
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

    static bindUIEvents(controller, params, response) {
        if (notCommon.isFunc(controller.goBack)) {
            this.bindUIEvent(controller, "reject", () => controller.goBack());
        }

        this.bindUIEvent(controller, "import", ({detail})=>{            
            notStoreCRUDActionImportFromJSON.import(controller, detail);
        });
        
    }

    static setUILoading(controller){
        controller.ui[notStoreCRUDActionImportFromJSON.ACTION].$set({loading: true});
    }

    static setUILoaded(controller){
        controller.ui[notStoreCRUDActionImportFromJSON.ACTION].$set({loading: false});
    }

    static setUIError(controller, message){
        controller.ui[notStoreCRUDActionImportFromJSON.ACTION].$set({error: message});
    }

    static async import(controller, jsonAsText){
        try{
            notStoreCRUDActionImportFromJSON.setUILoading(controller);            
            const res = await controller.getModel({import:jsonAsText})[`$${notStoreCRUDActionImportFromJSON.MODEL_ACTION_PUT}`]();            
            if(this.isResponseBad(res)){
                controller.showErrorMessage(res);
            }else{
                controller.showSuccessMessage('',`${MODULE_NAME}:action_import_success`);
                controller.navigateAction(undefined, 'list', 'NORMAL');
            }
        }catch(e){
            controller.showErrorMessage(e);
        }finally{
            notStoreCRUDActionImportFromJSON.setUILoaded(controller);
        }
        
    }
}

export default notStoreCRUDActionImportFromJSON;
