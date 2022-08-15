const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

class Timesheet extends Model {}

Timesheet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        time_in: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: Sequelize.NOW
        },
        time_out: {
            type: DataTypes.DATE,
            allowNull: true
        },
        total_time: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'employee',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'timesheet'
    }
);

module.exports = Timesheet;