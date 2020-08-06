export default {
	fields:{
		_id(){return [];},
    fileID(){return [];},
		name(){return [];},
		size(){return [];},
		width(){return [];},
    height(){return [];},
		extension(){return [];},
	},
	form:{
		edit(){
			return {
				clean: true
			};
		}
	}
};
