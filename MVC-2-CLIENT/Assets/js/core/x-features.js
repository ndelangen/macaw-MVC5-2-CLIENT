;(function (root) {
	var features = root.features = {
		'flexbox' : {
			'getStatus': function () {
				// TODO
				return true;
			},
		},
		'online': {
			'getStatus': function () {
				return true;
			}
		}
	};
}(window));
