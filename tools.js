module.exports ={
	sleep: function(n) {
		n=n*1000;
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
	},

	stripos: function( f_haystack, f_needle, f_offset ){	// Find position of first occurrence of a case-insensitive string

		var haystack = f_haystack.toLowerCase();
		var needle = f_needle.toLowerCase();
		var index = 0;

		if(f_offset == undefined) {
			f_offset = 0;
		}

		if((index = haystack.indexOf(needle, f_offset)) > -1) {
			return index;
		}

		return false;
	},

}
