const router = require('express').Router();
const sequelize = require('../config/connection');
const { Employee, Timesheet } = require('../models');
const withAuth = require('../utils/auth');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const duration = require('dayjs/plugin/duration');
dayjs.extend(utc);
dayjs.extend(duration)

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
        'time_out',
        'total_time'
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
        const employeeName = req.session.employee_name;
        let timesheetData = [];
        data.map(shift => {
            let timesheet = {};
            const date = dayjs(shift.time_in).format('YYYY-MM-DD');
            timesheet.date = date;
            const time_in = dayjs(shift.time_in).format('HH:mm');
            timesheet.time_in = time_in;
            const time_out = dayjs(shift.time_out).format('HH:mm');
            timesheet.time_out = time_out;
            const totalTime = dayjs.duration(shift.total_time, 'minutes').format('HH:mm');
            timesheet.totalTime = totalTime;
            timesheetData.push(timesheet);
        })
        
        res.render('employee-dashboard', {
            timesheetData,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;