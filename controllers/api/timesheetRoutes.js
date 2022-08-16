const router = require('express').Router();
const { Op } = require('sequelize');
const { Employee, Timesheet } = require('../../models');
const withAuth = require('../../utils/auth');
const managerAuth = require('../../utils/managerAuth');

router.get('/', (req, res) => {
    Timesheet.findAll({
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

router.get('/check', (req, res) => {
    const currentDate = new Date(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate());
    const laterDate = new Date(currentDate);
    laterDate.setDate(laterDate.getDate() + 1);
    console.dir(currentDate, laterDate);
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

router.get('/:id', (req, res) => {
    Timesheet.findOne({
        where: {
            id: req.params.id
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

router.put('/clockout', (req, res) => {
    const currentDate = new Date(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate());
    const laterDate = new Date(currentDate);
    laterDate.setDate(laterDate.getDate() + 1);
    console.dir(currentDate, laterDate);
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
        .then(dbTimesheetData => {
            const id = dbTimesheetData.id;
            Timesheet.update({
                time_out: new Date()
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
    Timesheet.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
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

router.delete('/:id', (req, res) => {
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