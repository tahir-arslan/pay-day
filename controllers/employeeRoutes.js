const router = require('express').Router();
const sequelize = require('../config/connection');
const { Employee, Timesheet } = require('../models');
const withAuth = require('../utils/auth');

router.get('/clockin', withAuth, (req, res) => {
    res.render('employee-clockin', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/dashboard', withAuth, (req,res) => {
    Timesheet.findAll({
    where: {
        employee_id: req.session.employee_id
    },
    attributes: [
        'id',
        'time_in',
        'time_out'
    ],
    include: [
        {
            model: Employee,
            attributes: ['first_name', 'last_name']
        }
    ]        
    })
    .then(dbTimesheetData => {
        const data = dbTimesheetData.map(element => element.get({ plain: true }));
        let timesheetData = [];
        const employeeName = req.session.employee_name;
        data.map(element => {
            let timesheet = {};
            const date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
            timesheet.date = date;
            timesheet.time_in = new Date(element.time_in).getHours() + ":" + new Date(element.time_in).getMinutes();
            timesheet.time_out = new Date(element.time_out).getHours() + ":" + new Date(element.time_out).getMinutes();
            let timeDifference = new Date(element.time_out) - new Date(element.time_in) - 60 * 60 * 1000;
            const hr = Math.floor(timeDifference / (60 * 60 * 1000));
            timeDifference = timeDifference - hr * 60 * 60 * 1000;
            const min = Math.floor(timeDifference / (60 * 1000));
            timesheet.total_time = hr + ":" + min;
            timesheetData.push(timesheet);
        });
        
        console.dir(timesheetData)
        res.render('employee-dashboard', {
            timesheetData,
            employeeName,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;