'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models/tables
db.Family = require('../models/family.js')(sequelize, Sequelize);  
db.User = require('../models/users.js')(sequelize, Sequelize);
db.Chore = require('../models/chores.js')(sequelize, Sequelize);  


// Relations
db.Chore.belongsTo(db.User);  
db.User.hasMany(db.Chore);  

// CHASE DO NOT RE-ENABLE THIS. I HAD TO DISBLE IT TO GET THE PUT REQUEST TO WORK RIGHT.

//*******************************//
// db.User.belongsTo(db.Family);  
// db.Family.hasMany(db.User);
//*******************************//

module.exports = db;
