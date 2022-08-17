const router = require('express').Router();
const { Op } = require('sequelize');
const { Employee, Timesheet } = require('../../models');
const withAuth = require('../../utils/auth');
const managerAuth = require('../../utils/managerAuth');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

router.get('/', withAuth, (req, res) => {
    Timesheet.findAll({
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
        .then(dbTimesheetData => res.json(dbTimesheetData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.get('/check', withAuth, (req, res) => {
    const currentDate = dayjs().startOf('day').utc().format();
    const laterDate = dayjs(currentDate).add(1, 'day').utc().format();

    Timesheet.findOne({
        where: {
            employee_id: req.session.employee_id,
            time_in: { [Op.between]: [currentDate, laterDate] }
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
        .then(dbTimesheetData => res.json(dbTimesheetData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.get('/:id', withAuth, (req, res) => {
    Timesheet.findOne({
        where: {
            id: req.params.id
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
        .then(dbTimesheetData => res.json(dbTimesheetData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.post('/', withAuth, (req, res) => {
    Timesheet.create({
        employee_id: req.session.employee_id
    })
        .then(dbTimesheetData => res.json(dbTimesheetData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

router.put('/clockout', withAuth, (req, res) => {
    const currentDate = dayjs().startOf('day').utc().format();
    const laterDate = dayjs(currentDate).add(1, 'day').utc().format();
    Timesheet.findOne({
        where: {
            employee_id: req.session.employee_id,
            time_in: { [Op.between]: [currentDate, laterDate] }
        },
        attributes: [
            'id',
            'time_in',
        ],
        include: [
            {
                model: Employee,
                attributes: ['first_name', 'last_name']
            }
        ]
    })
        .then(dbTimesheetData => {
            const id = dbTimesheetData.id;
            const time_in = dbTimesheetData.time_in;
            const time_out = new Date();
            const total_time = dayjs(time_out).diff(dayjs(time_in), 'minutes');

            Timesheet.update({
                time_out: time_out,
                total_time: total_time
            },
            {
                individualHooks: true,
                where: {
                    id: id
            }
            })
                .then(dbTimesheetData => {
                    if (!dbTimesheetData[0]) {
                        res.status(404).json({ message: 'No timesheet found with this id' });
                        return;
                    }
                    res.json(dbTimesheetData)
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        });
});

router.put('/:id', (req, res) => {
    const time_in = dayjs(req.body.date + req.body.time_in).utc().format();
    const time_out = dayjs(req.body.date + req.body.time_out).utc().format();
    const total_time = dayjs(time_out).diff(dayjs(time_in), 'minutes');
    const id = req.params.id;
    Timesheet.update({
        time_in: time_in,
        time_out: time_out,
        total_time: total_time
    },
    {
        individualHooks: true,
        where: {
            id: req.params.id
    }
    })
        .then(dbTimesheetData => {
            if (!dbTimesheetData[0] && !dbTimesheetData[1]) {
                res.status(404).json({ message: 'No timesheet found with this id' });
                return;
            } else if (!dbTimesheetData[0] && dbTimesheetData[1]) {
                res.status(404).json({ message: "You didn't change anything."});
                return;
            }
            res.json(dbTimesheetData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', withAuth, managerAuth, (req, res) => {
    Timesheet.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbTimesheetData => {
            if (!dbTimesheetData) {
                res.status(404).json({ message: 'No timesheet found with this id' });
                return;
            }
            res.json(dbTimesheetData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;