const router = require('express').Router();
const sequelize = require('../config/connection');
const { Employee, Timesheet } = require('../models');

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/employee/clockin');
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/employee/clockin');
        return;
    }
    res.render('login');
})

// router.get('/login', (req, res) => {
//   if (req.session.loggedIn && req.cookies['secondAuth']) {
//     res.redirect('/dashboard');
//     return;
//   } else if (req.session.loggedIn && !req.cookies['secondAuth']) {
//     req.session.destroy(() => {
//       res.status(204).end();
//     });
//   }
//   res.render('login');
// });

// router.get('/signup', (req, res) => {
//   if (req.session.loggedIn) {
//     res.redirect('/dashboard');
//     return;
//   }

//   res.render('signup');
// });

// router.get('/search', (req, res) => {
//   if (req.session.loggedIn) {
//     res.render('search', {loggedIn: req.session.loggedIn,});
//     return;
//   } else {
//     res.redirect('/login');
//   }
// });

// router.get('/post/:id', (req, res) => {
//   Post.findOne({
//     where: {
//       id: req.params.id
//     },
//     attributes: [
//       'id',
//       'title',
//       'content',
//       'created_at',
//     ],
//     include: [
//       {
//         model: Comment,
//         attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
//         include: {
//           model: User,
//           attributes: ['username']
//         }
//       },
//       {
//         model: User,
//         attributes: ['username']
//       }
//     ]
//   })
//     .then(dbPostData => {
//       if (!dbPostData) {
//         res.status(404).json({ message: 'No post found with this id' });
//         return;
//       }

//       const post = dbPostData.get({ plain: true });
//       const check = Boolean(req.cookies['secondAuth']);
//       res.render('singlepost', {
//         post,
//         loggedIn: req.session.loggedIn,
//         cookieCheck: check
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

module.exports = router;