;(function (root) {

	var directionsProperties = {
		'viewportWidth': {type: 'global', init: _.once(function () {
			// default vars
			var callbacks = [];
			var frame = undefined;

			// value
			var value = root.viewport.getWidth();

			// api
			var api = {
				register: function (callback) {
					callbacks.push(callback);
					return api;
				},
				value: function () {
					return value;
				}
			};

			// change handlers
			var handler = function (event) {
				value = root.viewport.getWidth();

				xtag.cancelFrame(frame);
				frame = xtag.requestFrame(update);
			};
			var update = function () {
				// execute all callbacks, remove failing ones
				callbacks.filter(function (callback) {
					var success;
					try {
						callback(value);
						success = true;
					} catch (error) {
						console.error(error);
						success = false;
					} finally {
						return success;
					}
				});
			};

			// event bindings
			xtag.addEvent(window, 'resize', _.throttle(handler, 16, {leading: true, trailing: true}));

			// return
			return api;
		})},
		'features': {type: 'global', init: _.once(function () {
			// default vars
			var callbacks = [];
			var frame = undefined;

			// value
			var value = Object.keys(root.features).reduce(function (result, item) {
				result[item] = root.features[item].getStatus();
				return result;
			}, {});

			// api
			var api = {
				register: function (callback) {
					callbacks.push(callback);
					return api;
				},
				value: function () {
					return value;
				}
			};

			// change handlers
			var handler = function (property, event) {
				// evaluate new value
				value[property] = root.features[property].getStatus();

				xtag.cancelFrame(frame);
				frame = xtag.requestFrame(update);
			};
			var update = function () {
				// execute all callbacks, remove failing ones
				callbacks.filter(function (callback) {
					var success;
					try {
						callback(value);
						success = true;
					} catch (error) {
						console.error(error);
						success = false;
					} finally {
						return success;
					}
				});
			};

			// event bindings
			xtag.addEvent(window, 'online', _.partial(handler, 'online'));
			xtag.addEvent(window, 'offline', _.partial(handler, 'online')); 

			// return
			return api;
		})},
		'elementWidth': {type: 'local', init: function (element) {
			// default vars
			var callbacks = [];
			var frame = undefined;

			// value
			var value = element.clientWidth;

			// api
			var api = {
				register: function (callback) {
					callbacks.push(callback);
					return api;
				},
				value: function () {
					return value;
				}
			};

			// change handlers
			var handler = function (event) {
				value = element.clientWidth;

				xtag.cancelFrame(frame);
				frame = xtag.requestFrame(update);
			};
			var update = function () {
				// execute all callbacks, remove failing ones
				callbacks.filter(function (callback) {
					var success;
					try {
						callback(value);
						success = true;
					} catch (error) {
						console.error(error);
						success = false;
					} finally {
						return success;
					}
				});
			};

			// event bindings
			xtag.addEvent(element, 'resize', _.throttle(handler, 16, {leading: true, trailing: true}));

			// return
			return api;
		}}
	};

	var directionValues = Object.keys(directionsProperties).reduce(function (object, key) {
		var item = directionsProperties[key]; 
		if (item.type === 'global') {
			object[key] = item.init().register(function (result) {
				directionValues[key] = result;
			}).value();
		}
		return object;
	}, {});

	var xvariants = root.xvariants = {
		// lifecycle
		created: function () {
			var element = this;

			element.preferredVariant = xvariants.getPreferredVariantObject(element);

			element.directionValues = element.directionProperties.reduce(function (result, key) {
				var directionObject = xvariants.getDirectionObject(key);
				var value = directionObject.init(element).register(function (value) {
					if (directionObject.type === 'local') {
						element.directionValues[key] = value;
					}
					element.directionsChanged();
				}).value();
				return (directionObject.type === 'local') ? _.set(result, key, value) : result;
			}, {});
		},
		inserted: function () {
			var element = this;

			element.currentVariant = xvariants.tryVariant(element, element.preferredVariant, xvariants.getVariants(element));

			xvariants.renderVariant(element, element.currentVariant);
		},
		removed: function () {
			// TODO
		},

		// direction methods
		getDirectionValue: function (element, directionName) {
			return element.directionValues[directionName] === undefined ?  directionValues[directionName] : element.directionValues[directionName];
		},
		setDirectionValue: function (element, directionName, value) {
			element.directionValues[directionName] = value;
			return xvariants.getDirectionValue(element, directionName);
		},
		getElementDirectionValues: function (element) {

		},
		getDirectionObject: function (propertyName) {
			return directionsProperties[propertyName];
		},
		initDirection: function (element, directionName) {
			var directionObject = xvariants.getDirectionObject(directionName);
			return directionObject.init(element).register(function (value) {
				element.directionValues[directionName] = value;

				element.directionsChanged();
			});
		},

		// generic variant methods
		getVariants: function (element) {
			return _.values(element.variants);
		},
		getVariantObject: function (element, variantName) {
			return element.variants[variantName];
		},
		getVariantName: function (element, variantObject) {
			return variantObject.name;
		},
		defineVariants: function (variantArray) {
			return variantArray.reduce(function (result, item) {
				return _.set(result, item.name, item);
			}, {});
		},

		// preferred variant methods
		getHighestPriorityVariant: function (element) {
			return xvariants.getVariants(element).reduce(function (a, b) {
				return (a.priority > b.priority ? a : b);
			});
		},
		getPreferredVariantObject: function (element) {
			return xvariants.getVariantObject(element, (element.preferredVariantName || element.getAttribute('variant'))) || getHighestPriorityVariant(element);
		},
		getPreferredVariantName: function (element) {
			return xvariants.getPreferredVariantObject(element).name;
		},

		// current variant methods
		testVariant: function (element, variantObject) {
			return _.pairs(variantObject.directions).reduce(function (result, item) {
				var directionName = item[0];
				var callback = item[1];

				result.push(callback(xvariants.getDirectionValue(element, directionName)));
				return result;
			}, []);
		},
		tryVariant: function (element, variantObject, variants) {
			var directions = xvariants.testVariant(element, variantObject);

			if (_.every(directions, function (item) { return item === true;})) {
				// no re-directions, this variant is OK
				return variantObject;
			} else if (variants.length > 1) {
				// count directions and place in object {<directionName> : <counted>, ...}
				directions = directions.reduce(function (result, item) {
					if (typeof item === 'string') {
						return _.set(result, item, (result[item] || 0) + 1);
					} else {
						return result;
					}
				}, {});

				// remove previous attempt from list, 
				// double sort list on direction and then priority  
				variants = _.pull(variants, variantObject)
					.sort(function (a, b) {
						var directionAmount = _.get(directions, b.name, 0) + _.get(directions, a.name, 0)
						var directionDifference = _.get(directions, b.name, 0) - _.get(directions, a.name, 0);

						var priorityDifference = b.priority - a.priority;

						if (directionAmount) {
							return directionDifference ? priorityDifference : priorityDifference;
						} else {
							return priorityDifference;
						}
					});

				// recursion!
				return xvariants.tryVariant(element, variants[0], variants);
			} else {
				// last in variants-array must be it
				return variants[0];
			}
		},
		renderVariant: function (element, variantObject) {
			// TODO
			console.log('render', element, 'as', variantObject);

			// demo
			var h1 = element.querySelector('h1');
			h1.innerText = variantObject.name;
		}
	};

	return xvariants;
}(window));
