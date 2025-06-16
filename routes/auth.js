const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.userId = user._id;
    res.redirect('/students');
  } else {
    res.send('Invalid login');
  }
});

router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;