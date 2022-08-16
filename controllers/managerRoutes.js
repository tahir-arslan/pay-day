const router = require('express').Router();
const sequelize = require('../config/connection');
const { Employee, Timesheet } = require('../models');
const withAuth = require('../utils/auth');
const managerAuth = require('../utils/managerAuth');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const duration = require('dayjs/plugin/duration');
dayjs.extend(utc);
dayjs.extend(duration)


router.get('/dashboard', withAuth, managerAuth, (req, res) => {
    Employee.findAll({
        where: {
            is_manager: false
        },
        attributes: { exclude: ['password']},
        include: [
            {
                model: Timesheet,
                attributes: ['id', 'time_in', 'time_out']
            }
        ]
    })
        .then(dbEmployeeData => {
            const employees = dbEmployeeData.map(employee => employee.get({ plain: true }));
            res.render('manager-dashboard', {
                employees,
                is_manager: req.session.is_manager,
                loggedIn: req.session.loggedIn
            });
        })
});

router.get('/view/:id', withAuth, managerAuth, (req, res) => {
    const employeeData = Employee.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password']}
    });

    const timesheetData = Timesheet.findAll({
        where: {
            employee_id: req.params.id
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
    });

    Promise.all([employeeData, timesheetData])
    .then(dbData => {
        const employee = dbData[0].get({ plain: true });
        const timesheets = dbData[1].map(timesheet => timesheet.get({ plain: true }));
        let timesheetData = [];
        timesheets.map(shift => {
            let timesheet = {};
            timesheet.id = shift.id;
            console.dir(timesheet.id);
            const date = dayjs(shift.time_in).format('YYYY-MM-DD');
            timesheet.date = date;
            const time_in = dayjs(shift.time_in).format('HH:mm');
            timesheet.time_in = time_in;
            const time_out = dayjs(shift.time_out).format('HH:mm');
            timesheet.time_out = time_out;
            const totalTime = dayjs.duration(shift.total_time, 'minutes').format('HH:mm');
            timesheet.totalTime = totalTime;
            console.dir(totalTime);
            timesheetData.push(timesheet);
        })

        res.render('viewemployee', {
            timesheetData,
            employee,
            is_manager: req.session.is_manager,
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/add', withAuth, managerAuth, (req, res) => {
    res.render('addemployee', {
        is_manager: req.session.is_manager,
        loggedIn: req.session.loggedIn
    })
})

module.exports = router;