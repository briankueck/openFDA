function log(s1,s2) {
	if (console && console.log) {
		if (s2) s1 += ' ' + s2;
		console.log(s1);
	}
}

function warn(s1,s2) {
	if (console && console.warn) {
		if (s2) s1 += ' ' + s2;
		console.warn(s1);
	}
}

function debug(s1,s2) {
	if (console && console.debug) {
		if (s2) s1 += ' ' + s2;
		console.debug(s1);
	}
}

function error(s1,s2) {
	if (console && console.error) {
		if (s2) s1 += ' ' + s2;
		console.error(s1);
	}
}

function fn(s1,s2) {
	s1 = 'fn: ' + s1
	if (s2) s1 += ' ' + s2;
	debug(s1);
}
