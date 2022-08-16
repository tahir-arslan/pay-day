const managerAuth = (req, res, next) => {
    if (!req.session.is_manager) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = managerAuth;