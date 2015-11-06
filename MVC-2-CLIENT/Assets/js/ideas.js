
variant switch mechanism

-determin initial from prefered variant

declarative:

list condition per variant?

variant-a: {
	conditions: [
		{width: 500-1000},
		{features: flexbox}
	],
	related: {
		down: variant-b
	}
}

variant-b {
	conditions: [
		{width: 0-4000}
	],
	related: {
		up: variant-a,
		down: variant-c
	}
}

functional:

variant-a {
	lifecycle: {
		conditionChange: function (conditions) {
			if (condition.features.flexbox) {
				if (conditions.width < 500) {
					// switch
				} else if (conditions.width > 1000) {
					// switch
				}
			} else {
				// switch
			}
		}
	},
	conditions: [
		"elementWidth",
		"viewportWidth"
		"features"
	]
}

sometimes, you know which variant to go to, sometimes you just want to reject


variant-a {
	requirements: {
		elementWidth: function testElementWidth (value) {
			return (value > 500 && value < 1000);
		},
		viewportWidth: function testViewportWidth (value) {
			return (value > 500);
		},
		features: function testFeatures (featureList) {
			return (
				featureList.has('flexbox') &&
				featureList.has('online')
			)
		}
	},
	directions: {
		elementWidth: function (value) {
			if (value > 1000) {
				return "variant-a-large"
			} else if (value > 500) {
				return "variant-b"
			}
		}
	}
}


variantSwitch = function (variantName) {
	if (module.requirementsmet(variant[variantName].requirements)) {
		// do it
	} else {

	}
	
}




try variant
	list directionFunctions
	get values
	run all directionFunctions with values

get list of misdirections
combine with total variant list
try first in list (try variant)
no misdirections ? try next in list (try variant)





global.viewport = {
	getWidth: function () {
		return document.body.scrollWidth;
	}
}

global.features = {
	'online' = {
		getStatus: function () {
			return navigator.online;
		}
	},
	'flexbox' = {
		getStatus: function () {
			return ('flex' in document.body.style)
		}
	}
}

global.directionsProperties = {
	'viewportWidth': {type: 'global', init: function (callback) {

		var frame = undefined;

		var handler = function (event) {
			xtag.cancelFrame(frame);
			frame = xtag.requestFrame(update);
		};
		var update = function () {
			callback(global.viewport.getWidth());
		};

		xtag.addEvent(window, 'resize', _.throttle(handler, 16, {leading: true, trailing: true}));

		return callback(global.viewport.getWidth());
	}},
	'features': {type: 'global', init: function (callback) {

		var features = {};
		var frame = Object.keys(global.features).reduce(function (result, item) {
			result[item] = global.features[item].getStatus();
			return result;
		}, {});;

		var handler = function (property, event) {
			xtag.cancelFrame(frame);

			features[property] = global.features[property].getStatus();
			frame = xtag.requestFrame(update);
		};
		var update = function () {
			callback(features);
		};

		xtag.addEvent(window, 'online', _.partial(handler, 'online'));
		xtag.addEvent(window, 'offline', _.partial(handler, 'online'));	

		callback(features);
	}},
	'elementWidth': {type: 'local', init: function (element, callback) {

		var frame = undefined;

		var handler = function (event) {
			xtag.cancelFrame(frame);
			frame = xtag.requestFrame(update);
		};
		var update = function () {
			callback(element.clientWidth);
		};

		xtag.addEvent(element, 'resize', _.throttle(handler, 16, {leading: true, trailing: true}));

		return callback(element.clientWidth);
	}}
};

global.directionObject = Object.keys(global.directionsProperties).reduce(function (object, key) {
	var item = global.directionsProperties[key]; 
	if (item.type === 'global') {
		object[key] = item.init(function (result) {
			global.directionObject[key] = result;
		});
	}
	return object;
}, {});







module.variants = {
	"grid": {
		priority: 10,
		directions: {
			elementWidth: function (value) {
				if (value < 500) {
					return "list-filter";
				} else if (value < 1000) {
					return true;
				} else {
					return "grid-large";
				}
			},
			viewportWidth: function (value) {
				if (value > 500) {
					return true;
				} else {
					return "list-filter";
				}
			},
			features: function (featureList) {
				return (
					featureList.has('flexbox') &&
					featureList.has('online')
				)
			}
		}
	},
	"grid-large": {
		priority: 11,
		directions: {
			elementWidth: function (value) {
				if (value < 1000) {
					return "grid";
				} else if (value > 1000) {
					return true;
				}
			},
			features: function (featureList) {
				return (
					featureList.has('flexbox') &&
					featureList.has('online')
				)
			}
		}
	},
	"list-filter": {
		priority: 5,
		directions: {
			features: function (featureList) {
				if (
					featureList.has('flexbox') &&
					featureList.has('online')
				) {
					return true;
				} else {
					return "list-basic";
				}
			}
		}
	},
	"list-basic": {
		priority: 4,
		directions: {
			features: function (featureList) {
				return (featureList.has('online'));
			}
		}
	},
	"basic": {
		priority: 1,
		directions: {
			features: function (featureList) {
				return true;
			}
		}	
	}
}

var createdCallback = function () {
    this.preferredVariantName = this.getPreferredVariantName();
};

var injectCallback = function () {
    this.tryVariant(this.preferredVariantName);
}


module.methods.getDirectionValue = function (directionName) {
	return (this.directionObject[directionName]) || (global.directionObject[directionName]);
};
module.methods.setDirectionValue = function (directionName, value) {
	this.directionObject[directionName] = value;
};

module.methods.initDirectionProperty = function (propertyName) {
	var element = this;
	return global.directionsProperties[propertyName].init(element, function (value) {
		element.directionObject[propertyName] = value;
	});
}

module.methods.getPreferredVariantName = function () {
	return (
		this.preferredVariantName ||
		this.getAttribute('variant') ||
		Object.keys(module.variants).reduce(function (a, b) {
			return (module.variant[a].priority > module.variant[b].priority ? a : b);
		});
	)
};

module.methods.tryVariant = function (variantName) {
	var element = this;
	var variant = module.variants[variantName];

	if ()

	var directions = Object.keys(variant.directions).map(this.getDirectionValue);
}

module.accessors.directions = {
	get: function () {
		return this.activeVariant.directions;
	}
}

module.accessors.activeVariant = {
	set: function (variant) {
		this.activeVariantName = variant.name;
	}

};

module.accessors.activeVariantName = {
	attribute: {
		name: 'variant'
	},
	get: function () {
		return this.activeVariant.name;
	},
	set: function (variantName) {
		if (this.isVariantStable) {
			this.tryVariant(variantName);
		}
	}
}

module.accessors.preferredVariantName = {
}

module.accessors.directionObject = {
}


moduleSystem.tryVariant(element, variantName)


