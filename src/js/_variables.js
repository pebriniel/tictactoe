
const storage = {

	read: function(key){
		var monobjet_json = sessionStorage.getItem(key);
		return(JSON.parse(monobjet_json));
	},

	write: function(key, val){
		sessionStorage.setItem(key, JSON.stringify(val));
	}
}
