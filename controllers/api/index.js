const router = require('express').Router();
const employeeRoutes = require('./employeeRoutes');
const timesheetRoutes = require('./timesheetRoutes');

router.use('/employees', employeeRoutes);
router.use('/timesheet', timesheetRoutes);

module.exports = router;