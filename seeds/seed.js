const sequelize = require('../config/connection');
const { Employee } = require('../models');

const employeeSeedData = require('./employeeSeedData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const readers = await Employee.bulkCreate(employeeSeedData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();