define(['wbase'],function(W){
	var delayon = function() {
		var $el = arguments[0];
		var timeout = arguments[1];
		var event = arguments[2];
		var fn;
		var i=2;
		if (typeof arguments[3] == 'function') {
			fn = arguments[3];
			i=3;
		}
		i++;
		
		var args=new Array();
		var j=0;
		for(;i<arguments.length;i++){
			args[j]=arguments[i];
			j++;
		}
		
		var delegatefn = function() {
			if (!(timeouthandler === void 0)) {
				clearTimeout(timeouthandler)
			}
			if (!(fn === void 0))
				fn(args);
		}
		var timeouthandler = setTimeout(delegatefn, timeout);
		$el.on(event, delegatefn);
	};
	W.delayon = delayon;
	return W;	
});