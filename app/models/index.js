///<reference path="../../typings/express/express.d.ts" />
///<reference path="../../typings/node/node.d.ts" />
///<reference path="../../typings/lodash/lodash.d.ts" />
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var lodash = require('lodash');
var config = require('config');
var sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    dialect: 'mysql',
    port: 3306,
    timezone: '+09:00'
});
var db = {};
fs.readdirSync(__dirname).filter(function (file) {
    return (file.match(/(js)$/)) && (file !== 'index.js');
}).forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});
module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
