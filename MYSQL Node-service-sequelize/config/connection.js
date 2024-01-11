const { Sequelize } = require("sequelize");
const db = {};
const sequelize = new Sequelize(
  "college",
  "root",
  "",
  
  {
    logging: false,
    host: "localhost",
    port: "3306",
    dialect: "mysql",
    timezone: "+05:30",
    pool: {
      max: 20,
      min: 0,
      acquire: 100000,
      idle: 20000,
    },
    define: {
      freezeTableName: true,
      plain: true,
    },
    dialectOptions: {
      //useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
    waitForConnections: true, // Wait for a connection to be established
    queueLimit: 0, // No limit to the number of queued queries when waiting for a connection
  }
);

sequelize
  .authenticate()
  .then(() => {
    db.connection = true;
    console.log(
      "Connection has been established successfully with College DataBase."
    );
  })
  .catch((error) => {
    db.connection = false;
    // logger.logData('error', Unable to connect to the Tender Health database:  ${error.message});
    console.error(
      "Unable to connect to the Tender Health database: ",
      error.message
    );
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
