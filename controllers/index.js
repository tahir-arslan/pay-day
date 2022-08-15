const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes.js');
const employeeRoutes = require('./employeeRoutes.js');
const managerRoutes= require('./managerRoutes.js');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/employee', employeeRoutes);
router.use('/manager', managerRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;