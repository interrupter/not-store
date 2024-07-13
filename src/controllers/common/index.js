import UIUser from "./UIUser.svelte";
import UIFileInfo from "./UIFileInfo.svelte";

import UISelectFile from "./ui/ui.select.file.svelte";
import UIUploadFileModal from "./ui/ui.upload.file.modal.svelte";
import UIUploadFile from "./ui/ui.upload.file.svelte";

const uis = { UIFileInfo, UIUser, UISelectFile,UIUploadFileModal,UIUploadFile };

import nsStore from './nsStore';

const services = {nsStore};

export { uis, services };
