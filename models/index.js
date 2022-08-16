const Employee = require('./Employee');
const Timesheet = require('./Timesheet');

Employee.hasMany(Timesheet, {
    foreignKey: 'employee_id'
});

Timesheet.belongsTo(Employee, {
    foreignKey: 'employee_id'
});

module.exports = { Employee, Timesheet };