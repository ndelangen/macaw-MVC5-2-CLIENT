;
/* 
 * modules.js
*/
/* 
 * First test module
*/
;(function (root) {
	var xtag = root.xtag;
	var xvariants = root.xvariants;

	var variants = xvariants.defineVariants([
		{
			name: "grid",
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
						_.get(featureList, 'flexbox') &&
						_.get(featureList, 'online')
					)
				}
			}
		},
		{
			name: "grid-large",
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
						_.get(featureList, 'flexbox') &&
						_.get(featureList, 'online')
					)
				}
			}
		},
		{
			name: "list-filter",
			priority: 5,
			directions: {
				features: function (featureList) {
					if (
						_.get(featureList, 'flexbox') &&
						_.get(featureList, 'online')
					) {
						return true;
					} else {
						return "list-basic";
					}
				}
			}
		},
		{
			name: "list-basic",
			priority: 4,
			directions: {
				features: function (featureList) {
					return (_.get(featureList, 'online'));
				}
			}
		},
		{
			name: "basic",
			priority: 1,
			directions: {
				features: function (featureList) {
					return true;
				}
			}   
		}
	]);
	var directionProperties = _.uniq(_.flattenDeep(_.values(variants).map(function (item) {
		return _.keys(item.directions);
	})));

	return xtag.register('namespace-module', {
		lifecycle: {
			created: _.flow(xvariants.created, function () {
				console.log('created', this);
			}),
			inserted: _.flow(xvariants.inserted, function () {
				console.log('inserted', this);
			}),
			removed: _.flow(xvariants.removed, function () {
				console.log('removed', this);
			}),

			attributeChanged: function (name, oldValue, newValue) {
			}
		},
		methods: {
			directionsChanged: function () {
				var element = this;
				console.log('some directions changed', element);

				xvariants.tryVariant(element, element.currentVariant, xvariants.getVariants(element));
			}
		},
		accessors: {
			variants: {
				get: function () {
					return variants;
				}
			},
			directionProperties: {
				get: function () {
					return directionProperties;
				}
			},
			variant: {
				// this links the attribute 'bar' to the getter/setter xfoo.bar
				attribute: {},
				get: function () {
					// do something when the getter is accessed
				},
				set: function (value) {
					// act on the value being passed to the setter
				}
			}
		},
		events: {
		}
	});

}(window));
