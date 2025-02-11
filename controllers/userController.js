const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    const { username, email, phone_num, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        phone_num,
        address,
        password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
};
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
      if (err || !user || !user.comparePassword(password)) {
          return res.status(401).send('Invalid credentials');
      }
      req.session.user = {
          id: user._id,
          username: user.username,
          email: user.email,
      };

      res.redirect('/user/profile'); 
  });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@gmail.com' && password === '12345678') {
        req.session.user = { email, role: 'admin' };
        return res.redirect('/admin_dashboard'); 
    }
    const user = await User.findOne({ email });

    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = user;
            res.redirect('/index'); 
        } else {
            res.render('login', { error: 'Invalid email or password.' });
        }
    } else {
        res.render('login', { error: 'Invalid email or password.' });
    }
};

exports.registerUser = async (req, res) => {
    const { username, email, phone_num, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        email,
        phone_num,
        address,
        password: hashedPassword
    });
    try {
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error saving user:', error);
        res.render('register', { error: 'Registration failed. Please try again.' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); 
      res.render('admin_users', { users }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error'); 
    }
  };

  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      await User.findByIdAndDelete(userId);
      res.redirect('/admin_users');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedData = {
        username: req.body.username,
        email: req.body.email,
        phone_num: req.body.phone_num,
        address: req.body.address,
      };
      await User.findByIdAndUpdate(userId, updatedData);
      res.redirect('/admin_users');
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Internal Server Error');
    }
  };

exports.getUserProfile = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('User not authenticated');
    }
};

