const router = require('express').Router();
const { Employee, Timesheet } = require('../../models');
const withAuth = require('../../utils/auth');
const managerAuth = require('../../utils/managerAuth');

router.get('/', (req, res) => {
    Employee.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbEmployeeData => res.json(dbEmployeeData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id,
        },
        attributes: { exclude: ['password'] },
        include: [
            {
                model: Timesheet,
                attributes: ['id', 'time_in', 'time_out']
            },
        ]
    })
        .then(dbEmployeeData => {
            if (!dbEmployeeData) {
                res.status(404).json({
                    message: 'No employee found with this id'
                });
                return;
            }
            res.json(dbEmployeeData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    Employee.create({
        is_manager: req.body.is_manager,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        hourly_wage: req.body.hourly_wage,
        password: req.body.password
    })
        .then(dbEmployeeData => {
            res.json(dbEmployeeData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.put('/:id', (req, res) => {
    // if (req.session.employee_id === req.params.id || req.session.is_manager) {
        Employee.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
            .then(dbEmployeeData => {
                if (!dbEmployeeData[0]) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbEmployeeData)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    // } else {
    //     res.status(401).json({ message: 'You have no right to change the information of this employee.' })
    // }
});

router.delete('/:id', (req, res) => {
    Employee.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbEmployeeData => {
            if (!dbEmployeeData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbEmployeeData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    Employee.findOne({
        where: {
            first_name: req.body.first_name,
            last_name: req.body.last_name
        }
    })
        .then(dbEmployeeData => {
            if (!dbEmployeeData) {
                res.status(400).json({ message: 'No employee with this name!' });
                return;
            }
            const validPassword = dbEmployeeData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password' });
                return;
            }
            req.session.save(() => {
                req.session.employee_id = dbEmployeeData.id;
                req.session.is_manager = dbEmployeeData.is_manager;
                req.session.employee_name = dbEmployeeData.first_name +" " + dbEmployeeData.last_name;
                req.session.loggedIn = true;
                res.json({ user: dbEmployeeData, message: 'You are now logged in!' });
            });
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end()
    }
});

module.exports = router;