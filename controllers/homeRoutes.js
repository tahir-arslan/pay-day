const router = require('express').Router();
const sequelize = require('../config/connection');
const { Employee, Timesheet } = require('../models');

router.get('/', (req, res) => {
    if (req.session.is_manager) {
        res.redirect('/manager/dashboard');
        return;
    } else if (req.session.loggedIn) {
        res.redirect('/employee/clockin');
        return;
    }
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    if (req.session.is_manager) {
        res.redirect('/manager/dashboard')
        return;
    } else if (req.session.loggedIn) {
        res.redirect('/employee/clockin');
        return;
    }
    res.render('login');
});

module.exports = router;