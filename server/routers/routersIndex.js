const compose = require('koa-compose');
const glob = require('glob');
const { resolve } = require('path');

const registerRouter = () => {
    let routers = [];
    glob.sync(resolve(__dirname, './', '**/*.js'))
        .filter(value => (value.indexOf('routersIndex.js') === -1))
        .map(router => {
            routers.push(require(router).routes());
            routers.push(require(router).allowedMethods());
        });
    return compose(routers);
};

module.exports = registerRouter;
