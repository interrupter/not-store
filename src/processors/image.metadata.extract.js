const notStoreProcessor = require("../proto/processor");

class notStoreProcessorImageExtractMetadata extends notStoreProcessor{
    static async run(
        filename,           //current target file
        metadata,           //file metadata object
        preprocOptions,     //preprocessor options for this store
        driver              //driver instance
        ){
            return new Promise((resolve, reject)=>{
                sharp(filename).metadata((err, sharpMetadata) => {
                    if (err) {
                        reject(err);
                    } else {
                        Object.assign(metadata, {...sharpMetadata});                        
                        resolve(metadata);
                    }
                });
            });
    }
   
}

module.exports = notStoreProcessorImageExtractMetadata;