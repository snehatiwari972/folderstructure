const Sequelize = require("sequelize");
const db = require('../../config/connection');

const Student = db.sequelize.define("student", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, 
});

module.exports = Student;
