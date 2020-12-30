const Pages = require("./src/Pages");

const init = (client, name) => {
    delete module.exports['init'];
    Object.defineProperty(client, name ? name : 'paginator', {
        get: function () { return module.exports['Pages']; },
            enumerable: false,
            configurable: false
    })
}

module.exports = { init, Pages };