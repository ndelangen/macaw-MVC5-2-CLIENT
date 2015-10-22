;(function (root) {
    var xtag = root.xtag;

    var createdCallback = function () {
        console.log('created', arguments);
        console.log(this);
    };

    var elementConstructor = xtag.register('namespace-module', {
        lifecycle: {
            created: createdCallback
        }
    });

    console.log(elementConstructor);
}(window));
