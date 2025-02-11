const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/auth');
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/admin_dashboard', (req, res) => {
    res.render('admin_dashboard');
});
router.post('/update-user/:id', userController.updateUser);
router.post('/delete-user/:id', userController.deleteUser);
router.get('/index', (req, res) => {
    res.render('index', { user: req.session.user });
});
router.get('/admin_users', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', isAuthenticated, userController.getUserProfile);

module.exports = router;
